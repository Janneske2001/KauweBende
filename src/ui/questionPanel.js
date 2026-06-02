// ui/questionPanel.js
let isPanelOpen = false
let currentCategoryId = null
let rerollUsed = false

// TTS State
let currentUtterance = null
let speechPrimed = false

// ---------- HELPER: Get Dutch voice ----------
function getDutchVoice() {
    const voices = window.speechSynthesis.getVoices()
    console.log(`[TTS] Available voices: ${voices.length}`, voices.map(v => v.lang + ' ' + v.name).join(', '))
    const voice = voices.find(v => v.lang === 'nl-NL' && v.name.includes('Female')) 
                || voices.find(v => v.lang === 'nl-NL')
                || voices.find(v => v.lang.startsWith('nl'))
    if (voice) console.log(`[TTS] Selected voice: ${voice.lang} - ${voice.name}`)
    else console.warn('[TTS] No Dutch voice found')
    return voice
}

// ---------- PRIME THE SPEECH ENGINE (must be called inside a user gesture) ----------
function primeSpeech() {
    if (!window.speechSynthesis) {
        console.error('[TTS] speechSynthesis not available')
        return
    }
    if (speechPrimed) {
        console.log('[TTS] Already primed, skipping')
        return
    }
    try {
        const dummy = new SpeechSynthesisUtterance(" ")
        dummy.volume = 0
        dummy.rate = 10
        console.log('[TTS] Priming with silent utterance...')
        window.speechSynthesis.speak(dummy)
        speechPrimed = true
        console.log('[TTS] Speech primed successfully')
    } catch(e) {
        console.error('[TTS] Prime failed', e)
    }
}

// ---------- SPEAK QUESTION (synchronous, no delays) ----------
export function speakQuestion() {
    console.log('[TTS] speakQuestion called')
    if (!window.speechSynthesis) {
        console.error('[TTS] speechSynthesis not available')
        return
    }

    // Stop any ongoing speech
    if (currentUtterance) {
        console.log('[TTS] Cancelling previous utterance')
        window.speechSynthesis.cancel()
        currentUtterance = null
    }

    const textElem = document.getElementById("question-text")
    const questionText = textElem?.innerText
    console.log(`[TTS] Question text: "${questionText}"`)
    if (!questionText || questionText.includes("laden")) {
        console.warn('[TTS] Invalid or placeholder question, not speaking')
        return
    }

    const utterance = new SpeechSynthesisUtterance(questionText)
    utterance.lang = 'nl-NL'
    utterance.rate = 0.9
    utterance.pitch = 1.0
    utterance.volume = 1.0   // 0.0 to 1.0, default is 1.0

    const dutchVoice = getDutchVoice()
    if (dutchVoice) utterance.voice = dutchVoice

    utterance.onend = () => {
        console.log('[TTS] Speech ended')
        currentUtterance = null
    }
    utterance.onerror = (err) => {
        console.error('[TTS] Speech error', err)
        currentUtterance = null
    }

    console.log('[TTS] Calling window.speechSynthesis.speak()')
    window.speechSynthesis.speak(utterance)
    currentUtterance = utterance
    console.log('[TTS] Speak command issued, speaking =', window.speechSynthesis.speaking)
}

export function stopSpeaking() {
    if (window.speechSynthesis) {
        console.log('[TTS] Stopping speaking')
        window.speechSynthesis.cancel()
        currentUtterance = null
    }
}

// Helper function to play category sound
function playCategorySound(categoryId) {
    if (!categoryId) return
    const soundFile = `/sounds/${categoryId.toLowerCase()}.mp3`
    console.log(`[Sound] Playing ${soundFile}`)
    try {
        const audio = new Audio(soundFile)
        audio.volume = 0.6
        audio.play().catch(err => console.warn(`Could not play sound for ${categoryId}:`, err))
    } catch (error) {
        console.warn(`Failed to create Audio element for ${categoryId}:`, error)
    }
}

// ---------- SHOW PANEL (user gesture – prime speech here) ----------
export function showQuestionPanel(categoryTitle, categoryId) {
    console.log(`[Panel] Opening ${categoryTitle} (${categoryId})`)
    stopSpeaking()
    
    currentCategoryId = categoryId
    rerollUsed = false

    playCategorySound(categoryId)

    const titleElem = document.getElementById("question-title")
    if (titleElem) titleElem.textContent = categoryTitle

    const textElem = document.getElementById("question-text")
    if (textElem) textElem.textContent = "🤖 Vraag is aan het laden... 🤖"

    const panel = document.getElementById("question-panel")
    panel.classList.remove('category-positive', 'category-future', 'category-reflection', 'category-competitive')
    if (categoryId) {
        const categoryClass = `category-${categoryId.toLowerCase()}`
        panel.classList.add(categoryClass)
    }

    const rerollBtn = document.getElementById("reroll-question")
    if (rerollBtn) rerollBtn.style.display = "block"

    panel.classList.remove("hidden")
    void panel.offsetHeight
    panel.classList.add("active")
    isPanelOpen = true

    // PRIME SPEECH INSIDE THIS USER GESTURE
    primeSpeech()
}

export function closeQuestionPanel() {
    console.log('[Panel] Closing panel')
    stopSpeaking()
    
    currentCategoryId = null
    rerollUsed = false

    const panel = document.getElementById("question-panel")
    panel.classList.remove('category-positive', 'category-future', 'category-reflection', 'category-competitive')
    
    panel.classList.remove("active")
    setTimeout(() => {
        panel.classList.add("hidden")
        isPanelOpen = false
    }, 300)
}

export function setQuestionText(text) {
    console.log(`[Panel] Setting question text: "${text.substring(0, 50)}..."`)
    const textElem = document.getElementById("question-text")
    if (textElem) textElem.textContent = text
    stopSpeaking()  // Interrupt old speech when question changes
}

export function isQuestionPanelOpen() {
    return isPanelOpen
}

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