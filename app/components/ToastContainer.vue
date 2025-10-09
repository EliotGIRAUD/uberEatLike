<template>
  <div class="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        @click="remove(toast.id)"
        :class="[
          'pointer-events-auto cursor-pointer rounded-xl shadow-2xl p-4 min-w-[320px] max-w-md backdrop-blur-sm transition-all duration-300 hover:scale-105',
          toastClasses[toast.type]
        ]"
      >
        <div class="flex items-start gap-3">
          <span class="text-2xl flex-shrink-0">{{ toastIcons[toast.type] }}</span>
          <div class="flex-1 min-w-0">
            <h4 class="font-bold text-sm mb-0.5">{{ toast.title }}</h4>
            <p class="text-sm opacity-90">{{ toast.message }}</p>
          </div>
          <button @click.stop="remove(toast.id)" class="text-lg opacity-60 hover:opacity-100 flex-shrink-0">×</button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
const { toasts, remove } = useToast()

const toastClasses = {
  success: 'bg-[#3AF24B]/95 text-black border-2 border-[#3AF24B]',
  error: 'bg-red-500/95 text-white border-2 border-[#3AF24B]',
  info: 'bg-[#000000]/95 text-white border-2 border-[#3AF24B]',
  warning: 'bg-[#000000]/95 text-white border-2 border-[#3AF24B]',
}

const toastIcons = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠',
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100px) scale(0.8);
}
</style>

