import * as THREE from 'three'

// Renderer
export function createRenderer(camera) {

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)

    document.body.appendChild(renderer.domElement)

    // For Resizing The Browser
    window.addEventListener('resize', () => {

    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)

    })

    return renderer
}