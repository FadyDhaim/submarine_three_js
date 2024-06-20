import { AxesHelper, GridHelper } from "three"
import { GUI } from 'lil-gui'
export class AxesGridHelper {
    constructor(node, units = 10) {
        const grid = new GridHelper(units, units)
        grid.material.depthTest = false
        grid.renderOrder = 1
        node.add(grid)
        const axes = new AxesHelper()
        axes.material.depthTest = false
        axes.renderOrder = 2
        node.add(axes)
        this.grid = grid
        this.axes = axes
        this.visible = false
    }
    get visible() {
        return this._visible
    }
    set visible(value) {
        this._visible = value
        this.grid.visible = value
        this.axes.visible = value
    }
    static gui = new GUI()
    static makeAxesGridHelper(node, label, units) {
        const axesGrid = new AxesGridHelper(node, units)
        this.gui.add(axesGrid, 'visible').name(label)
    }
}