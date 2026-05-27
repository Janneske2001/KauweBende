import * as THREE from 'three'

// Camera
export function createCamera() {

    const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
    )

    const defaultCameraPosition = new THREE.Vector3(0, 2, 4)
    const defaultLookTarget = new THREE.Vector3(0, 0, 0)

    camera.position.copy(defaultCameraPosition)
    camera.lookAt(defaultLookTarget)

    return { camera, defaultCameraPosition, defaultLookTarget }
}