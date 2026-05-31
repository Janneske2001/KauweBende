// ui/questionPanel.js
let currentOpen = false

export function showQuestionPanel(categoryTitle) {
  // Set the title
    const titleElem = document.getElementById("question-title")
    if (titleElem) titleElem.textContent = categoryTitle

  // Reset text to placeholder (later you will load a real question)
    const textElem = document.getElementById("question-text")
    if (textElem) textElem.textContent = "✨ Loading question... ✨"

  // Show panel with slide animation
    const panel = document.getElementById("question-panel")
    panel.classList.remove("hidden")
  // Force reflow to trigger transition
    void panel.offsetHeight
    panel.classList.add("active")
    currentOpen = true
}

export function closeQuestionPanel() {
    const panel = document.getElementById("question-panel")
    panel.classList.remove("active")
    setTimeout(() => {
    panel.classList.add("hidden")
    currentOpen = false
    }, 300)
}

// Optional: later you can call this from interaction.js to update the question text dynamically
export function setQuestionText(text) {
    const textElem = document.getElementById("question-text")
    if (textElem) textElem.textContent = text
}

// Export a way to check if panel is open (optional)
export function isPanelOpen() {
    return currentOpen
}