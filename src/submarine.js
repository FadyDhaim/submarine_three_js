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
        // this.velocity = {
        //     linear: 0.0,
        //     angular: 0.0
        // }
        this.motionState = motionStates.idle
        this.accelerationState = null
        this.maximumForwardSpeed = 6.0
        this.maximumReverseSpeed = -4.0
        this.holdTime = 0 //in frames
        this.maximumForwardHoldTime = 360  //4 seconds worth of frames @60 FPS
        this.maximumReverseHoldTime = -360
        this.didDampenLastFrame = false
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
        if (this.accelerationState == accelerationStates.decelerating && this.holdTime != 0) {
            if (!this.didDampenLastFrame) {
                this.dampenHoldTime()
            } else {
                this.didDampenLastFrame = false
            }
        }
        const velocity = this._holdTimeToLinearVelocity()
        this.submarineMesh.position.z -= velocity
        // console.log(velocity)
    }
    _holdTimeToLinearVelocity() {
        let velocity
        const holdTime = this.holdTime
        const idleOrNeutral = holdTime == 0
        if (idleOrNeutral) {
            velocity = 0
        }
        else {
            const _forwardVelocity = () => {
                return holdTime * (this.maximumForwardSpeed / this.maximumForwardHoldTime)
            }
            const _reverseVelocity = () => {
                return holdTime * (this.maximumReverseSpeed / this.maximumReverseHoldTime)
            }
            const goingForward = holdTime > 0
            const goingBackward = holdTime < 0
            if (goingForward) {
                velocity =_forwardVelocity()
            }
            else if (goingBackward) {
                velocity = _reverseVelocity()
            }
        }
        return velocity
    }
    _setupInteractivity() {
        window.addEventListener('keydown', (event) => {
            const key = event.key
            switch (key) {
                case 'w':
                    this.accelerateForward()
                    console.log('W')
                    break
                case 's':
                    this.accelerateBackward()
                    console.log('S')
                    break
            }
        })
        window.addEventListener('keyup', (event) =>{
            const key = event.key
            switch (key) {
                case 'w':
                case 's':
                    this.updateAccelerationState(accelerationStates.decelerating)
                    console.log('No Key Pressed')
                    break
            }
        })
    }
    accelerateForward() {
        this.updateAccelerationState(accelerationStates.accelerating)
        this.pushHoldTimeAhead()
    }
    accelerateBackward() {
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
            this.markAsMotionless()
        }
        this.didDampenLastFrame = true
    }
    markAsMotionless() {
        this.updateMotionState(motionStates.idle)
        this.updateAccelerationState(null)
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