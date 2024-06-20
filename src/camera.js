import { PerspectiveCamera } from "three"


export class AppCamera extends PerspectiveCamera{
    constructor(aspect, fovy = 75, near = 0.1, far = 500) {
        super(fovy, aspect, near, far)
    }
}