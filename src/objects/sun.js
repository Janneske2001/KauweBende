import * as THREE from 'three'

// Vapor Sun
export function createSun(scene) {

    const sunGeometry = new THREE.PlaneGeometry(10, 5)
    const sunTexture = new THREE.TextureLoader().load('../images/VaporSun.png')

    const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture })
    sunMaterial.transparent = true

    const plane = new THREE.Mesh(sunGeometry, sunMaterial)

    plane.position.y = 2.5
    plane.position.z = -5

    scene.add(plane)
}