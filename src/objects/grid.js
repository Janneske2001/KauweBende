import * as THREE from 'three'
import { createGridTexture } from '../utils/gridTextures.js'

// Adding Dynamic Grid to the Scene
export function createGrid(scene) {

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
    grid.position.y = -2

    scene.add(grid)

    return { grid, gridTexture }
}