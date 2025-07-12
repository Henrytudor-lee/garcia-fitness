<!-- src/components/SvgIcon.vue -->
<template>
    <svg
      :class="svgClass"
      :width="width"
      :height="height"
      :style="{ fill: color }"
      aria-hidden="true"
      role="img"
      :fill="color"
    >
      <use :href="`#icon-${name}`" />
    </svg>
  </template>
  
  <script setup lang="ts">
  import { computed, defineProps } from 'vue'
  
  const props = defineProps<{
    name: string
    width?: string | number
    height?: string | number
    svgClass?: string
    /** fill 颜色，默认继承 currentColor */
    color?: string
  }>()
  
  const width  = computed(() => props.width  ?? '2em')
  const height = computed(() => props.height ?? '2em')
  const svgClass = computed(() => props.svgClass ?? '')
  // 默认值：不传的话，让它走 CSS 的 currentColor
  const color = computed(() => props.color ?? 'currentColor')
  </script>
  
  <style scoped>
  svg {
    display: inline-block;
    vertical-align: middle;
    /* 默认 fill: currentColor 放在 style 里，prop color 会覆盖 */
  }
  </style>
  