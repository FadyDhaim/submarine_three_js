import { AnimationMixer, Clock, LoopRepeat } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
export class Ocean {
    constructor() {
        this.oceanPath = '../models/output3.glb'
    }
    async load() {
        const loader = new GLTFLoader()
        return new Promise((resolve, reject) => {
            loader.load(
                this.oceanPath,
                (ocean) => {
                    const oceanObject = ocean.scene
                    console.log(ocean.animations.length);
                    const mixer = new AnimationMixer(oceanObject);
                    oceanObject.position.set(0, -100, 0)
                    oceanObject.scale.setScalar(1000)
                    ocean.animations.forEach((clip) => {
                        const action = mixer.clipAction(clip)
                        action.setLoop(LoopRepeat)
                        action.play()
                    })
                    this.mixer = mixer
                    this.clock = new Clock()
                    resolve(oceanObject)
                }
            )
        })
    }
    animate() {
        this.mixer.update(this.clock.getDelta());
    }
} 