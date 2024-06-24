import { PlaneGeometry, RepeatWrapping, TextureLoader, Vector3 } from "three";
import { Water } from "three/examples/jsm/objects/Water";
export class AppWater extends Water{
    static waterGeometry = new PlaneGeometry(100000, 100000);
    constructor(fogEnabled) {
        super(
            AppWater.waterGeometry,
            {
                textureWidth: 512,
                textureHeight: 512,
                waterNormals: new TextureLoader().load('../textures/waternormals.jpg', function (texture) {
                    texture.wrapS = texture.wrapT = RepeatWrapping;
                }),
                sunDirection: new Vector3(),
                sunColor: 0xFFFFFF,
                waterColor: 0x001E0F,
                distortionScale: 3.7,
                fog: fogEnabled
            }
        );
        this.rotation.x = - Math.PI / 2;
    }
    showGui(gui) {
        const waterUniforms = this.material.uniforms;
        const waterFolder = gui.addFolder('Water');
        waterFolder.add(waterUniforms.distortionScale, 'value', 0, 8, 0.1).name('distortionScale');
        waterFolder.add(waterUniforms.size, 'value', 0.1, 10, 0.1).name('size');
        waterFolder.open();
    }
    animate(time) {
        this.material.uniforms['time'].value += 1.0 / 60.0;
    }
} 