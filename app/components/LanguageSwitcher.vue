<template>
  <div class="relative">
    <button 
      @click="toggleDropdown"
      class="rounded border-2 border-black px-3 py-1 hover:border-[#3AF24B] transition flex items-center gap-2"
      :aria-label="$t('common.switchLanguage')"
    >
      <span class="text-sm">{{ currentLocale.toUpperCase() }}</span>
      <span class="text-xs">{{ isOpen ? '▲' : '▼' }}</span>
    </button>
    
    <div 
      v-if="isOpen" 
      class="absolute right-0 mt-2 w-32 bg-white border-2 border-black rounded-lg shadow-lg z-50"
    >
      <button
        v-for="locale in availableLocales"
        :key="locale.code"
        @click="switchLanguage(locale.code)"
        class="w-full px-4 py-2 text-left text-sm hover:bg-[#3AF24B] transition first:rounded-t-md last:rounded-b-md"
        :class="{ 'bg-gray-100 font-semibold': locale.code === currentLocale }"
      >
        {{ locale.name }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const { locale, locales, setLocale } = useI18n()
const isOpen = ref(false)

const currentLocale = computed(() => locale.value)
const availableLocales = computed(() => locales.value)

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function switchLanguage(newLocale: string) {
  setLocale(newLocale)
  isOpen.value = false
}

if (process.client) {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.relative')) {
      isOpen.value = false
    }
  })
}
</script>

