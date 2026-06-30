import type { ComputedRef, MaybeRef } from 'vue'

type ComponentProps<T> = T extends new(...args: any) => { $props: infer P } ? NonNullable<P>
  : T extends (props: infer P, ...args: any) => any ? P
  : {}

declare module 'nuxt/app' {
  interface NuxtLayouts {
    admin: ComponentProps<typeof import("H:/Documents/GitHub/dreamine2api/layouts/admin.vue").default>,
}
  export type LayoutKey = keyof NuxtLayouts extends never ? string : keyof NuxtLayouts
  interface PageMeta {
    layout?: MaybeRef<LayoutKey | false> | ComputedRef<LayoutKey | false>
  }
}