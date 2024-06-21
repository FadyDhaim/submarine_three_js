import { BoxGeometry, Mesh, MeshPhongMaterial } from "three"

export class AppCube extends Mesh {
    static boxGeometry = new BoxGeometry(1, 1, 1)
    constructor(color = 0xFFFFFF, emissive) {
        const meshPhongMaterial = new MeshPhongMaterial({ color: color, emissive: emissive})
        super(AppCube.boxGeometry, meshPhongMaterial)
    }
}