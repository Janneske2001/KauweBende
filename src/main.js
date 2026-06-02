import './style.css'

import { createScene } from './scene/scene.js'
import { createCamera } from './scene/camera.js'
import { createRenderer } from './scene/renderer.js'
// import { createControls } from './scene/controls.js'   // DELETED – no controls
import { addLights } from './scene/lighting.js'

import { createGrid } from './objects/grid.js'
import { createSun } from './objects/imgbg.js'
import { createProjects } from './objects/projects.js'

import { createInteraction } from './interaction/interaction.js'

import { projects } from './data/projectList.js'

import { initRulesModal, showRulesModal, closeRulesModal } from './ui/rulesModal.js'


// Scene
const scene = createScene()

// Camera
const { camera } = createCamera()

// Renderer + Controls
const renderer = createRenderer(camera)
// window.controls = controls

// Lights
addLights(scene)

// Objects
const { gridTexture } = createGrid(scene)
createSun(scene)
const objects = createProjects(scene, projects)

initRulesModal()

// Interaction
const interaction = createInteraction(camera, objects)



// ---------------------------------------------------------------------------------  Animation
function animate() {

  interaction.update(gridTexture)

  // controls.update()
  renderer.render(scene, camera)

  requestAnimationFrame(animate)

}

const rulesBtn = document.getElementById("rules-button")
const closeRulesBtn = document.getElementById("close-rules")
const rulesModal = document.getElementById("rules-modal")

if (rulesBtn) {
  rulesBtn.addEventListener("click", showRulesModal)
  rulesBtn.addEventListener("touchstart", (e) => {
    e.preventDefault()
    showRulesModal()
  })
}
if (closeRulesBtn) {
  closeRulesBtn.addEventListener("click", closeRulesModal)
  closeRulesBtn.addEventListener("touchstart", (e) => {
    e.preventDefault()
    closeRulesModal()
  })
}
// Close modal when clicking outside the content
if (rulesModal) {
  rulesModal.addEventListener("click", (e) => {
    if (e.target === rulesModal) closeRulesModal()
  })
}

animate()