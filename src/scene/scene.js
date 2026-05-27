import * as THREE from 'three'

// Scene
export function createScene() {

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000016)

    // Adding Fog To Conceal Grid Edges
    scene.fog = new THREE.Fog(0x000016, 10, 60)

    return scene
}