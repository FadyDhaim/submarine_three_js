import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
export class Submarine {
    constructor() {
        this.modelPath = '../models/fixed_submarine.glb'
    }
    async load() {
        const loader = new GLTFLoader()
        return new Promise((resolve, reject) => {
            loader.load(this.modelPath, function (gltf) {
                const submarineMesh = gltf.scene
                submarineMesh.position.set(0, 10, 0)
                submarineMesh.castShadow = true
                submarineMesh.scale.setScalar(10)
                resolve(submarineMesh)
            })
        })
    }
}