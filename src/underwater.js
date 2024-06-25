import { BoxGeometry, Mesh, MeshPhysicalMaterial, Color, DoubleSide } from "three";
import { AppWater } from "./water";

export class Underwater extends Mesh {
    constructor() {
        const waterDepth = 1000
        const underwaterGeometry = new BoxGeometry(AppWater.SPATIAL_SIZE, waterDepth, AppWater.SPATIAL_SIZE);
        const underwaterMaterial = new MeshPhysicalMaterial({
            color: new Color(0x40a4b8).convertSRGBToLinear(),
            roughness: 0.5,
            transmission: 1.0, // Higher value for clearer water
            thickness: 100, // Thickness of the medium
            clearcoat: 0.5,
            clearcoatRoughness: 0.1,
            side: DoubleSide, // Render both sides of the geometry
            opacity: 0.7,
            transparent: true,
            depthWrite: false, // Important for rendering transparency correctly
            colorWrite: true,
            blendAlpha: 0.5,
        });
        super(underwaterGeometry, underwaterMaterial);
        this.position.set(0, -500, 0);
    }
}
