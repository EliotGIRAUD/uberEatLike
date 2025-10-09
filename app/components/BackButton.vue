<template>
  <button
    type="button"
    @click="goBack"
    class="inline-flex items-center gap-2 rounded px-3 py-1.5 text-sm hover:bg-gray-50"
  >
    <span aria-hidden><</span>
  </button>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = defineProps<{ fallbackHref?: string }>()
const router = useRouter()

function goBack() {
  if (window.history.length > 1) {
    router.back()
    return
  }
  if (props.fallbackHref) {
    router.push(props.fallbackHref)
  } else {
    router.push('/')
  }
}
</script>


