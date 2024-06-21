import { BufferGeometry, Float32BufferAttribute, Points, PointsMaterial } from "three";

export class Particles extends Points{
    constructor(underWaterOnly) {
        const particleCount = 1000;
        const particlesGeometry = new BufferGeometry();
        const particlesPositions = [];

        for (let i = 0; i < particleCount; i++) {
            particlesPositions.push((Math.random() * 2 - 1) * 5000);
            if (underWaterOnly) {
                particlesPositions.push(-Math.random() * 5000);
            } else {
                particlesPositions.push((Math.random() * 2 - 1) * 5000);
            }
            particlesPositions.push((Math.random() * 2 - 1) * 5000);
        }

        particlesGeometry.setAttribute('position', new Float32BufferAttribute(particlesPositions, 3));

        const particleMaterial = new PointsMaterial({ color: 0x888888 });
        super(particlesGeometry, particleMaterial)

    }

    animate(time) {
        this.rotation.y = time * 0.1;
    }
}
