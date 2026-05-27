import * as THREE from 'three'

// Lights
export function addLights(scene) {

    const lightTop = new THREE.PointLight(0xffffff, 0.5, 0, 0)
    lightTop.position.set(0, 10, -10)

    const lightRight = new THREE.PointLight(0xffffff, 0.8, 0, 0)
    lightRight.position.set(10, 10, 0)

    const lightLeft = new THREE.PointLight(0xffffff, 0.8, 0, 0)
    lightLeft.position.set(-10, 10, 0)

    const lightBottom = new THREE.PointLight(0xffffff, 1, 0, 0)
    lightBottom.position.set(0, 10, 10)

    const lightGrid = new THREE.PointLight(0xC056ED, 0.5, 0, 0)
    lightGrid.position.set(0, -400, 0)

    scene.add(lightTop, lightRight, lightLeft, lightBottom, lightGrid)
}