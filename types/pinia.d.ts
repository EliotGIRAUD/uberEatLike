// d.ts pour l'option `persist` de @pinia-plugin-persistedstate/nuxt
import 'pinia'

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S, Store> {
    persist?: boolean | Record<string, unknown>
  }
}
