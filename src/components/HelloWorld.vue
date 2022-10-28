<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{ msg: string, x: number, y: number }>()

const style = computed(() => {
    return {
        top: `${props.y}px`,
        left: `${props.x}px`
    }
})
const count = ref(0)
const clickfn = () => {
    alert('wer')
}
</script>

<template>
    <div :style="style" class="tooltip">
        <h3>{{ msg }}</h3>
        <IxButton mode="primary" @click="clickfn">Primary</IxButton>

    </div>
</template>

<style scoped>
.tooltip {
    position: absolute;
    border: 1px solid #ccc;
    padding: 10px;
    height: 100px;
    width: 120px;
    background: #fff;
    overflow: auto;
}

.read-the-docs {
    color: #888;
}
</style>
