import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { AppCamera } from "./app_camera"

export class SubmarineCamera extends AppCamera {
    setupControls(renderer) {
        const controls = new OrbitControls(this, renderer.domElement)
        controls.maxPolarAngle = Math.PI * 0.495
        controls.target.set(0, 4, -4)
        controls.minDistance = 15.0
        controls.maxDistance = 40.0
        controls.update()
    }
}