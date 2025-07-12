<template>
  <div class="fixed inset-0 z-50 flex" v-if="isOpen">
    <!-- 遮罩层 -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
      @click="close"
    ></div>

    <!-- 菜单 -->
    <div
      class="fixed top-0 left-0 h-full bg-gray-900 text-white shadow-lg transition-transform"
      :style="{
        width: width,
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
      }"
    >
      <div class="p-0 h-full overflow-y-auto">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineExpose, onMounted } from "vue";

// 菜单是否打开
const isOpen = ref(false);

// 菜单宽度，支持通过 props 传入
defineProps({
  width: {
    type: String,
    default: "300px", // 默认宽度为 300px
  },
});

// 暴露 open 和 close 方法
defineExpose({
  open,
  close,
});

// 打开菜单
function open() {
  isOpen.value = true;
}

// 关闭菜单
function close() {
  isOpen.value = false;
}
</script>

<style scoped>
/* 添加一些过渡效果 */
.transition-transform {
  transition: transform 0.3s ease-in-out;
}

.transition-opacity {
  transition: opacity 0.3s ease-in-out;
}
</style>
