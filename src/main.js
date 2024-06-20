import * as T from 'three'
import { AppLight } from './light'
import { AppCamera } from './camera'
import { AxesGridHelper } from './helpers/axes_grid_helper'
import { AppCube } from './cube'
import { SceneGraph, GraphNode } from './data/scene_graph'
class SubmarineSimulationApp {
    constructor() {
        this.setupRenderer()
        this.setupCamera()
        this.setupLights()
        this.setupScene()
        this.setupSceneGraph()
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
        this.scene = new T.Scene()
    }
    setupSceneGraph() {
        const cubes = new T.Object3D() //مجموعة مربعات
        const cube1 = new AppCube(0x00FF00)
        const cube2 = new AppCube(0x0000FF)
        cube2.position.x = 3
        const sceneGraph = new SceneGraph()
        const rootNode = new GraphNode('scene', this.scene)
        sceneGraph.setRoot(rootNode)
        rootNode.addChildren(
            ['main light', this.lights[0]],
            ['cubes', cubes]
        )[1].addChildren(
            ['cube1', cube1],
            ['cube2', cube2]
        )
        this.sceneGraph = sceneGraph
        sceneGraph.visitNodes(node => {
            let object = node.object
            let childrenObjects = node.children.map(node => node.object)
            childrenObjects.forEach(childObject => object.add(childObject))
            AxesGridHelper.makeAxesGridHelper(object, node.name)
        })
        //الشي يلي رح نحركو بل update
        this.animatableComponents =
        {
            'cubes' :  cubes
        }
    }
    start() {
        this.renderer.setPixelRatio(window.devicePixelRatio)
        requestAnimationFrame(this.update)
    }
    update(time) {
        time *= 0.001  // حول الوقت من ميلي ثانية ل ثانية
        this.ensureResponsiveDisplay() //مشان وقت نبعبص بالنافذة... عادي ما تقربي عليه
        const { cubes } = this.animatableComponents
        cubes.rotation.x = time
        cubes.rotation.y = time
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