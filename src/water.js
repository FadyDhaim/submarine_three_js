import { BoxGeometry, Color, DoubleSide, Mesh, PlaneGeometry, RepeatWrapping, ShaderMaterial, TextureLoader, UniformsUtils, Vector2, Vector3 } from "three";
import { Water } from 'three/examples/jsm/objects/Water'
import * as THREE from 'three';

const UnderwaterShader = {
    uniforms: {
        'time': { value: 1.0 },
        'resolution': { value: new THREE.Vector2() },
        'cameraPos': { value: new THREE.Vector3() },
        'sunColor': { value: new THREE.Color(0xffffff) },
        'waterColor': { value: new THREE.Color(0x001E0F) },
        'sunDirection': { value: new THREE.Vector3(0.70707, 0.70707, 0) },
    },
    vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float time;
        uniform vec2 resolution;
        uniform vec3 cameraPos;
        uniform vec3 sunColor;
        uniform vec3 waterColor;
        uniform vec3 sunDirection;
        varying vec3 vWorldPosition;

        void main() {
            float distance = length(vWorldPosition - cameraPos);
            float attenuation = exp(-distance * 0.02);
            vec3 color = mix(waterColor, sunColor, dot(normalize(vWorldPosition - cameraPos), sunDirection));
            color *= attenuation;
            gl_FragColor = vec4(color, 1.0);
        }
    `,
};
export class AppWater extends Water {
    static SPATIAL_SIZE = 100000;
    static waterGeometry = new PlaneGeometry(AppWater.SPATIAL_SIZE, AppWater.SPATIAL_SIZE);

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
                side: DoubleSide,
                fog: fogEnabled
            }
        );
        this.rotation.x = -Math.PI / 2;
        // Custom underwater shader
        const underwaterMaterial = new ShaderMaterial({
            uniforms: UniformsUtils.clone(UnderwaterShader.uniforms),
            vertexShader: UnderwaterShader.vertexShader,
            fragmentShader: UnderwaterShader.fragmentShader,
            transparent: true,
            side: DoubleSide
        });
        const underWaterGeometry = new BoxGeometry(AppWater.SPATIAL_SIZE, 100, AppWater.SPATIAL_SIZE)
        const underwaterMesh = new Mesh(underWaterGeometry, underwaterMaterial);
        this.underwaterMaterial = underwaterMaterial
        this.add(underwaterMesh);
    }

    showGui(gui) {
        const waterUniforms = this.material.uniforms;
        const waterFolder = gui.addFolder('Water');
        waterFolder.add(waterUniforms.distortionScale, 'value', 0, 8, 0.1).name('distortionScale');
        waterFolder.add(waterUniforms.size, 'value', 0.1, 10, 0.1).name('size');
        waterFolder.open();

        // const underWaterFolder = gui.addFolder('Underwater');
        // const underWaterMaterial = this.children[0].material;
        // underWaterFolder.addColor(underWaterMaterial.uniforms.waterColor.value, 'value').name('Color');
        // // underWaterFolder.add(underWaterMaterial.uniforms.sunColor.value, 'value').name('Sun Color');
        // underWaterFolder.open();
    }
    setupCamera(camera) {
        this.camera = camera
    }
    animate(time) {
        this.material.uniforms.time.value = time;
        if (this.camera) {
            this.underwaterMaterial.uniforms.cameraPos.value.copy(this.camera.position);
        }
        this.underwaterMaterial.uniforms.time.value = time

    }
}

