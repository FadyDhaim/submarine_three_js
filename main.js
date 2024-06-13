import * as T from 'three'
import WebGL from 'three/addons/capabilities/WebGL.js';
const scene = new T.Scene()
const camera = new T.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new T.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
const geometry = new T.BoxGeometry(1, 1, 1)
const material = new T.MeshBasicMaterial({
    color: 0x000000,
    blendAlpha: 20,
    alphaHash: 1,
})
const cube = new T.Mesh(geometry, material)
scene.add(cube)
camera.position.z = 5
function animate() {
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    renderer.render(scene, camera)
}
function init() {
    renderer.setAnimationLoop(animate)
}
if (WebGL.isWebGLAvailable()) {
    init()
} else {
    const warning = WebGL.getWebGLErrorMessage()
    document.getElementById('container').appendChild(warning)
}
