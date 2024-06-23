import { Vector3 } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

// const motionDirections = Object.freeze(
//     {
//         reverse: Symbol('reverse'),
//         forward: Symbol('forward'),
//     }
// )
const accelerationStates = Object.freeze({
    decelerating: Symbol('decelerating'),
    accelerating: Symbol('accelerating'),
})
const motionStates = Object.freeze({
    idle: Symbol('idle'),
    inMotion: Symbol('inMotion')
})
export class Submarine {
    constructor() {
        this.modelPath = '../models/submarine.glb'
        this.submarineMesh = null
        this.velocity = {
            linear: 0.0,
            angular: 0.0
        }
        this.motionState = motionStates.idle
        this.motionDirection = null
        this.accelerationState = null
        this.maximumForwardSpeed = 10.0
        this.maximumReverseSpeed = -5.0
        this.holdTime = 0 //in frames🖼️
        this.maximumForwardHoldTime = 360  //4 seconds worth of frames @60 FPS
        this.maximumReverseHoldTime = -360
    }
    async load() {
        const loader = new GLTFLoader()
        return new Promise((resolve, reject) => {
            loader.load(this.modelPath, (gltf) => {
                const submarineMesh = gltf.scene
                submarineMesh.position.set(0, 0, 0)
                submarineMesh.castShadow = true
                submarineMesh.scale.setScalar(10)
                this.submarineMesh = submarineMesh
                this._setupInteractivity()
                resolve(submarineMesh)
            })
        })
    }
    animate() {
        // console.log(this.accelerationState)
        // console.log(this.motionState)
        if (this.accelerationState == accelerationStates.decelerating && this.holdTime != 0) {
            this.dampenHoldTime()
        }
        const acceleration = this._holdTimeToAcceleration()
        // console.log(acceleration)
        const currentLinearVelocity = this.velocity.linear
        let newLinearVelocity = currentLinearVelocity + acceleration
        if (newLinearVelocity != 0) {
            this.updateMotionState(motionStates.inMotion)
        }
        this.submarineMesh.position.z -= newLinearVelocity
        this.velocity.linear = newLinearVelocity
    }
    _holdTimeToAcceleration() {
        let acceleration = 0
        if (this.holdTime > 0) {
            acceleration = this._holdTimeToForwardPiecewiseAcceleration()
        } else if (this.holdTime < 0) {
            console.log('hello')
            acceleration = this._holdTimeToBackwardPiecewiseAcceleration()
            console.log(acceleration)
        }
        if (this.accelerationState == accelerationStates.decelerating) {
            acceleration = -acceleration
        }
        return acceleration
    }
    _holdTimeToForwardPiecewiseAcceleration() {
        const halfHoldTime = this.maximumForwardHoldTime / 2
        let maxAcceleration = this.maximumForwardSpeed / 120
        const holdTime = this.holdTime
        if (holdTime <= halfHoldTime) {
            return holdTime * (maxAcceleration / halfHoldTime) 
        } else {
            const decelerationTime = holdTime  - halfHoldTime
            return maxAcceleration - (maxAcceleration /halfHoldTime) * decelerationTime
        }
    }
    _holdTimeToBackwardPiecewiseAcceleration() {
        const halfHoldTime = Math.abs(this.maximumReverseHoldTime / 2)
        let maxAcceleration = this.maximumReverseSpeed / 120
        const holdTime = Math.abs(this.holdTime)
        if (holdTime <= halfHoldTime) {
            return (maxAcceleration / halfHoldTime) * holdTime
        } else {
            const decelerationTime = holdTime - halfHoldTime
            return maxAcceleration - (maxAcceleration / halfHoldTime) * decelerationTime
        }
    }
    // _holdTimeToForwardAcceleration() {  //only called when holdTime is positive, ie, going forward
    //     const holdTime = this.holdTime
    //     const maximumSpeed = this.maximumForwardSpeed
    //     const phase1 = (1 / 3) * this.maximumForwardHoldTime
    //     const phase2 =(2 / 3) * this.maximumForwardHoldTime
    //     const phase3 = (3 / 3) * this.maximumForwardHoldTime
        
    //     let acceleration
    //     if (holdTime <= phase1) {
    //         // return 0.002    //0.002 * 60  = 0.12    == 20% of maxium speed (0.6) in one second
    //         acceleration = (0.2 * maximumSpeed) / 60
    //     }
    //     else if (holdTime <= phase2) {
    //         // return 0.003    //first-second-speed + second-second-speed = 0.12 + 0.003 * 60 = 0.3  == 50% of maxium speed
    //         //                                                                                                           20%Max + X * 60 = 50% MAx => X * 60 = 30% Max => X = 30% / 60
    //         acceleration = (0.3 * maximumSpeed) / 60
    //     }
    //     else if (holdTime < phase3){
    //         // return 0.004    //0.3 + third-second = 0.3 + 0.004 * 60 = 0.54,  (90% of maximum speed in 3 seconds)
    //         //50%Max + X * 60 = 90% Max => X * 60 = 40% Max   => X = 40% Max / 60
    //         acceleration = (0.4 * maximumSpeed) / 60
    //     }
    //     else if (holdTime == phase3) {
    //         return acceleration = 0
    //     }
    //     return acceleration
    // }
    // _holdTimeToReverseAcceleration() {  //only called when holdTime is positive, ie, going forward
    //     const holdTime = this.holdTime
    //     const maximumSpeed = this.maximumReverseSpeed
    //     const phase1 = (1 / 3) * this.maximumReverseHoldTime
    //     const phase2 = (2 / 3) * this.maximumReverseHoldTime
    //     const phase3 = (3 / 3) * this.maximumReverseHoldTime
    //     const phase4 = (4/ 4) * this.maximumReverseHoldTime
    //     let acceleration
    //     if (holdTime >= phase1) {
    //         acceleration = (0.2 * maximumSpeed) / 60
    //     }
    //     else if (holdTime >= phase2) {
    //         acceleration = (0.3 * maximumSpeed) / 60
    //     }
    //     else if (holdTime > phase3) {
    //         acceleration = (0.4 * maximumSpeed) / 60
    //     }
    //     else if (holdTime == phase3) {
    //         acceleration = 0
    //     }
    //     return acceleration
    // }
    _setupInteractivity() {
        window.addEventListener('keydown', (event) => {
            const key = event.key
            switch (key) {
                case 'w':
                    this.moveForward()
                    break
                case 's':
                    this.moveBackward()
                    break
            }
        })
        window.addEventListener('keyup', (event) =>{
            const key = event.key
            switch (key) {
                case 'w':
                case 's':
                    this.updateAccelerationState(accelerationStates.decelerating)
                    break
            }
        })
    }
    moveForward() {
        this.updateAccelerationState(accelerationStates.accelerating)
        this.pushHoldTimeAhead()
    }
    moveBackward() {
        this.updateAccelerationState(accelerationStates.accelerating)
        this.pushHoldTimeBackward()
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
        if (this.holdTime == 0) {
            this.updateMotionState(motionStates.idle)
        }
    }
    updateMotionState(value) {
        if (this.motionState != value) {
            this.motionState = value
        }
    }
    updateAccelerationState(value) {
        if (this.accelerationState != value) {
            this.accelerationState = value
        }
    }
}