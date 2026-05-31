import * as THREE from 'three'

// PNG Background floating
export function createSun(scene) {

    const sunGeometry = new THREE.PlaneGeometry(10, 5)
    const sunTexture = new THREE.TextureLoader().load('../images/VaporSun.png')

    const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture })
    sunMaterial.transparent = true

    const plane = new THREE.Mesh(sunGeometry, sunMaterial)

    plane.position.y = 2.5
    plane.position.z = -10

    scene.add(plane)
}