<script setup lang="ts">
import { ref, onMounted } from 'vue'
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import HelloWorld from './components/HelloWorld.vue'
import { ConcentricLayout } from './layout/concentric'
// import data from './data.json'
import G6, { ModelConfig } from '@antv/g6'
const g6ref = ref()

// tooltip 相关配置
const showToolTip = ref(false)
const x = ref(0)
const y = ref(0)

// mock生成节点、边 测试用
const nodeArr: any[] = [{
    id: 'center', // 节点的唯一标识
    label: '起始点', // 节点文本
    degree: 100,
    size: 100,
    type: 'image',
}]
const edgeArr = []
for (let i = 1; i < 18; i++) {
    const curNode = {
        id: `node${i}`,
        label: `powershell${i}`,
        dddddd: 'test',
        type: 'custom-node',
        degree: 10,
        anchorPoints: [
            [0.5, 0.5],
            [0.5, 0.5],
        ],
    }
    const edge = {
        // source: `node${i}`,
        source: `node${i}`,
        target: 'center',
        // label: `label${i}--center`,
        style: {
            lineDash: [10, 2],
            endArrow: {
                path: G6.Arrow.triangle(8, 10, 40),
                d: -45,
                fill: '#ccc',
            }
        }
    }
    edgeArr.push(edge)
    const edge1 = {
        source: `node${i}-${i}`,
        target: `node${i}`,
        style: {
            lineDash: [10, 2],
            endArrow: {
                path: G6.Arrow.circle(5, 10),
                d: 10
            }
        },
        targetAnchor: 12
    }
    edgeArr.push(edge1)
    const curNode1 = {
        id: `node${i}-${i}`,
        degree: 4,
        type: 'outer-node',
    }
    nodeArr.push(curNode1)
    nodeArr.push(curNode)
}

// 构造只有外层 or 只有里层节点
function unshiftSpecialNode() {
    nodeArr.unshift({
        id: `special`,
        label: `special`,
        degree: 4
    })
    nodeArr.push({
        id: `special1`,
        label: `special`,
        degree: 10
    })
    edgeArr.unshift({
        source: `special`,
        target: 'center',
    })
    edgeArr.push({
        source: `special1`,
        target: 'center',
        style: {
            lineDash: [10, 2],
            endArrow: {
                path: G6.Arrow.triangle(8, 10, 40),
                d: -45,
                fill: '#ccc',
            }
        },
    })
}
unshiftSpecialNode()

// 节点&边 数据
const initData = {
    nodes: nodeArr,
    edges: edgeArr
};

// 构造空节点
const nodes = initData.nodes
const edges = initData.edges
const centerEdges = edges.filter(i => i.target === 'center')
centerEdges.forEach(item => {
    let curNode = nodes.find(i => i.id === item.source)
    if (curNode?.degree === 4) {
        // 构建新节点
        let no = {
            "id": "empty" + curNode.id,
            degree: 10,
            size: 1,
            style: {
                fill: '#ccc',
                stroke: '#ccc',
            }
        }
        let centerEdge = {
            source: `empty${curNode.id}`,
            target: "center",
            style: {
                lineDash: [10, 2],
            },
        }
        let edge1 = {
            source: curNode.id,
            target: `empty${curNode.id}`,
            style: {
                lineDash: [10, 2],
            },
        }
        const idx = edges.findIndex(i => i.source === curNode.id)
        edges.splice(idx, 1)
        edges.unshift(centerEdge)
        edges.unshift(edge1)
        nodes.unshift(no)
    }
})

// 自定义布局
G6.registerLayout('test-layout', ConcentricLayout)

G6.registerNode(
    'outer-node',
    {
        draw(cfg, group) {
            const size = cfg.size
            const width = size - 14;
            const height = size - 14;
            const circleShape = group?.addShape('circle', {
                name: 'circle-shape',
                attrs: {
                    x: 0,
                    y: 0,
                    r: 21,
                    fill: '#E1E5EB'
                }
            })
            group.addShape('image', {
                name: 'image-shape',
                attrs: {
                    x: - width / 2,
                    y: - height / 2,
                    width: width,
                    height: height,
                    img: 'https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*aHqIQIXL0RMAAAAAAAAAAABkARQnAQ'
                }
            });
            group?.addShape('text', {
                name: 'num-shape',
                attrs: {
                    x: 20,
                    y: -10,
                    textAlign: 'center',
                    textBaseline: 'middle',
                    text: '100',
                    fill: '#ccc',
                    background: {
                        fill: '#ffffff',
                        stroke: 'green',
                        padding: [3, 2, 3, 2],
                        radius: 2,
                        lineWidth: 3,
                    },
                },
            })
            return circleShape
        },
        setState(name, value, item) {
            const shape = item.get('keyShape');
            if (name === 'running') {
                shape.animate(
                    () => {
                        return {
                            opacity: value ? 0.3 : 1,
                        }
                    },
                    {
                        repeat: false,
                        duration: 200
                    }
                )
            }
            if ((name === 'hover') && value) {
                shape.animate(
                    () => {
                        // 返回需要修改的参数集，这里修改了 lineDash,lineDashOffset
                        return {
                            r: 30,
                            fill: '#1C6EFF'
                        };
                    },
                    {
                        repeat: false, // 动画重复
                        duration: 200, // 一次动画的时长为 3000
                    },
                )
            }
            if (name === 'hover' && !value) {
                shape.stopAnimate();
                shape.animate(
                    () => {
                        return {
                            r: 21,
                            fill: '#E1E5EB'
                        }
                    }, {
                    repeat: false,
                    duration: 200
                }
                )
            }
        }
    },
)

// 自定义节点
G6.registerNode('custom-node',
    {
        draw(cfg, group) {
            const size = cfg.size
            const width = size - 14;
            const height = size - 14;
            const keyShape = group.addShape('image', {
                name: 'image-shape',
                attrs: {
                    x: - width / 2,
                    y: - height / 2,
                    width: 28,
                    height: 28,
                    img: 'https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*aHqIQIXL0RMAAAAAAAAAAABkARQnAQ',
                    clipCfg: {
                        show: false,
                        type: 'circle',
                        r: 15
                    }
                }
            });
            group?.addShape('text', {
                name: 'text-shape',
                attrs: {
                    x: 0, // 居中
                    y: 20,
                    textAlign: 'center',
                    textBaseline: 'middle',
                    text: cfg.label,
                    fill: '#666',
                },
            })
            return keyShape
        },
        setState(name, value, item) {
            const shape = item.get('keyShape');
            // 监听 running 状态
            if ((name === 'running') && value) {
                shape.animate(
                    () => {
                        // 返回需要修改的参数集，这里修改了 lineDash,lineDashOffset
                        return {
                            opacity: 0.3
                        };
                    },
                    {
                        repeat: false, // 动画重复
                        duration: 200, // 一次动画的时长为 3000
                    },
                )
            }
            if (name === 'running' && !value) {
                shape.stopAnimate();
                shape.animate(
                    () => {
                        return {
                            opacity: 1
                        }
                    }, {
                    repeat: false,
                    duration: 200
                }
                )
            }
        }
    })

// 配置 tooltip
const tooltip = new G6.Tooltip({
    offsetX: 10,
    offsetY: 20,
    getContent(e) {
        const outDiv = document.createElement('div');
        if (e.item?.getModel().label) {
            outDiv.style.width = '180px';
            outDiv.innerHTML = `<span>${e.item.getModel().label}</span>`
            return outDiv
        }
        return 'test-node'
    },
    itemTypes: ['node']
});

// 配置 toolbar
const toolbar = new G6.ToolBar();
onMounted(() => {
    const graph = new G6.Graph({
        // renderer: 'svg',
        container: 'mountNode', // 指定挂载容器
        width: 1280, // 图的宽度
        height: 600, // 图的高度
        modes: {
            default: ['zoom-canvas', 'drag-canvas'],
        },
        layout: {
            type: 'test-layout',
            center: [300, 300],     // 可选，
            linkDistance: 10,         // 可选，边长
            preventOverlap: true,     // 可选，必须配合 nodeSize
            nodeSize: 10,             // 可选
            maxLevelDiff: 2,
            sortBy: 'degree',         // 可选
        },
        defaultNode: {
            size: 42,
        },
        nodeStateStyles: {
            hover: {
                cursor: 'pointer',
                stroke: 'blue',
            },
            running: {
                // opacity: 0.3
            }
        },
        edgeStateStyles: {
            hover: {
                stroke: '#1C6EFF',
                cursor: 'pointer',
                lineWidth: 3,
            },
        },
        plugins: [tooltip, toolbar]
    });
    graph.data(initData)
    graph.render()
    graph.on('node:mouseenter', (e) => {
        const { item } = e;
        const edgeArr = [];
        const model = item?.getModel()
        if (model.id === 'center') return
        const edges = item.getEdges();
        if (edges.length === 1) {
            edgeArr.push(...edges)
            let nodes = item.getNeighbors('target')
            if (nodes.length) {
                // const curModel = nodes[0].getModel()
                const curEdges = nodes[0]?.getOutEdges()
                edgeArr.push(...curEdges)
            }
        } else {
            edgeArr.push(...edges)
        }
        graph.setItemState(item, 'hover', true);
        edgeArr.forEach(edge => graph.setItemState(edge, 'hover', true))
    })
    graph.on('node:mouseleave', (evt) => {
        const { item } = evt;
        const edgeArr = [];
        const model = item?.getModel()
        if (model.id === 'center') return
        const edges = item.getEdges();
        if (edges.length === 1) {
            edgeArr.push(...edges)
            let nodes = item.getNeighbors('target')
            if (nodes.length) {
                const curEdges = nodes[0]?.getOutEdges()
                edgeArr.push(...curEdges)
            }
        } else {
            edgeArr.push(...edges)
        }
        edgeArr.push(...item.getOutEdges())
        edgeArr.forEach(edge => graph.clearItemStates(edge, 'hover'))

        graph.clearItemStates(item, 'hover');
    })
    graph.on('node:click', (e) => {
        const { item } = e
        if (item?._cfg?.id?.indexOf('-') !== -1) {
            graph.setItemState(item, 'selected', true)
            const model = item?.getModel()
            const { x: xVal, y: yVal } = model
            const point = graph.getCanvasByPoint(xVal, yVal)
            x.value = point.x
            y.value = point.y + 20
            showToolTip.value = true
            const nodes = graph.getNodes()
            const nei = item.getNeighbors('target')[0];
            const neiModel = nei.getModel()
            nodes.forEach(node => {
                const curModel = node.getModel()
                if (node !== item && curModel.id !== 'center' && curModel.id !== neiModel.id) {
                    graph.setItemState(node, 'running', true)
                }
            })
        }
    })
    graph.on('click', (e) => {
        const { item } = e;
        if (!item) {
            showToolTip.value = false
            const nodes = graph.getNodes()
            nodes.forEach(node => {
                graph.clearItemStates(node, 'running')
            })
        }
    });
    graph.on('edge:mouseenter', (e) => {
        const { item } = e;
        graph.setItemState(item, 'hover', true)
    })
    graph.on('edge:mouseleave', (evt) => {
        const { item } = evt

        graph.clearItemStates(item, 'hover')
    })
})

</script>

<template>
    <div>
        <div id="mountNode" ref="g6ref"></div>
        <HelloWorld :x="x" :y="y" v-if="showToolTip" msg="Vite + Vue" />
        <IxSelect v-model:value="value" :dataSource="dataSource"></IxSelect>
    </div>
</template>

<style scoped>
.logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
}

.logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
}

#mountNode {
    width: 1000px;
    height: 1000px;
}
</style>
