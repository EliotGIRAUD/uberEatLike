<template>
  <div>
    <SplashScreen />
    <NuxtLayout>
      <NuxtPage :transition="{
        name: 'page',
        mode: 'out-in'
      }" />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import SplashScreen from '~/components/SplashScreen.vue'
</script>
