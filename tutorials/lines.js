import * as T from 'three'
const renderer = new T.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new T.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 0, 100);
camera.lookAt(0, 0, 0);

const scene = new T.Scene();
const lineMaterial = new T.LineBasicMaterial({ color: 0x0000FF })
const points = [
    new T.Vector3(-10, 0, 0),
    new T.Vector3(0, 10, 0),
    new T.Vector3(10, 0, 0),
]
const geometry = new T.BufferGeometry().setFromPoints(points)
const line = new T.Line(geometry, lineMaterial)
scene.add(line)
function animate() {
    renderer.render(scene, camera)
}
renderer.setAnimationLoop(animate)
