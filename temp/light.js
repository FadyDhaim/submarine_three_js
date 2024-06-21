import { DirectionalLight, Vector3 } from "three"

export class AppLight extends DirectionalLight {
    constructor(position = new Vector3(-1, 2, 4)) {
        const lightColor = 0xFFFFFF
        const lightIntensity = 3
        super(lightColor, lightIntensity)
        const {x, y, z} = position
        this.position.set(x, y, z)
    }
}