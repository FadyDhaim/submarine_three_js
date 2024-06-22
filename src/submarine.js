import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

//⚠️⚠️⚠️⚠️🚧🚧👷 
// هاد الملف تحت الصيانة بشيل طيزك ازا بتقربي عليه
//⚠️⚠️⚠️⚠️🚧🚧👷 

// const directions = Object.freeze(
//     {
//         reverse: Symbol('reverse'),
//         idle: Symbol('idle'),
//         forward: Symbol('forward'),
//     }
// )
const motionState = Object.freeze({
    idle: Symbol('idle'),
    inMotion: Symbol('inMotion')
})
export class Submarine {
    constructor() {
        this.modelPath = '../models/submarine.glb'
        this.velocity = {
            linear: 0.0,
            angular: 0.0
        }
        this.motionState = motionState.idle
        this.maximumForwardSpeed = 10.0
        this.maximumReverseSpeed = -5.0
        this.holdTime = 0 //in frames🖼️
        this.maximumForwardHoldTime = 180  //3 seconds worth of frames @60 FPS
        this.maximumReverseHoldTime = -180
        this.pushHoldTimeAhead = this.pushHoldTimeAhead.bind(this)
        this.pushHoldTimeBackward = this.pushHoldTimeBackward.bind(this)
        this.updateMotionState = this.updateMotionState.bind(this)
    }
    async load() {
        const loader = new GLTFLoader()
        return new Promise((resolve, reject) => {
            loader.load(this.modelPath, (gltf) => {
                const submarineMesh = gltf.scene
                submarineMesh.position.set(0, -2, 0)
                submarineMesh.castShadow = true
                submarineMesh.scale.setScalar(10)
                this.submarineMesh = submarineMesh
                this._setupInteractivity()
                resolve(submarineMesh)
            })
        })
    }

    animate(time) {
        // console.log(this.direction)
        if (this.motionState == motionState.idle && this.holdTime != 0) {
            this.dampenHoldTime()
        }
        const acceleration = this._holdTimeToAcceleration()
        const { velocity } = this
        const { linear: currentLinearVelocity, angular } = velocity
        let newLinearVelocity = currentLinearVelocity + acceleration
        this.submarineMesh.position.z -= newLinearVelocity
    }
    _holdTimeToAcceleration() {
        let acceleration = 0
        const holdTime = this.holdTime
        if (holdTime > 0) {
            acceleration = this._holdTimeToForwardAcceleration()
        } else if (holdTime < 0) {
            acceleration = this._holdTimeToReverseAcceleration()
        }
        return acceleration
    }
    _holdTimeToForwardAcceleration() {  //only called when holdTime is positive, ie, going forward
        const holdTime = this.holdTime
        const maximumSpeed = this.maximumForwardSpeed
        const phase1 = (1 / 3) * this.maximumForwardHoldTime
        const phase2 =(2 / 3) * this.maximumForwardHoldTime
        const phase3 = (3 / 3) * this.maximumForwardHoldTime
        let acceleration
        if (holdTime <= phase1) {
            // return 0.002    //0.002 * 60  = 0.12    == 20% of maxium speed (0.6) in one second
            acceleration = (0.2 * maximumSpeed) / 60
        }
        else if (holdTime <= phase2) {
            // return 0.003    //first-second-speed + second-second-speed = 0.12 + 0.003 * 60 = 0.3  == 50% of maxium speed
            //                                                                                                           20%Max + X * 60 = 50% MAx => X * 60 = 30% Max => X = 30% / 60
            acceleration = (0.3 * maximumSpeed) / 60
        }
        else if (holdTime < phase3){
            // return 0.004    //0.3 + third-second = 0.3 + 0.004 * 60 = 0.54,  (90% of maximum speed in 3 seconds)
            //50%Max + X * 60 = 90% Max => X * 60 = 40% Max   => X = 40% Max / 60
            acceleration = (0.4 * maximumSpeed) / 60
        }
        else if (holdTime == phase3) {
            return acceleration = 0
        }
        return acceleration
    }
    _holdTimeToReverseAcceleration() {  //only called when holdTime is positive, ie, going forward
        const holdTime = this.holdTime
        const maximumSpeed = this.maximumReverseSpeed
        const phase1 = (1 / 3) * this.maximumReverseHoldTime
        const phase2 = (2 / 3) * this.maximumReverseHoldTime
        const phase3 = (3 / 3) * this.maximumReverseHoldTime
        let acceleration
        if (holdTime >= phase1) {
            acceleration = (0.2 * maximumSpeed) / 60
        }
        else if (holdTime >= phase2) {
            acceleration = (0.3 * maximumSpeed) / 60
        }
        else if (holdTime > phase3) {
            acceleration = (0.4 * maximumSpeed) / 60
        }
        else if (holdTime == phase3) {
            acceleration = 0
        }
        return acceleration
    }
    _setupInteractivity() {
        const pushHoldTimeAheadCallback = this.pushHoldTimeAhead
        const pushHoldTimeBackwardCallback = this.pushHoldTimeBackward
        const updateMotionStateCallback = this.updateMotionState
        window.addEventListener('keydown', function (event) {
            const key = event.key
            switch (key) {
                case 'ArrowUp':
                    updateMotionStateCallback(motionState.inMotion)
                    pushHoldTimeAheadCallback()
                    break
                case 'ArrowDown':
                    updateMotionStateCallback(motionState.inMotion)
                    pushHoldTimeBackwardCallback()
                    break
            }
        })
        window.addEventListener('keyup', (event) =>{
            const key = event.key
            switch (key) {
                case 'ArrowUp':
                case 'ArrowDown':
                    this.motionState = motionState.idle
                    break
            }
        })
    }
    pushHoldTimeAhead() {
        if (this.holdTime < this.maximumForwardHoldTime) {
            this.holdTime++
        }
    }
    pushHoldTimeBackward() {
        if (this.holdTime > this.maximumReverseHoldTime) {
            this.holdTime--
        }
    }
    dampenHoldTime() {
        if (this.holdTime > 0) {
            this.holdTime--
        } else if (this.holdTime < 0) {
            this.holdTime++
        }
    }
    updateMotionState(newMotionState) {
        this.motionState = newMotionState
    }
}