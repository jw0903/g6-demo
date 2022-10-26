<script setup lang="ts">
import { ref, onMounted } from 'vue'
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import HelloWorld from './components/HelloWorld.vue'
import { ConcentricLayout } from './layout/concentric'
// import data from './data.json'
import G6 from '@antv/g6'
const g6ref = ref()
const showToolTip = ref(false)
const x = ref(0)
const y = ref(0)
const initData = {
    // 点集
    nodes: [
        {
            id: 'center', // 节点的唯一标识
            label: '起始点', // 节点文本
            degree: 100,
            type: 'image'
        },
        {
            "id": "node1",
            "label": "节点1",
            "num": 1,
            degree: 10,
            stateStyles: {
                hover: {
                    fill: '#d3adf7',
                }
            }
        },
        {
            "id": "node1-1",
            "label": "节点1-1",
            "num": '1-1',
            degree: 4
        },
        {
            "id": "node2",
            "label": "节点2",
            "num": 2,
            degree: 10
        },
        {
            "id": "node2-1",
            "label": "节点2-1",
            "num": 5,
            degree: 4
        },
        {
            "id": "node3",
            "label": "节点3",
            "num": 3,
            degree: 10
        },
        {
            "id": "node3-1",
            "label": "节点3-1",
            "num": 6,
            degree: 4
        },
        {
            "id": "node5",
            "label": "node5",
            num: 7,
            degree: 10,
        },
        {
            "id": "node6",
            "label": "node6",
            type: 'node-name',
            num: 8,
            degree: 4
        }
    ],
    // 边集
    edges: [
        {
            "source": "node1",
            "target": "center",
            "label": "line1",
            style: {
                endArrow: true,
                lineDash: [10, 2]
            }
        },
        {
            source: 'node1-1',
            target: 'node1',
            style: {
                endArrow: true,
            }
        },
        {
            "source": "node2",
            "target": "center",
            "label": "line2",
            style: {
                endArrow: {
                    path: G6.Arrow.circle(5, 0),
                    d: 0
                }
            }
        },
        {
            "source": "node2-1",
            "target": "node2",
            "label": "line5"
        },
        {
            "source": "node3",
            "target": "center",
            "label": "line3"
        },
        {
            "source": "node3-1",
            "target": "node3",
            "label": "line6"
        },
        {
            "source": "node5",
            "target": "center",
            "label": "line7"
        },
        {
            "source": "node6",
            "target": "center",
            "label": "line8"
        },
    ],
};


// 构造空节点
const nodes = initData.nodes
const edges = initData.edges
const centerEdges = edges.filter(i => i.target === 'center')
centerEdges.forEach(item => {
    let curNode = nodes.find(i => i.id === item.source)
    if (curNode?.degree === 4) {
        console.log(curNode)
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
            "source": "empty" + curNode.id,
            "target": "center",
        }
        let edge1 = {
            "source": curNode.id,
            "target": "empty" + curNode.id,
        }
        const idx = edges.findIndex(i => i.source === curNode.id)
        edges.splice(idx, 1)
        edges.push(centerEdge)
        edges.push(edge1)
        nodes.push(no)
    }
})


// 自定义布局
G6.registerLayout('test-layout', ConcentricLayout)

onMounted(() => {
    const width = g6ref.value.scrollWidth;
    const height = g6ref.value.scrollHeight || 500;
    const graph = new G6.Graph({
        container: 'mountNode', // 指定挂载容器
        width, // 图的宽度
        height, // 图的高度
        layout: {
            type: 'test-layout',
            center: [400, 400],     // 可选，
            linkDistance: 150,         // 可选，边长
            preventOverlap: true,     // 可选，必须配合 nodeSize
            nodeSize: 150,             // 可选
            maxLevelDiff: 1,
            sortBy: 'degree',         // 可选
        },
        defaultNode: {
            size: 40,
        },
        nodeStateStyles: {
            hover: {
                cursor: 'pointer'
            }
        },
        edgeStateStyles: {
            hover: {
                stroke: '#d3adf7',
                cursor: 'pointer'
            },
        }
        // defaultEdge: {
        //     stateStyles: {
        //         hover: {
        //             fill: '#d3adf7',
        //         }
        //     }
        // }
    });
    // graph.data(data)
    graph.data(initData)
    graph.render()
    graph.on('node:mouseenter', (e) => {
        const { item } = e;
        graph.setItemState(item, 'hover', true)
    })
    graph.on('node:mouseleave', (evt) => {
        const { item } = evt;
        showToolTip.value = true
        graph.setItemState(item, 'hover', false);
        graph.clearItemStates(item, 'selected')
    })
    graph.on('node:click', (e) => {
        const { item } = e
        graph.setItemState(item, 'selected', true)
        const model = item?.getModel()
        const { x: xVal, y: yVal } = model
        const point = graph.getCanvasByPoint(xVal, yVal)
        x.value = point.x - 30
        y.value = point.y - 60
        showToolTip.value = true
        // const 
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
    width: 800px;
    height: 800px;
}
</style>
