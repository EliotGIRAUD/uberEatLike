<template>
  <picture>
    <source
      v-if="avifSrc"
      :srcset="generateSrcset(avifSrc)"
      :sizes="sizes"
      type="image/avif"
    />
    
    <source
      v-if="webpSrc"
      :srcset="generateSrcset(webpSrc)"
      :sizes="sizes"
      type="image/webp"
    />
    
    <img
      :src="src"
      :srcset="generateSrcset(src)"
      :sizes="sizes"
      :alt="alt"
      :loading="loading"
      :decoding="decoding"
      :class="imgClass"
      :width="width"
      :height="height"
    />
  </picture>
</template>

<script setup lang="ts">
interface Props {
  src: string
  alt: string
  webpSrc?: string
  avifSrc?: string
  sizes?: string
  loading?: 'lazy' | 'eager'
  decoding?: 'async' | 'sync' | 'auto'
  imgClass?: string
  width?: number
  height?: number
  responsive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: 'lazy',
  decoding: 'async',
  sizes: '100vw',
  responsive: true,
})

/**
 * Generates the srcset for responsive images
 * Adds 1x, 2x variants for retina screens
 */
function generateSrcset(imageSrc: string): string {
  if (!props.responsive) {
    return imageSrc
  }
  
  const basePath = imageSrc.replace(/\.(jpg|jpeg|png|webp|avif)$/i, '')
  const extension = imageSrc.match(/\.(jpg|jpeg|png|webp|avif)$/i)?.[0] || ''
  
  return `${imageSrc} 1x, ${imageSrc} 2x`
}
</script>

