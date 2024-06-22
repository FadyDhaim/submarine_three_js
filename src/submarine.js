import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

//⚠️⚠️⚠️⚠️🚧🚧👷 
// هاد الملف تحت الصيانة بشيل طيزك ازا بتقربي عليه
//⚠️⚠️⚠️⚠️🚧🚧👷 

const directions = Object.freeze(
    {
        reverse: Symbol('reverse'),
        idle: Symbol('idle'),
        forward: Symbol('forward'),
    }
)
export class Submarine {
    constructor() {
        this.modelPath = '../models/submarine.glb'
        this.velocity = {
            linear: 0.0,
            angular: 0.0
        }
        this.maximumForwardSpeed = 30.0
        this.direction = directions.idle
        this.holdTimeInFrames = 0
        this.updateHoldTime = this.updateHoldTime.bind(this)
        this.updateDirection = this.updateDirection.bind(this)
    }
    async load() {
        const loader = new GLTFLoader()
        return new Promise((resolve, reject) => {
            loader.load(this.modelPath, (gltf) => {
                const submarineMesh = gltf.scene
                submarineMesh.position.set(0, 10, 0)
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
        const { direction, velocity } = this
        const { linear, angular } = velocity
        const acceleration = this._holdTimeToForwardAcceleration()
        let newLinearVelocity
        switch (direction) {
            case directions.forward:
                console.log('forward')
                newLinearVelocity = linear + acceleration
                break
            case directions.reverse:
                newLinearVelocity = linear - acceleration
        }
        if (newLinearVelocity) {
            this.submarineMesh.position.z -= newLinearVelocity
        }
    }
    _holdTimeToForwardAcceleration() {
        const holdTimeInFrames = this.holdTimeInFrames
        const maximumSpeed = this.maximumForwardSpeed
        let acceleration = 0
        if (holdTimeInFrames > 0) {
            if (holdTimeInFrames <= 60) {
                // return 0.002    //0.002 * 60  = 0.12    == 20% of maxium speed (0.6) in one second
                acceleration = (0.2 * maximumSpeed) / 60
            }
            else if (holdTimeInFrames <= 120) {
                // return 0.003    //first-second-speed + second-second-speed = 0.12 + 0.003 * 60 = 0.3  == 50% of maxium speed
                //                                                                                                           20%Max + X * 60 = 50% MAx => X * 60 = 30% Max => X = 30% / 60
                acceleration = (0.3 * maximumSpeed) / 60
            }
            else {
                // return 0.004    //0.3 + third-second = 0.3 + 0.004 * 60 = 0.54,  (90% of maximum speed in 3 seconds)
                //50%Max + X * 60 = 90% Max => X * 60 = 40% Max   => X = 40% Max / 60
                acceleration = (0.4 * maximumSpeed) / 60
            }
        }
        return acceleration
    }
    _setupInteractivity() {
        const updateHoldTimeCallback = this.updateHoldTime
        const updateDirectionCallback = this.updateDirection
        window.addEventListener('keydown', function (event) {
            const key = event.key
            switch (key) {
                case 'ArrowUp':
                    console.log('arrow up')
                    updateDirectionCallback(directions.forward)
                    break
                case 'ArrowDown':
                    console.log('arrow downn')
                    updateDirectionCallback(directions.reverse)
            }
            updateHoldTimeCallback(1)
        })
        window.addEventListener('keyup', function (event) {
            const key = event.key
            switch (key) {
                case 'ArrowUp':
                case 'ArrowDown':
                    this.direction = directions.idle
                    break
            }
        })
    }
    updateHoldTime(valueOffset) {
        this.holdTimeInFrames += valueOffset
    }
    updateDirection(newDirection) {
        this.direction = newDirection
    }
}