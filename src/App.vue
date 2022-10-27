<script setup lang="ts">
import { ref, onMounted } from 'vue'
// This starter template is using Vue 3 <script setup> SFCs
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
    type: 'image'
}]
const edgeArr = []
for (let i = 1; i < 8; i++) {
    const curNode = {
        id: `node${i}`,
        label: `powershell${i}`,
        dddddd: 'test',
        type: 'custom-node',
        degree: 10
    }
    const edge = {
        source: `node${i}`,
        target: 'center',
        // label: `label${i}--center`,
        style: {
            lineDash: [5, 10],
            endArrow: {
                path: G6.Arrow.triangle(10, 10),
                d: 100,
            },
        }
    }
    edgeArr.push(edge)
    const edge1 = {
        target: `node${i}`,
        source: `node${i}-${i}`,
        // label: `label${i}--node${i}-${i}`
    }
    edgeArr.push(edge1)
    const curNode1 = {
        id: `node${i}-${i}`,
        // label: `powershell${i}-${i}`,
        degree: 4,
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
        label: `special--center`
    })
    edgeArr.push({
        source: `special1`,
        target: 'center',
        label: `special--center`
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
        }
        let edge1 = {
            source: curNode.id,
            target: `empty${curNode.id}`,
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
                    width: width,
                    height: height,
                    img: 'https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*aHqIQIXL0RMAAAAAAAAAAABkARQnAQ'
                }
            });
            const textShape = group?.addShape('text', {
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
            // const dom = group.addShape('dom', {
            //     attrs: {
            //         // x: -35,
            //         width: 80,
            //         height: 30,
            //         html: `<div style="position: relative;height: 40px;width: 80px;">
            //             <div>${cfg.label}</div>
            //             </div>`,
            //     },
            //     // must be assigned in G6 3.3 and later versions. it can be any value you want
            //     name: 'dom-shape',
            // });
            // return dom;
        }
    }, 'circle')

// 配置 tooltip
const tooltip = new G6.Tooltip({
    offsetX: 10,
    offsetY: 20,
    getContent(e) {
        if (e.item?.getModel().label) {
            const outDiv = document.createElement('div');
            outDiv.style.width = '180px';
            outDiv.innerHTML = `<span>${e.item.getModel().label}</span>`
            return outDiv
        }
        return 'test-node'
    },
    itemTypes: ['node']
});

onMounted(() => {
    const width = g6ref.value.scrollWidth;
    const height = g6ref.value.scrollHeight || 500;
    const graph = new G6.Graph({
        renderer: 'svg',
        container: 'mountNode', // 指定挂载容器
        width: 1000, // 图的宽度
        height: 1000, // 图的高度
        layout: {
            type: 'test-layout',
            center: [500, 500],     // 可选，
            linkDistance: 110,         // 可选，边长
            preventOverlap: true,     // 可选，必须配合 nodeSize
            nodeSize: 190,             // 可选
            maxLevelDiff: 2,
            sortBy: 'degree',         // 可选
        },
        defaultNode: {
            size: 40,
        },
        nodeStateStyles: {
            hover: {
                cursor: 'pointer',
            },
            running: {
                fill: '#0e79ec',
            }
        },
        edgeStateStyles: {
            hover: {
                stroke: '#d3adf7',
                cursor: 'pointer'
            },
        },
        plugins: [tooltip]
    });
    graph.data(initData)
    graph.render()
    graph.on('node:mouseenter', (e) => {
        const { item } = e;
        graph.setItemState(item, 'hover', true)
        const nodes = graph.getNodes()
        nodes.forEach(node => {
            if (node !== item) {
                graph.setItemState(node, 'running', true)
            }
        })

    })
    graph.on('node:mouseleave', (evt) => {
        const { item } = evt;
        graph.setItemState(item, 'hover', false);
        graph.clearItemStates(item, 'selected')
        const nodes = graph.getNodes()
        nodes.forEach(node => {
            if (node !== item) {
                graph.clearItemStates(node, 'running')
            }
        })
    })
    graph.on('node:click', (e) => {
        const { item } = e
        graph.setItemState(item, 'selected', true)
        const model = item?.getModel()
        const { x: xVal, y: yVal } = model
        const point = graph.getCanvasByPoint(xVal, yVal)
        x.value = point.x
        y.value = point.y
        showToolTip.value = true
        console.log('click node', e)
    })
    graph.on('edge:mouseenter', (e) => {
        const { item } = e;
        graph.setItemState(item, 'hover', true)
        console.log('mouse enter', e)
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
