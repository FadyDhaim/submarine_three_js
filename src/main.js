import * as THREE from 'three'
import { AppCamera } from './camera'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { AppWater } from './water';
import { AppSky } from './sky';
import { AppSun } from './sun';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

class SubmarineSimulationApp {
    constructor() {
        this.setupRenderer()
        this.setupCameras()
        this.setupLights()
        this.setupScene()
        this.animate = this.animate.bind(this) // مشان نقدر نستخدم ذيس بقلب التابع يلي منستدعيه بكل فريم
    }
    setupRenderer() {
        const canvas = document.querySelector('#c') // جيب القماشة يلي رح نرندر عليها من ملف ال اتش تي م ل
        const renderer = new THREE.WebGLRenderer({ antialias: true, canvas })
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 0.5;
        this.renderer = renderer
    }
    setupCameras() {
        AppCamera.aspectRatio = this.getAspectRatio()
        const mainCamera = new AppCamera()
        mainCamera.position.set(30, 30, 100);
        this.mainCamera = mainCamera
        this.cameras = [
            mainCamera
        ]
    }
    setupLights() {}
    setupScene() {
        const scene = new THREE.Scene()

        // Water
        const fogEnabled = scene.fog !== undefined
        const water = new AppWater(fogEnabled)
        scene.add(water);

        // Skybox
        const sky = new AppSky();
        scene.add(sky);
        
        const sun = new AppSun(scene, this.renderer,sky, water);
        sun.update()

        const controls = new OrbitControls(this.mainCamera, this.renderer.domElement);
        controls.maxPolarAngle = Math.PI * 0.495;
        controls.target.set(0, 10, 0);
        controls.minDistance = 40.0;
        controls.maxDistance = 200.0;
        controls.update();

        // GUI        
        const gui = new GUI()
        water.showGui(gui)
        sun.showGui(gui)

        this.animatableComponents = {
            'water': water,
        }
        this.scene = scene
    }
    
    start() {
        this.renderer.setAnimationLoop(this.animate)
    }
    animate(time) {
        time *= 0.001  // حول الوقت من ميلي ثانية ل ثانية
        this.ensureResponsiveDisplay() //مشان وقت نبعبص بالنافذة... عادي ما تقربي عليه
        this.animatableComponents.water.material.uniforms['time'].value += 1.0 / 60.0;
        this.render()
    }
    render() {
        this.renderer.render(this.scene, this.mainCamera);
    }
    ensureResponsiveDisplay() {
        const resized = this.ensureRenderingAtFullResolution()
        if (resized) {
            this.ensureProperProjection()
        }
    }
    ensureProperProjection() {
        const aspectRatio = this.getAspectRatio()
        this.cameras.forEach(camera => {
            camera.aspect = aspectRatio
            camera.updateProjectionMatrix()
        })
    }
    getAspectRatio() {
        const canvas = this.renderer.domElement
        return canvas.clientWidth / canvas.clientHeight
    }
    ensureRenderingAtFullResolution() {
        const canvas = this.renderer.domElement
        const displayWidth = canvas.clientWidth
        const displayHeight = canvas.clientHeight
        const widthBeingRendered = canvas.width
        const heightBeingRendered = canvas.height
        const needsResize = displayWidth !== widthBeingRendered || displayHeight != heightBeingRendered
        if (needsResize) {
            this.renderer.setSize(displayWidth, displayHeight, false)
        }
        return needsResize
    }
}
function main() {
    const app = new SubmarineSimulationApp()
    app.start()
}
main()