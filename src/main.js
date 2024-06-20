import * as T from 'three'
import { AppLight } from './light'
import { AppCamera } from './camera'
import { AxesGridHelper } from './helpers/axes_grid_helper'
import { AppCube } from './cube'
class SubmarineSimulationApp {
    constructor() {
        this.setupRenderer()
        this.setupCamera()
        this.setupLights()
        this.setupComponents()
        this.setupScene()
        this.update = this.update.bind(this) // مشان نقدر نستخدم ذيس بقلب التابع يلي منستدعيه بكل فريم
    }
    setupRenderer() {
        const canvas = document.querySelector('#c') // جيب القماشة يلي رح نرندر عليها من ملف ال اتش تي م ل
        const renderer = new T.WebGLRenderer({ antialias: true, canvas })
        this.renderer = renderer
    }
    setupCamera() {
        const camera = new AppCamera(this.getAspectRatio())
        camera.position.z = 5
        camera.position.y = 3
        camera.lookAt(0,0,0)
        this.camera = camera
    }
    setupLights() {
        this.lights =  [new AppLight()]
    }
    setupScene() {
        const scene = new T.Scene()
        this.lights.forEach(light => scene.add(light)) //اضافة الاضاءة يلي هيي الشمس بهي الحالة
        this.visitComponents((component) => scene.add(component))// اضافة المكونات
        this.scene = scene
    }
    setupComponents() {
        const boxGeometry = new T.BoxGeometry(1, 1, 1)
        const cube1 = new AppCube(boxGeometry, 0x00FF00)
        const cube2 = new AppCube(boxGeometry, 0x0000FF)
        cube2.position.x = 3
        let components = {
            cubes: [
                cube1,
                cube2,
             ]
        }
    this.components = components
    this.visitComponents((component, counter) => AxesGridHelper.makeAxesGridHelper(component, `cube ${counter + 1}`))
    }
    visitComponents(visitor) {
        let counter = 0
        for (const componentName in this.components) {
            const component = this.components[componentName]
            //ازا مصفوفة مشي فيها مشان نعالج كل مكون فيها لحال مثلا نضيفو للمشهد او نعمل فيو اي شي
            if (Array.isArray(component)) {
                for (const actualComponent of component) {
                    visitor(actualComponent, counter)
                    counter++
                }
            } else {
                visitor(component, counter)
                counter++
            }
        }
    }
    start() {
        this.renderer.setPixelRatio(window.devicePixelRatio)
        requestAnimationFrame(this.update)
    }
    update(time) {
        time *= 0.001  // حول الوقت من ميلي ثانية ل ثانية
        this.ensureResponsiveDisplay() //مشان وقت نبعبص بالنافذة... عادي ما تقربي عليه
        this.components.cubes.forEach(cube => cube.rotation.y = time)
        this.renderer.render(this.scene, this.camera)
        requestAnimationFrame(this.update)
    }
    ensureResponsiveDisplay() {
        const resized = this.ensureRenderingAtFullResolution()
        if (resized) {
            this.ensureProperProjection()
        }
    }
    ensureProperProjection() {
        const aspectRatio = this.getAspectRatio()
        this.camera.aspect = aspectRatio
        this.camera.updateProjectionMatrix()
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