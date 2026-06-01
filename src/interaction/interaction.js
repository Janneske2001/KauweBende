import * as THREE from 'three'
// Remove the old import:
// import { showProject } from '../ui/projectPanel.js'

// Add the new import:
import { 
    showQuestionPanel, 
    closeQuestionPanel, 
    setQuestionText, 
    isQuestionPanelOpen,
    getCurrentCategoryId,
    isRerollAvailable,
    markRerollUsed
} from '../ui/questionPanel.js'

export function createInteraction(camera, objects) {
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    const clock = new THREE.Clock()

    let hoveredObject = null
    let selectedObject = null          // keeps track of clicked object for visual feedback
    let projectOpen = false             // we keep this false always – no panel

    // Gyro/Touch state (same as before)
    let touchStartTime = 0
    let touchStartPosition = { x: 0, y: 0 }
    let isTouching = false
    let lastTouchPosition = { x: 0, y: 0 }
    
    let gyroRotation = { x: 0, y: 0, z: 0 }
    let gyroSupported = false
    let gyroEnabled = false
    let permissionButton = null
    let initialOrientation = null
    
    // Reliable mobile/tablet detection including iPads (which may report as Mac)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) // iPad on iOS13+
    || ('ontouchstart' in window) && window.innerWidth <= 1024; // fallback
    
    // ---------- Gyro helper functions (unchanged) ----------
    function handleGyro(event) {
        if (!gyroEnabled) return   // no projectOpen check needed anymore
        let beta = event.beta || 0
        let gamma = event.gamma || 0
        let alpha = event.alpha || 0
        if (initialOrientation === null) {
            initialOrientation = { beta, gamma, alpha }
        }
        let relativeBeta = beta - (initialOrientation.beta || 0)
        let relativeGamma = gamma - (initialOrientation.gamma || 0)
        const maxTilt = 45
        let targetRotX = Math.max(-maxTilt, Math.min(maxTilt, relativeBeta)) / maxTilt
        let targetRotY = Math.max(-maxTilt, Math.min(maxTilt, relativeGamma)) / maxTilt
        targetRotX = -targetRotX
        targetRotY = targetRotY
        gyroRotation.x += (targetRotX * 0.8 - gyroRotation.x) * 0.15
        gyroRotation.y += (targetRotY * 0.8 - gyroRotation.y) * 0.15
    }
    
    function createPermissionButton() {
        if (permissionButton) permissionButton.remove()
        permissionButton = document.createElement('button')
        permissionButton.id = 'gyro-permission-button'
        permissionButton.textContent = '🎮 Enable Gyro'
        permissionButton.style.position = 'fixed'
        permissionButton.style.bottom = '20px'
        permissionButton.style.left = '20px'
        permissionButton.style.zIndex = '500'
        permissionButton.style.padding = '8px 16px'
        permissionButton.style.background = 'rgba(0,0,0,0.8)'
        permissionButton.style.color = '#C056ED'
        permissionButton.style.border = 'none'
        permissionButton.style.borderRadius = '20px'
        permissionButton.style.fontSize = '12px'
        permissionButton.style.fontWeight = 'bold'
        permissionButton.style.cursor = 'pointer'
        permissionButton.style.fontFamily = 'monospace'
        permissionButton.style.pointerEvents = 'auto'
        permissionButton.style.backdropFilter = 'blur(5px)'
        permissionButton.style.border = '1px solid rgba(157, 0, 255, 0.3)'
        document.body.appendChild(permissionButton)
        return permissionButton
    }
    
    function calibrateGyro() {
        initialOrientation = null
        const indicator = document.getElementById('gyro-indicator')
        if (indicator) {
            const originalText = indicator.textContent
            indicator.textContent = '🎯 Gecalibreerd!'
            indicator.style.background = 'rgba(0,0,0,0.9)'
            setTimeout(() => {
                if (gyroEnabled) {
                    indicator.textContent = originalText
                    indicator.style.background = 'rgba(0,0,0,0.8)'
                }
            }, 1500)
        }
    }
    
    function createGyroControlPanel() {
        const panel = document.createElement('div')
        panel.id = 'gyro-panel'
        panel.style.position = 'fixed'
        panel.style.bottom = '20px'
        panel.style.right = '20px'
        panel.style.zIndex = '501'
        panel.style.display = 'flex'
        panel.style.flexDirection = 'column'
        panel.style.alignItems = 'flex-end'
        panel.style.gap = '8px'
        panel.style.pointerEvents = 'none'
        
        const calibrateBtn = document.createElement('button')
        calibrateBtn.id = 'gyro-calibrate'
        calibrateBtn.textContent = '🎯 Calibreren'
        calibrateBtn.style.background = 'rgba(0,0,0,0.8)'
        calibrateBtn.style.color = '#C056ED'
        calibrateBtn.style.border = '1px solid #C056ED'
        calibrateBtn.style.borderRadius = '20px'
        calibrateBtn.style.padding = '6px 12px'
        calibrateBtn.style.fontSize = '12px'
        calibrateBtn.style.cursor = 'pointer'
        calibrateBtn.style.fontFamily = 'monospace'
        calibrateBtn.style.backdropFilter = 'blur(5px)'
        calibrateBtn.style.pointerEvents = 'auto'
        calibrateBtn.style.transition = 'all 0.2s'
        calibrateBtn.onclick = (e) => {
            e.stopPropagation()
            calibrateGyro()
        }

        const indicator = document.createElement('div')
        indicator.id = 'gyro-indicator'
        indicator.textContent = '🎮 Gyro Aan'
        indicator.style.background = 'rgba(0,0,0,0.8)'
        indicator.style.padding = '6px 12px'
        indicator.style.borderRadius = '20px'
        indicator.style.fontSize = '12px'
        indicator.style.color = '#C056ED'
        indicator.style.fontFamily = 'monospace'
        indicator.style.backdropFilter = 'blur(5px)'
        indicator.style.border = '1px solid #C056ED'
        indicator.style.pointerEvents = 'none'
        indicator.style.whiteSpace = 'nowrap'
        indicator.style.transition = 'all 0.2s'
        
        panel.appendChild(calibrateBtn)
        panel.appendChild(indicator)
        document.body.appendChild(panel)
        return { indicator, calibrateBtn }
    }
    
    async function requestGyroPermission() {
        if (!isMobile) return
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            const button = createPermissionButton()
            button.onclick = async (e) => {
                e.stopPropagation()
                try {
                    const response = await DeviceOrientationEvent.requestPermission()
                    if (response === 'granted') {
                        window.addEventListener('deviceorientation', handleGyro)
                        gyroSupported = true
                        gyroEnabled = true
                        button.remove()
                        createGyroControlPanel()
                        showGyroIndicator(true)
                    }
                } catch (error) {
                    console.error('Gyro permission denied:', error)
                    button.textContent = '❌ Gyro Geweigerd'
                    setTimeout(() => button.remove(), 2000)
                }
            }
        } else if ('DeviceOrientationEvent' in window) {
            window.addEventListener('deviceorientation', handleGyro)
            gyroSupported = true
            gyroEnabled = true
            createGyroControlPanel()
            showGyroIndicator(true)
        } else {
            createGyroControlPanel()
            showGyroIndicator(false)
        }
    }
    
    function showGyroIndicator(enabled) {
        const indicator = document.getElementById('gyro-indicator')
        if (indicator) {
            if (enabled) {
                indicator.textContent = '🎮 Gyro Aan'
                indicator.style.opacity = '1'
            } else {
                indicator.textContent = '📱 Gyro Niet Beschikbaar'
                indicator.style.opacity = '0.6'
            }
        }
    }
    // ---------- End of gyro helpers ----------

    function getNormalizedCoordinates(clientX, clientY) {
        return {
            x: (clientX / window.innerWidth) * 2 - 1,
            y: -(clientY / window.innerHeight) * 2 + 1
        }
    }

    // Mouse events
    window.addEventListener("mousemove", (event) => {
        if (gyroEnabled && isMobile) return
        const coords = getNormalizedCoordinates(event.clientX, event.clientY)
        mouse.x = coords.x
        mouse.y = coords.y
    })

    // Touch events
    window.addEventListener("touchstart", (event) => {
        if (event.target.id === 'gyro-permission-button') return
        if (event.target.id === 'gyro-calibrate') return
        
        const touch = event.touches[0]
        const coords = getNormalizedCoordinates(touch.clientX, touch.clientY)
        touchStartTime = Date.now()
        touchStartPosition = { x: coords.x, y: coords.y }
        lastTouchPosition = { x: coords.x, y: coords.y }
        isTouching = true
        mouse.x = coords.x
        mouse.y = coords.y
    })

    window.addEventListener("touchmove", (event) => {
        if (event.target.id === 'gyro-permission-button') return
        if (event.target.id === 'gyro-calibrate') return
        const touch = event.touches[0]
        const coords = getNormalizedCoordinates(touch.clientX, touch.clientY)
        mouse.x = coords.x
        mouse.y = coords.y
        lastTouchPosition = { x: coords.x, y: coords.y }
    })

    window.addEventListener("touchend", (event) => {
        if (event.target.id === 'gyro-permission-button') return
        if (event.target.id === 'gyro-calibrate') return
        
        const touchDuration = Date.now() - touchStartTime
        const touchDistance = Math.hypot(
            lastTouchPosition.x - touchStartPosition.x,
            lastTouchPosition.y - touchStartPosition.y
        )
        // Short tap without much movement triggers click
        if (touchDuration < 300 && touchDistance < 0.1) {
            setTimeout(() => handleObjectClick(), 10)
        }
        isTouching = false
    })

    // Click event (desktop)
    window.addEventListener("click", (event) => {
        if (event.target.id === 'gyro-permission-button') return
        if (event.target.id === 'gyro-calibrate') return
        handleObjectClick()
    })

    // ----- Core click handler: logs the object's ID -----
    function handleObjectClick() {
        if (isQuestionPanelOpen()) return   // 👈 block clicks when panel is open
        if (!hoveredObject) return

        let obj = hoveredObject
        while (obj && !obj.userData.project) obj = obj.parent
        if (!obj) return

        const project = obj.userData.project
        console.log("Clicked object ID:", project.id)

        // Visual feedback
        if (selectedObject && selectedObject !== obj) {
            selectedObject.userData.targetScale = 1
        }
        selectedObject = obj
        selectedObject.userData.targetScale = 1.5
        setTimeout(() => {
            if (selectedObject === obj) {
                obj.userData.targetScale = 1
                selectedObject = null
            }
        }, 300)

        // Open panel with category title and category ID (for later reroll)
        showQuestionPanel(project.title, project.id)

        // Load random question from JSON file
        loadRandomQuestion(project.id).then(questionText => {
            setQuestionText(questionText)
        })
    }

    async function loadRandomQuestion(categoryId) {
    // categoryId e.g. "Positive" -> "positive.json"
    const fileName = `${categoryId.toLowerCase()}.json`
    const filePath = `/data/${fileName}`   // ✅ correct for Vite's public folder
    
    try {
        const response = await fetch(filePath)
        if (!response.ok) {
            // Log the actual error for debugging
            console.error(`HTTP ${response.status} - Failed to load ${filePath}`)
            throw new Error(`HTTP ${response.status}`)
        }
        const questions = await response.json()
        if (!Array.isArray(questions) || questions.length === 0) {
            
        }
        const randomIndex = Math.floor(Math.random() * questions.length)
        return questions[randomIndex]
        } catch (error) {
            console.error("Failed to load questions:", error, "tried path:", filePath)
            // Return a friendly fallback message
            return "🤖 Error 404, vraag niet gevonden. 🤖"
        }
    }

    // Initialize gyro on mobile
    if (isMobile) {
        setTimeout(() => {
            requestGyroPermission()
        }, 500)
    }

    // Setup reroll button (one-time event listener)
    const rerollBtn = document.getElementById("reroll-question")
    if (rerollBtn) {
    rerollBtn.addEventListener("click", async () => {
        // Reroll sound effect
        const rerollSound = new Audio('/sounds/reroll.mp3')
        rerollSound.volume = 1.0
        rerollSound.play()
        // Only reroll if panel is open and reroll hasn't been used yet
        if (isQuestionPanelOpen() && isRerollAvailable()) {
        const categoryId = getCurrentCategoryId()
        if (categoryId) {
            const newQuestion = await loadRandomQuestion(categoryId)
            setQuestionText(newQuestion)// inside the reroll button click event listener
            markRerollUsed()  // hides the button and prevents further rerolls this session
        }
        }
    })
    
    // Also handle touch for mobile
    rerollBtn.addEventListener("touchstart", (e) => {
        e.preventDefault()
        rerollBtn.click()
    })
    }

    // Close panel when clicking the close button
    const closeBtn = document.getElementById("close-question-panel")
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            closeQuestionPanel()
        })
        closeBtn.addEventListener("touchstart", (e) => {
            e.preventDefault()
            closeQuestionPanel()
        })
    }

    function update(gridTexture) {
        // ----- Hover detection (same as original) -----
        if (!gyroEnabled || isTouching || !isMobile) {
            raycaster.setFromCamera(mouse, camera)
            const intersects = raycaster.intersectObjects(objects, true) // traverse children
            
            if (intersects.length > 0) {
                let hit = intersects[0].object
                // Find the root object (the one in `objects` array)
                let root = hit
                while (root && !objects.includes(root)) {
                    root = root.parent
                }
                if (!root) root = hit

                if (hoveredObject !== root) {
                    if (hoveredObject && hoveredObject !== selectedObject) {
                        hoveredObject.userData.targetScale = 1
                    }
                    hoveredObject = root
                    if (root !== selectedObject) {
                        root.userData.targetScale = 1.2
                    }
                }
            } else {
                if (hoveredObject && hoveredObject !== selectedObject) {
                    hoveredObject.userData.targetScale = 1
                }
                hoveredObject = null
            }
        }

        // Smooth scaling
        const lerpFactor = 0.2
        objects.forEach(object => {
            const target = object.userData.targetScale || 1
            const scale = object.scale
            scale.x += (target - scale.x) * lerpFactor
            scale.y += (target - scale.y) * lerpFactor
            scale.z += (target - scale.z) * lerpFactor
        })

        // Bounce animation (only on non‑selected objects)
        const time = clock.getElapsedTime()
        objects.forEach((object, index) => {
            if (object !== selectedObject) {
                object.position.y = 1 + Math.sin(time + index) * 0.2
            }
        })

        // Rotation: gyro OR mouse/touch (no camera movement)
        objects.forEach((object) => {
            const isModel = object.userData.isModel || true

            // Auto‑rotate when idle (no gyro active and object not selected)
            if (isModel && !(gyroEnabled && isMobile && !isTouching) && object !== selectedObject) {
                object.rotation.y += 0.01
            }

            if (gyroEnabled && isMobile && !isTouching) {
                if (object !== selectedObject) {
                    object.rotation.x = -gyroRotation.x * 0.8
                    object.rotation.y = gyroRotation.y * 0.8
                    object.rotation.z = gyroRotation.z * 0.3
                } else {
                    object.rotation.x = -gyroRotation.x * 0.4
                    object.rotation.y = gyroRotation.y * 0.4
                }
            } else if (!gyroEnabled || !isMobile) {
                const rotationStrength = isTouching ? 0.3 : 0.6
                const vector = object.position.clone()
                vector.project(camera)
                const dx = mouse.x - vector.x
                const dy = mouse.y - vector.y
                object.rotation.y += (dx * rotationStrength - object.rotation.y) * 0.1
                object.rotation.x += (-dy * 0.4 - object.rotation.x) * 0.1
            }
        })

        // Animate grid texture
        if (gridTexture) {
            gridTexture.offset.y += 0.001
        }
    }

    return { update }
}