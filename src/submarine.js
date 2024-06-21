import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
export class Submarine {
    constructor(scene) {
        const loader = new GLTFLoader()
        loader.load('../models/submarine.glb', function (gltf) {
            const submarineObject = gltf.scene
            scene.add(submarineObject)
            submarineObject.position.set(0, 10, 0)
            submarineObject.castShadow = true
            submarineObject.scale.setScalar(35)
        })
    }
}