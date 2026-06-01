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
    if (textElem) textElem.textContent = "🤖 Loading question... 🤖"

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