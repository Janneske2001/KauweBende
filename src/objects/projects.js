import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// Main function
export function createProjects(scene, projects) {

    const objects = []
    const geometry = new THREE.BoxGeometry()

    const xSpacing = 3
    const zSpacing = 3

    const textureLoader = new THREE.TextureLoader()
    const modelLoader = new GLTFLoader()

    projects.forEach((project, index) => {

        console.log("Creating project:", project.title)

        const rowLength = 1
        const x = index % rowLength
        const z = Math.floor(index / rowLength)

        const posX = (x - rowLength / 2) * xSpacing + (xSpacing / 2)
        const posZ = 0
        // const posZ = (z - rowLength / 2) * zSpacing + zSpacing

        // ============================
        // CREATE PLACEHOLDER CUBE (ALWAYS)
        // ============================
        const placeholder = createImageCube(
            project,
            geometry,
            textureLoader,
            posX,
            posZ
        )

        scene.add(placeholder)
        objects.push(placeholder)

        // ============================
        // IF MODEL → LOAD + REPLACE
        // ============================
        if (project.type === "model" && project.model) {

            modelLoader.load(

                project.model,

                (gltf) => {
                    const model = gltf.scene

                    // Center model
                    const box = new THREE.Box3().setFromObject(model)
                    const center = box.getCenter(new THREE.Vector3())
                    model.position.sub(center)

                    // Scale tweak (adjust if needed)
                    model.scale.set(1, 1, 1)

                    // Match placeholder position
                    model.position.x += posX
                    model.position.z += posZ

                    model.userData.project = project
                    model.userData.targetScale = 1

                    // Replace placeholder
                    scene.remove(placeholder)
                    objects.splice(objects.indexOf(placeholder), 1)

                    scene.add(model)
                    objects.push(model)

                    console.log("✅ Model loaded:", project.title)
                },

                undefined,

                (error) => {
                    console.warn("❌ Model failed, keeping placeholder:", error)
                }
            )
        }

    })

    console.table(projects)
    console.log(objects)

    return objects
}

// ============================
// 🧊 IMAGE CUBE CREATOR
// ============================
function createImageCube(project, geometry, textureLoader, x, z) {

    const texture = textureLoader.load(project.image)

    const material = new THREE.MeshStandardMaterial({
        map: texture
    })

    material.anisotropy = 16

    const cube = new THREE.Mesh(geometry, material)

    cube.position.set(x, 5, z)

    cube.userData.project = project
    cube.userData.targetScale = 1

    return cube
}