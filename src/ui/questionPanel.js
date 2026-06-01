// ui/questionPanel.js
let isPanelOpen = false
let currentCategoryId = null
let rerollUsed = false

export function showQuestionPanel(categoryTitle, categoryId) {
    currentCategoryId = categoryId
    rerollUsed = false

    const titleElem = document.getElementById("question-title")
    if (titleElem) titleElem.textContent = categoryTitle

    const textElem = document.getElementById("question-text")
    if (textElem) textElem.textContent = "✨ Vraag is aan het laden... ✨"

    // Show the reroll button (it will be hidden again after one use)
    const rerollBtn = document.getElementById("reroll-question")
    if (rerollBtn) rerollBtn.style.display = "block"

    const panel = document.getElementById("question-panel")
    panel.classList.remove("hidden")
    void panel.offsetHeight
    panel.classList.add("active")
    isPanelOpen = true
}

export function closeQuestionPanel() {
    // Reset for next time
    currentCategoryId = null
    rerollUsed = false

    const panel = document.getElementById("question-panel")
    panel.classList.remove("active")
    setTimeout(() => {
        panel.classList.add("hidden")
        isPanelOpen = false
    }, 300)
}

export function setQuestionText(text) {
    const textElem = document.getElementById("question-text")
    if (textElem) textElem.textContent = text
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