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

    <!-- <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Install
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p> -->
</template>

<style scoped>
.tooltip {
    position: absolute;
    border: 1px solid #ccc;
    padding: 10px;
    height: 60px;
    width: 120px;
    background: #fff;
    overflow: auto;
}

.read-the-docs {
    color: #888;
}
</style>
