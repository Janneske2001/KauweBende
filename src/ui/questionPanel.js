// ui/questionPanel.js
let isPanelOpen = false
let currentCategoryId = null
let rerollUsed = false

let currentUtterance = null

// TTS State
let currentUtterance = null
let voicesReady = false

// Load voices silently – call this early
export function primeVoices() {
    if (!window.speechSynthesis) return
    // Force voice list loading
    const voices = window.speechSynthesis.getVoices()
    if (voices.length) {
        voicesReady = true
    } else {
        window.speechSynthesis.onvoiceschanged = () => {
        voicesReady = true
        console.log('Voices ready')
        }
    }
    // Also request permission or prime on iPad
    try {
        // This dummy utterance primes the system
        const dummy = new SpeechSynthesisUtterance(' ')
        window.speechSynthesis.speak(dummy)
        window.speechSynthesis.cancel()
    } catch(e) {}
}

function getDutchVoice() {
    const voices = window.speechSynthesis.getVoices()
    return voices.find(v => v.lang === 'nl-NL' && v.name.includes('Female')) 
            || voices.find(v => v.lang === 'nl-NL')
            || voices.find(v => v.lang.startsWith('nl'))
}

export async function speakQuestion() {
    if (!window.speechSynthesis) return
    
    // Stop any ongoing speech
    if (currentUtterance) {
        window.speechSynthesis.cancel()
        currentUtterance = null
    }
    
    const textElem = document.getElementById("question-text")
    const questionText = textElem?.innerText
    if (!questionText || questionText === "✨ Loading question... ✨") return
    
    // Ensure voices are ready (wait up to 1 second)
    if (!voicesReady) {
        await new Promise((resolve) => {
        if (window.speechSynthesis.getVoices().length) {
            voicesReady = true
            resolve()
        } else {
            const timeout = setTimeout(() => resolve(), 1000)
            window.speechSynthesis.onvoiceschanged = () => {
            clearTimeout(timeout)
            voicesReady = true
            resolve()
            }
        }
        })
    }
    
    const utterance = new SpeechSynthesisUtterance(questionText)
    utterance.lang = 'nl-NL'
    utterance.rate = 0.9
    utterance.pitch = 1.0
    
    const dutchVoice = getDutchVoice()
    if (dutchVoice) utterance.voice = dutchVoice
    
    utterance.onend = () => { currentUtterance = null }
    utterance.onerror = () => { currentUtterance = null }
    
    // Small delay to ensure previous cancel is processed
    setTimeout(() => {
        window.speechSynthesis.speak(utterance)
        currentUtterance = utterance
    }, 50)   
}


export function stopSpeaking() {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
        currentUtterance = null
    }
}

// Helper function to play category sound
function playCategorySound(categoryId) {
    if (!categoryId) return
    const soundFile = `/sounds/${categoryId.toLowerCase()}.mp3`
    try {
        const audio = new Audio(soundFile)
        // Optional: adjust volume (0.0 to 1.0)
        audio.volume = 0.6
        audio.play().catch(err => {
        console.warn(`Could not play sound for ${categoryId}:`, err)
        })
    } catch (error) {
        console.warn(`Failed to create Audio element for ${categoryId}:`, error)
    }
}

export function showQuestionPanel(categoryTitle, categoryId) {
    stopSpeaking()  // Stop any speech from previous panel
    
    currentCategoryId = categoryId
    rerollUsed = false

    // Play the sound for this category
    playCategorySound(categoryId)

    const titleElem = document.getElementById("question-title")
    if (titleElem) titleElem.textContent = categoryTitle

    const textElem = document.getElementById("question-text")
    if (textElem) textElem.textContent = "🤖 Vraag is aan het laden... 🤖"

    // Apply category-specific class to panel
    const panel = document.getElementById("question-panel")
    // Remove any existing category class
    panel.classList.remove('category-positive', 'category-future', 'category-reflection', 'category-competitive')
    // Add the new one based on categoryId (lowercase)
    if (categoryId) {
        const categoryClass = `category-${categoryId.toLowerCase()}`
        panel.classList.add(categoryClass)
    }

    // Show the reroll button
    const rerollBtn = document.getElementById("reroll-question")
    if (rerollBtn) rerollBtn.style.display = "block"

    panel.classList.remove("hidden")
    void panel.offsetHeight
    panel.classList.add("active")
    isPanelOpen = true
}

export function closeQuestionPanel() {
    stopSpeaking()  // Stop any speech from previous panel
    
    currentCategoryId = null
    rerollUsed = false

    const panel = document.getElementById("question-panel")
    // Remove category classes (optional – they will be replaced when next opened)
    panel.classList.remove('category-positive', 'category-future', 'category-reflection', 'category-competitive')
    
    panel.classList.remove("active")
    setTimeout(() => {
        panel.classList.add("hidden")
        isPanelOpen = false
    }, 300)
}

export function setQuestionText(text) {
    const textElem = document.getElementById("question-text")
    if (textElem) textElem.textContent = text
    stopSpeaking()  // Interrupt old speech when question changes
}

export function isQuestionPanelOpen() {
    return isPanelOpen
}

// Functions for reroll logic (used by interaction.js)
export function getCurrentCategoryId() {
    return currentCategoryId
}

export function isRerollAvailable() {
    return !rerollUsed
}

export function markRerollUsed() {
    rerollUsed = true
    const rerollBtn = document.getElementById("reroll-question")
    if (rerollBtn) rerollBtn.style.display = "none"
}