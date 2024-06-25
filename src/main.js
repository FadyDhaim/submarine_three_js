
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { Submarine } from './submarine'
import { Particles } from './particles'
import { AppCamera } from './cameras/app_camera'
import { MainCamera } from './cameras/main_camera'
import { SubmarineCamera } from './cameras/submarine_camera'
import { AppSky } from './sky'
import { AppSun } from './sun'
import { AppWater } from './water'
import { AmbientLight, DirectionalLight, Scene, WebGLRenderer } from 'three'


class SubmarineSimulationApp {
    constructor() {
        this.setupRenderer()
        this.setupMainCamera()
        this.setupLights()
        this.setupScene()
        this.animate = this.animate.bind(this) // مشان نقدر نستخدم ذيس بقلب التابع يلي منستدعيه بكل فريم
    }
    setupRenderer() {
        const canvas = document.querySelector('#c') // جيب القماشة يلي رح نرندر عليها من ملف ال اتش تي م ل
        const renderer = new WebGLRenderer({ antialias: true, canvas })
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.toneMapping = ACESFilmicToneMapping
        renderer.toneMappingExposure = 0.5
        this.renderer = renderer
    }
    setupMainCamera() {
        this.cameras = []
        AppCamera.aspectRatio = this.getAspectRatio()
        const mainCamera = new MainCamera()
        mainCamera.position.set(0, 30, 100)
        mainCamera.lookAt(0, 0, 0)
        mainCamera.setupControls(this.renderer)
        this.mainCamera = mainCamera
        this.cameras.push(mainCamera)
    }
    setupLights() {
        const ambientLight = new AmbientLight(0x404040, 0.5); // Soft white light
        const directionalLight = new DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(1, 1, 1).normalize();
        this.lights = [ambientLight, directionalLight]
    }
    setupScene() {
        const scene = new Scene()
        this.scene = scene
        this.lights.forEach(light => scene.add(light))
        let animatableComponents = []
        this.animatableComponents = animatableComponents
        // Water
        const fogEnabled = scene.fog !== undefined
        const water = new AppWater(fogEnabled)
        scene.add(water)
        animatableComponents.push(water)
        const underWater = water.getUnderWaterMesh()
        underWater.position.set(0, -50, 0)
        scene.add(underWater)
        //particles
        const particles = new Particles()
        scene.add(particles)
        animatableComponents.push(particles)

        const underWaterParticles = new Particles(true)
        scene.add(underWaterParticles)
        animatableComponents.push(underWaterParticles)
        // Skybox
        const sky = new AppSky()
        scene.add(sky)

        const sun = new AppSun(scene, this.renderer, sky, water)
        sun.update()
        // Submarine
        let submarine = new Submarine()
        submarine.load().then(submarineMesh => {
            scene.add(submarineMesh)
            animatableComponents.push(submarine)
            const submarineCamera = new SubmarineCamera()
            submarineCamera.setupControls(this.renderer)
            submarineMesh.add(submarineCamera)
            this.cameras.push(submarineCamera)
            this.animatableComponents.push(submarineCamera)
            water.setupCamera(submarineCamera)
        })
        // GUI        
        const gui = new GUI()
        water.showGui(gui)
        sun.showGui(gui)
        
    }

    start() {
        this.renderer.setAnimationLoop(this.animate)
    }
    animate(time) {
        time *= 0.001  // حول الوقت من ميلي ثانية ل ثانية
        this.ensureResponsiveDisplay() //مشان وقت نبعبص بالنافذة... عادي ما تقربي عليه
        // console.log(this.animatableComponents.length)
        for (let animtableComponent of this.animatableComponents) {
            animtableComponent.animate(time)
        }
        this.render()
    }
    render() {
        this.renderer.render(this.scene, this.cameras[1] ? this.cameras[1] : this.mainCamera) //كاميرا الغواصة
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

//under water
// Create the underwater geometry and material
// const underWaterGeometry = new BoxGeometry(AppWater.SPATIAL_SIZE, 100, AppWater.SPATIAL_SIZE);
// const underWaterMaterial = new MeshPhysicalMaterial({
//     color: new Color(0x001E0F),
//     opacity: 0.8,
//     transparent: true,
//     depthWrite: true,

//     side: DoubleSide,
//     roughness: 1,
//     metalness: 0,
//     clearcoat: 1,
//     clearcoatRoughness: 0.1
// });

// const underWaterMesh = new Mesh(underWaterGeometry, underWaterMaterial);
// underWaterMesh.position.y = -1; // Adjust based on how deep you want the underwater effect to be
// scene.add(underWaterMesh);