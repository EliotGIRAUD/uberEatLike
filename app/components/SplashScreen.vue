<template>
  <Transition name="fade">
    <div v-if="show" class="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-[#F5E6D3] via-white to-[#F0FFF0]">
      <div class="text-center animate-pulse-slow">
        <h1 class="text-5xl font-black tracking-tight">
          GROS<span class="text-[#3AF24B]">MINO'S</span>
        </h1>
        <p class="mt-4 text-gray-600 text-lg font-medium">
          {{ $t('splash.tagline') }}
        </p>
        <div class="mt-8 flex justify-center">
          <div class="flex gap-2">
            <div class="w-3 h-3 bg-[#3AF24B] rounded-full animate-bounce" style="animation-delay: 0s"></div>
            <div class="w-3 h-3 bg-[#3AF24B] rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            <div class="w-3 h-3 bg-[#3AF24B] rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const show = ref(true)

onMounted(() => {
  setTimeout(() => {
    show.value = false
  }, 2000)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes zoom-in {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-zoom-in {
  animation: zoom-in 0.8s ease-out;
}

.animate-pulse-slow {
  animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.9;
  }
}
</style>

