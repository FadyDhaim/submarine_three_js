import {BoxGeometry, Mesh, MeshPhongMaterial } from "three"

export class AppCube extends Mesh{
    static geometry = new BoxGeometry(1, 1, 1)
    constructor(color) {
            const material = new MeshPhongMaterial({ color: color })
            super(geometry, material)
    }
}