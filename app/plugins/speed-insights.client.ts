import { injectSpeedInsights } from '@vercel/speed-insights'

export default defineNuxtPlugin(() => {
  // Inject Vercel Speed Insights pour tracker les Core Web Vitals
  injectSpeedInsights()
})
