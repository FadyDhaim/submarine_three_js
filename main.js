import * as T from 'three'; // Added semicolon for consistency
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'; // Added semicolon for consistency
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'; // Added semicolon for consistency
import { color } from 'three/examples/jsm/nodes/Nodes';

const scene = new T.Scene();
const camera = new T.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new T.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 30;

const controls = new OrbitControls(camera, renderer.domElement);
const loader = new GLTFLoader();
const geometry = new T.BoxGeometry(1, 1, 1)
const material =new  T.MeshBasicMaterial({ color: 0xFF00FF })
const cube = T.Mesh(geometry, material)
scene.add(cube)
loader.load('public/models/submarine.glb', function (gltf) {
    gltf.scene.scale.set(1000, 1000, 1000); // Scales the model to 1000 times its original size
    scene.add(gltf.scene);
}, undefined, function (error) {
    console.error(error);
});

function animate() {
    requestAnimationFrame(animate); // Added requestAnimationFrame to enable continuous animation
    controls.update(); // Added controls.update() for better orbit controls
    renderer.render(scene, camera);
}

function init() {
    animate(); // Changed renderer.setAnimationLoop to animate for compatibility
}

if (WebGL.isWebGLAvailable()) { // Changed WebGL to WEBGL to match import
    init();
} else {
    const warning = WebGL.getWebGLErrorMessage(); // Changed WebGL to WEBGL to match import
    document.getElementById('container').appendChild(warning);
}
