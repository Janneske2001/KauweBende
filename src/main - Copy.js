import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import './style.css'

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()


let hoveredObject = null
let targetObject = null
let selectedObject = null

let projectOpen = false

let cameraTargetPosition = null
let controlsTargetPosition = null


// Dynamic Grid Texture Making
function createGridTexture() {

  const size = 512
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size

  const ctx = canvas.getContext("2d")

  ctx.fillStyle = "#000002"
  ctx.fillRect(0, 0, size, size)

  ctx.strokeStyle = "#f40fed"
  ctx.lineWidth = 1

  const divisions = 5
  const step = size / divisions

  for (let i = 0; i <= divisions; i++) {

    const p = i * step

    ctx.beginPath()
    ctx.moveTo(p, 0)
    ctx.lineTo(p, size)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(0, p)
    ctx.lineTo(size, p)
    ctx.stroke()

  }

  return new THREE.CanvasTexture(canvas)

}



// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x000016)
// Adding Fog To Conceal Grid Edges
scene.fog = new THREE.Fog(0x000016, 10, 60)



// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)


const defaultCameraPosition = new THREE.Vector3(0, 3, 6.5)
const defaultLookTarget = new THREE.Vector3(0, 0, 0)

camera.position.copy(defaultCameraPosition)
camera.lookAt(defaultLookTarget)

// Renderer + Controls
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
// Max-Min Zoom
controls.minDistance = 3
controls.maxDistance = 8
// Prevent Clipping Bottom
controls.maxPolarAngle = Math.PI / 2
// Prevent Panning Away
const minPan = new THREE.Vector3(-5, 1, -5);
const maxPan = new THREE.Vector3(5, 2, 5);
controls.addEventListener('change', () => {
    controls.target.clamp(minPan, maxPan);
});
// controls.enablePan = false
// Lock Target
controls.target.set(0, 0.5, 0)
controls.update()


// For Resizing The Browser
window.addEventListener('resize', () => {

  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)

})

// Simple Grid
// const grid = new THREE.GridHelper(40, 40)
// scene.add(grid)
// const grid = new THREE.GridHelper(
//   100,       // size of grid
//   100,       // number of divisions
//   0xf40fed, // center line color
//   0xf40fed  // grid line color
// )
// grid.material.transparent = true
// grid.material.opacity = 0.35

// scene.add(grid)


// Adding Dynamic Grid to the Scene
const gridTexture = createGridTexture()

gridTexture.anisotropy = 8
gridTexture.wrapS = THREE.RepeatWrapping
gridTexture.wrapT = THREE.RepeatWrapping
gridTexture.repeat.set(20, 20)

const gridMaterial = new THREE.MeshBasicMaterial({
  map: gridTexture,
  transparent: false,
  opacity: 1
})

const gridGeometry = new THREE.PlaneGeometry(200, 200)

const grid = new THREE.Mesh(gridGeometry, gridMaterial)

grid.rotation.x = -Math.PI / 2
grid.position.y = -0.01

scene.add(grid)


// Vapor Sun

const sunGeometry = new THREE.PlaneGeometry( 12.5, 12.5 );
const sunTexture = new THREE.TextureLoader().load('../public/images/VaporSun.png')
const sunMaterial = new THREE.MeshBasicMaterial( { map: sunTexture } );
sunMaterial.transparent = true;
const plane = new THREE.Mesh( sunGeometry, sunMaterial );
plane.position.y = 5
plane.position.z = -20
scene.add( plane );


// Cube
const geometry = new THREE.BoxGeometry()
// const material = new THREE.MeshStandardMaterial({
//   color: 0x03b7ff
// })

// SINGLE CUBE
// const cube = new THREE.Mesh(geometry, material)

// scene.add(cube)


// ------------------------------     PROJECT DATA


// GRID OF CUBES
// const cubes = []

// const gridSize = 3
// const xSpacing = 4
// const zSpacing = 3

// for (let x = 0; x < gridSize; x++) {
//   for (let z = 0; z < gridSize; z++) {

//     const cube = new THREE.Mesh(geometry, material)

//     cube.position.x = (x - gridSize / 2) * xSpacing + (xSpacing / 2)
//     cube.position.z = (z - gridSize / 2) * zSpacing + (zSpacing / 2)
//     cube.position.y = 1

//     scene.add(cube)
//     cubes.push(cube)

//   }
// }


// Objects With Data
import { projects } from "./data/projects.js"

const objects = []
const xSpacing = 3
const zSpacing = 3

projects.forEach((project, index) => {

  // ------------------------------------------------------------------------------------------------------- LOG
  console.log("Creating project:", project.title)

  const texture = new THREE.TextureLoader().load(project.image)

  const ObjectMaterial = new THREE.MeshStandardMaterial({
    map: texture
  })

  
  ObjectMaterial.anisotropy = 16
  const object = new THREE.Mesh(geometry, ObjectMaterial)

  const rowLength = 4
  const x = index % rowLength
  const z = Math.floor(index / rowLength)

  object.position.x = (x - rowLength / 2) * xSpacing + (xSpacing / 2)
  object.position.z = (z - rowLength / 2) * zSpacing + zSpacing

  object.userData.project = project

  // ------------------------------------------------------------------------------------------------------- LOG
  console.log("Attached project:", object.userData.project.title)

  scene.add(object)
  objects.push(object)

})

// ------------------------------------------------------------------------------------------------------- LOG
console.table(projects)
console.log(objects)

objects.forEach(object => {
  object.userData.targetScale = 1 // default scale
})

// Lights
const lightTop = new THREE.PointLight(0xffffff, 0.5, 0, 0)
lightTop.position.set(0, 10, -10)
scene.add(lightTop)
const lightRight = new THREE.PointLight(0xffffff, 0.8, 0, 0)
lightRight.position.set(10, 10, 0)
scene.add(lightRight)
const lightLeft = new THREE.PointLight(0xffffff, 0.8, 0, 0)
lightLeft.position.set(-10, 10, 0)
scene.add(lightLeft)
const lightBottom = new THREE.PointLight(0xffffff, 1, 0, 0)
lightBottom.position.set(0, 10, 10)
scene.add(lightBottom)
const lightGrid = new THREE.PointLight(0xf40fed, 0.5, 0, 0)
lightGrid.position.set(0, -400, 0)
scene.add(lightGrid)


// Mouse Tracker for Object Movement
window.addEventListener("mousemove", (event) => {

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

})

const clock = new THREE.Clock()





// ---------------------------------------------------------------------------------  Animation
function animate() {
  raycaster.setFromCamera(mouse, camera)

  const intersects = raycaster.intersectObjects(objects)



  // Enlarge on Hover
  if (intersects.length > 0) {
    const object = intersects[0].object

    if (hoveredObject !== object) {

      if (hoveredObject && hoveredObject !== selectedObject) {
        hoveredObject.userData.targetScale = 1
      }

      hoveredObject = object

      // ❗ Only apply hover scale if NOT selected
      if (object !== selectedObject) {
        // I want to add that if an object is selected, it wil NOT have a hover-grow-effect
        object.userData.targetScale = 1.5
      }

    }

  } else {

    if (hoveredObject && hoveredObject !== selectedObject) {
      hoveredObject.userData.targetScale = 1
    }

    hoveredObject = null
  }

  objects.forEach(object => {
    // Smoothly lerp each axis toward targetScale
    const s = object.userData.targetScale
    object.scale.x += (s - object.scale.x) * 0.2
    object.scale.y += (s - object.scale.y) * 0.2
    object.scale.z += (s - object.scale.z) * 0.2
  })


  // Bounce Animation
  const time = clock.getElapsedTime()

  objects.forEach((object, index) => {
    if (object !== selectedObject) {
      object.position.y = 1 + Math.sin(time + index) * 0.2
    }
  })


  // Follow Mouse
  objects.forEach((object) => {

    // Project object position to screen space
    const vector = object.position.clone()
    vector.project(camera)

    // Mouse delta relative to this object
    const dx = mouse.x - vector.x
    const dy = mouse.y - vector.y

    // Apply small tilt
    object.rotation.y += (dx * 0.6 - object.rotation.y) * 0.1
    object.rotation.x += (-dy * 0.4 - object.rotation.x) * 0.1

  })

  // Move Grid
  gridTexture.offset.y += 0.003
  // Blur Grid
  // const distance = camera.position.distanceTo(grid.position)
  // grid.material.opacity = Math.min(0.6, 20 / distance)

// // Zoom In On Object When Clicked
  if (cameraTargetPosition) {

    camera.position.lerp(cameraTargetPosition, 0.1)

    if (controlsTargetPosition) {
      controls.target.lerp(controlsTargetPosition, 0.1)
    }

    if (camera.position.distanceTo(cameraTargetPosition) < 0.05) {

      cameraTargetPosition = null
      controlsTargetPosition = null

    }

  }



  requestAnimationFrame(animate)

//  cube.rotation.x += 0.01
//  cube.rotation.y += 0.01

  controls.update()

  renderer.render(scene, camera)

}




function showProject(project) {

  projectOpen = true

  controls.enablePan = false
  controls.enableZoom = false

  console.log("Opening project:", project)

  // Basic content
  document.getElementById("project-title").textContent = project.title
  document.getElementById("project-image").src = project.image
  document.getElementById("project-description").textContent = project.description
  document.getElementById("project-link").href = project.link

  // ✅ NEW: Role
  const roleElement = document.getElementById("project-role")
  if (roleElement) {
    roleElement.textContent = project.role
      ? "Role: " + project.role
      : ""
  }

  // ✅ NEW: Tech tags
  const techContainer = document.getElementById("project-tech")
  if (techContainer) {

    techContainer.innerHTML = "" // clear previous

    if (project.tech && project.tech.length > 0) {

      project.tech.forEach(t => {
        const tag = document.createElement("span")
        tag.textContent = t
        tag.classList.add("tech-tag")
        techContainer.appendChild(tag)
      })

    }

  }

  // Panel animation
  const panel = document.getElementById("project-panel")

  panel.classList.remove("hidden")

  setTimeout(() => {
    panel.classList.add("active")
  }, 10)

  // Reset animation (keep this)
  const items = document.querySelectorAll("#project-panel .panel-item")

  items.forEach(item => {
    item.style.transition = ""
  })

}


// --------------------------------------------------------------------------------- CLICK

// Click Event Zoom In
window.addEventListener("click", () => {

  if (projectOpen) return // When an Info Panel is active, Return

  if (hoveredObject) {

    targetObject = hoveredObject
    selectedObject = hoveredObject

    // Scaling up objects when selected
    selectedObject.userData.targetScale = 1.5


    cameraTargetPosition = new THREE.Vector3(
      hoveredObject.position.x,
      hoveredObject.position.y + 3.5,
      hoveredObject.position.z + 0.4
    )

    controlsTargetPosition = hoveredObject.position.clone()

    showProject(hoveredObject.userData.project)

  }

})
// window.addEventListener("click", () => {

//   if (projectOpen) return

//   if (hoveredObject) {

//     targetObject = hoveredObject
//     // open project panel
//     showProject(hoveredObject.userData.project)

//   }
//   else {
//     targetObject = null
//   }

//   // // ------------------------------------------------------------------------------------------------------- LOG
//   // objects.forEach((object, index) => {
//   //   console.log(index, object.userData.project.title)
//   // })

// })

document.getElementById("close-project").addEventListener("click", () => {

  projectOpen = false

  controls.enablePan = true
  controls.enableZoom = true

  // document.getElementById("project-panel").classList.add("hidden")

  const panel = document.getElementById("project-panel")
  const items = document.querySelectorAll("#project-panel .panel-item")

  panel.classList.remove("active")

  setTimeout(() => {
    panel.classList.add("hidden")
  }, 400) // match CSS duration

  cameraTargetPosition = defaultCameraPosition
  controlsTargetPosition = defaultLookTarget

  // Reset objects properly
  objects.forEach(object => {

    // Reset scale
    object.userData.targetScale = 1

  })
  
  // Only AFTER resetting
  selectedObject = null

})

const panel = document.getElementById("project-panel")

panel.addEventListener("click", (event) => {
  event.stopPropagation()
})




// Click Event Directly Open Site
// window.addEventListener("click", () => {

//   if (hoveredObject) {
//     const project = hoveredObject.userData
//   // ------------------------------------------------------------------------------------------------------- LOG
//     console.log("Opening project:", project.title)
//     window.open(project.link, "_blank")
//   }

// })


animate()