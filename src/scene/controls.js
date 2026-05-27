import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as THREE from 'three'

// Renderer + Controls
export function createControls(camera, domElement) {

    const controls = new OrbitControls(camera, domElement)

    controls.enableDamping = true

    // Max-Min Zoom
    controls.minDistance = 3
    controls.maxDistance = 5

    // Prevent Clipping Bottom
    controls.maxPolarAngle = Math.PI / 2

    // Prevent Panning Away
    const minPan = new THREE.Vector3(-5, 1, -5);
    const maxPan = new THREE.Vector3(5, 2, 5);

    controls.addEventListener('change', () => {
        controls.target.clamp(minPan, maxPan);
    });

    // Touch-specific settings
    controls.touchRotate = true
    controls.touchZoom = true
    
    // Make controls more responsive on mobile
    controls.rotateSpeed = isMobile() ? 0.8 : 1.0
    controls.zoomSpeed = isMobile() ? 0.8 : 1.0
    
    // Lock Target
    controls.target.set(0, 0.5, 0)
    controls.update()
    
    return controls
}

// Helper function to detect mobile
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}