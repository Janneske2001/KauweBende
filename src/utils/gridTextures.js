import * as THREE from 'three'

// Dynamic Grid Texture Making
export function createGridTexture() {

    const size = 512
    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size

    const ctx = canvas.getContext("2d")

    ctx.fillStyle = "#000002"
    ctx.fillRect(0, 0, size, size)

    ctx.strokeStyle = "#C056ED"
    ctx.lineWidth = 3

    const divisions = 3
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