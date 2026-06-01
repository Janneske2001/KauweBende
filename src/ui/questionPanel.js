// ui/questionPanel.js
let isPanelOpen = false

export function showQuestionPanel(categoryTitle) {
    const titleElem = document.getElementById("question-title")
    if (titleElem) titleElem.textContent = categoryTitle

    const textElem = document.getElementById("question-text")
    if (textElem) textElem.textContent = "✨ Loading question... ✨"

    const panel = document.getElementById("question-panel")
    panel.classList.remove("hidden")
    void panel.offsetHeight
    panel.classList.add("active")
    isPanelOpen = true
}

export function closeQuestionPanel() {
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