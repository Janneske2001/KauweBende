import './style.css'

import { createScene } from './scene/scene.js'
import { createCamera } from './scene/camera.js'
import { createRenderer } from './scene/renderer.js'
import { createControls } from './scene/controls.js'
import { addLights } from './scene/lighting.js'

import { createGrid } from './objects/grid.js'
import { createSun } from './objects/sun.js'
import { createProjects } from './objects/projects.js'

import { createInteraction } from './interaction/interaction.js'

import { projects } from './data/projectList.js'

// Scene
const scene = createScene()

// Camera
const { camera } = createCamera()

// Renderer + Controls
const renderer = createRenderer(camera)
const controls = createControls(camera, renderer.domElement)
window.controls = controls

// Lights
addLights(scene)

// Objects
const { gridTexture } = createGrid(scene)
createSun(scene)
const objects = createProjects(scene, projects)

// Interaction
const interaction = createInteraction(camera, controls, objects)

// ---------------------------------------------------------------------------------  Animation
function animate() {

  interaction.update(gridTexture)

  controls.update()
  renderer.render(scene, camera)

  requestAnimationFrame(animate)

}

animate()