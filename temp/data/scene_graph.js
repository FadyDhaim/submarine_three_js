export class GraphNode {
    constructor(name, object) {
        this.name = name
        this.object = object
        this.children = []
    }

    addChild(name, object) {
        const child = new GraphNode(name, object)
        this.children.push(child)
        return child
    }
    addChildren(...nameObjectPairs) {
        let childrenAdded = []
        for (let nameObjectPair of nameObjectPairs) {
            const name = nameObjectPair[0]
            const object = nameObjectPair[1]
            let childAdded = this.addChild(name, object)
            childrenAdded.push(childAdded)
        }
        return childrenAdded
    }
}

export class SceneGraph {
    constructor() {
        this.root = null
    }

    setRoot(name, object) {
        const root = new GraphNode(name, object)
        this.setRoot(root)
    }
    setRoot(node) {
        this.root = node
    }

    visitNodes(visitor, visitRoot = true) {
        const _visitNodes = (node, depth, order) => {
            if (node) {
                visitor(node, depth, order)
                node.children.forEach((child, index) => _visitNodes(child, depth + 1, index))
            }
        }
        if (visitRoot) {
            _visitNodes(this.root, 0, 0)
        } else {
            this.root.children.forEach((child, index) => _visitNodes(child, 1, index))
        }
    }

    findNode(name) {
        if (!this.root) {
            return null
        }
        const _findNode = (node, name) => {
            if (node.name === name) return node
            for (let child of node.children) {
                const result = _findNode(child, name)
                if (result) return result
            }
            return null
        }
        return _findNode(this.root, name)
    }

    addNodeByParentName(parentName, name, object) {
        const parentNode = this.findNode(parentName)
        //الأب  موجود
        if (parentNode) {
            parentNode.addChild(name, object)
        }
    }
    addNodesByParentName(parentName, ...nameObjectPairs) {
        const parentNode = this.findNode(parentName)
        if (parentNode) {
            parentNode.addChildren(...nameObjectPairs)
        }
    }
}