<script setup lang="ts">
import { ref, onMounted } from 'vue'
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import HelloWorld from './components/HelloWorld.vue'
import { ConcentricLayout } from './layout/concentric'
// import data from './data.json'
import G6 from '@antv/g6'
const g6ref = ref()
const initData = {
    // 点集
    nodes: [
        {
            id: 'center', // 节点的唯一标识
            label: '起始点', // 节点文本
            type: 'image'
        },
        {
            "id": "node1",
            "label": "节点1",
            "num": 1
        },
        {
            "id": "node1-1",
            "label": "节点1-1",
            "num": '1-1'
        },
        {
            "id": "node2",
            "label": "节点2",
            "num": 2
        },
        {
            "id": "node3",
            "label": "节点3",
            "num": 3
        },
        {
            "id": "node4",
            "label": "节点4",
            "num": 4
        },
        {
            "id": "node2-1",
            "label": "节点2-1",
            "num": 5
        },
        {
            "id": "node3-1",
            "label": "节点3-1",
            "num": 6
        },
        {
            "id": "node4-1",
            "label": "节点4-1",
            "num": 7
        },
        {
            "id": "node5",
            "label": "node5",
            num: 7
        },
        {
            "id": "node6",
            "label": "node6",
            num: 8
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
                lineDash: [5, 10]
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
            "source": "node3",
            "target": "center",
            "label": "line3"
        },
        {
            "source": "node4",
            "target": "center",
            "label": "line4"
        },
        {
            "source": "node2-1",
            "target": "node2",
            "label": "line5"
        },
        {
            "source": "node3-1",
            "target": "node3",
            "label": "line6"
        },
        {
            "source": "node4-1",
            "target": "node4",
            "label": "line7"
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
            nodeSize: 100,             // 可选
            maxLevelDiff: 1,
            // sweep: 10,                // 可选
            // sortBy: 'degree',         // 可选
        },
        defaultNode: {
            size: 80,
        },
    });
    // graph.data(data)
    graph.data(initData)
    graph.render()

})

</script>

<template>
    <div>
        <div id="mountNode" ref="g6ref"></div>
        <HelloWorld msg="Vite + Vue" />
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
