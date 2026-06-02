// ui/questionPanel.js
let isPanelOpen = false
let currentCategoryId = null
let rerollUsed = false

let currentUtterance = null

export function speakQuestion() {
    if (!window.speechSynthesis) {
        console.warn("Text-to-speech not supported")
        return
    }
    // Stop any ongoing speech
    if (currentUtterance) {
        window.speechSynthesis.cancel()
        currentUtterance = null
    }
    const questionText = document.getElementById("question-text")?.innerText
    if (!questionText || questionText === "✨ Loading question... ✨") return
    
    const utterance = new SpeechSynthesisUtterance(questionText)
    utterance.lang = 'nl-NL'  // Dutch (Netherlands) – adjust if needed
    utterance.rate = 0.9      // Slightly slower for clarity
    utterance.pitch = 1.0
    // Try to pick a female voice if available
    window.speechSynthesis.onvoiceschanged = () => {
        const voices = window.speechSynthesis.getVoices()
        const preferred = voices.find(voice => voice.lang === 'nl-NL' && voice.name.includes('Female')) 
                        || voices.find(voice => voice.lang === 'nl-NL')
        if (preferred) utterance.voice = preferred
        window.speechSynthesis.speak(utterance)
    }
    // If voices already loaded, speak immediately
    if (window.speechSynthesis.getVoices().length > 0) {
        const voices = window.speechSynthesis.getVoices()
        const preferred = voices.find(voice => voice.lang === 'nl-NL' && voice.name.includes('Female')) 
                        || voices.find(voice => voice.lang === 'nl-NL')
        if (preferred) utterance.voice = preferred
        window.speechSynthesis.speak(utterance)
    } else {
        window.speechSynthesis.speak(utterance)
    }
    currentUtterance = utterance
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