// ui/questionPanel.js
let isPanelOpen = false
let currentCategoryId = null
let rerollUsed = false

// TTS State
let currentUtterance = null
let voicesReady = false


function getDutchVoice() {
    const voices = window.speechSynthesis.getVoices()
    return voices.find(v => v.lang === 'nl-NL' && v.name.includes('Female')) 
            || voices.find(v => v.lang === 'nl-NL')
            || voices.find(v => v.lang.startsWith('nl'))
}


export async function speakQuestion() {
    if (!window.speechSynthesis) return;

    // Stop any ongoing speech
    if (currentUtterance) {
        window.speechSynthesis.cancel();
        currentUtterance = null;
    }

    const textElem = document.getElementById("question-text");
    const questionText = textElem?.innerText;
    if (!questionText || questionText === "✨ Loading question... ✨") return;

    // --- Workaround for iOS WebKit bug: Prime with a silent utterance ---
    const dummyUtterance = new SpeechSynthesisUtterance('');
    dummyUtterance.volume = 0; // Set volume to 0 so it's silent
    window.speechSynthesis.speak(dummyUtterance);
    // ----------------------------------------------------------------

    // Slight delay to let the engine finish initializing
    await new Promise(resolve => setTimeout(resolve, 50));

    // Now create and speak the actual question
    const utterance = new SpeechSynthesisUtterance(questionText);
    utterance.lang = 'nl-NL';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    const dutchVoice = window.speechSynthesis.getVoices().find(v => v.lang === 'nl-NL');
    if (dutchVoice) utterance.voice = dutchVoice;

    utterance.onend = () => { currentUtterance = null; };
    utterance.onerror = () => { currentUtterance = null; };

    window.speechSynthesis.speak(utterance);
    currentUtterance = utterance;
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