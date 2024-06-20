import {Mesh, MeshPhongMaterial } from "three"

export class AppCube extends Mesh{
    constructor(geometry, color) {
            const material = new MeshPhongMaterial({ color: color })
            super(geometry, material)
    }
}