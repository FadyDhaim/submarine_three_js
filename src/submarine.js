import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export class Submarine {
    constructor() {
        this.modelPath = '../models/submarine.glb'
    }
    async load() {
        const loader = new GLTFLoader()
        return new Promise((resolve, reject) => {
            loader.load(this.modelPath, (gltf)  => {
                const submarineMesh = gltf.scene
                submarineMesh.position.set(0, 10, 0)
                submarineMesh.castShadow = true
                submarineMesh.scale.setScalar(10)
                this.submarineMesh = submarineMesh
                resolve(submarineMesh)
            })
        })
    }
    animate(time) {
        this.submarineMesh.rotation.y = time * 0.5
    }
}