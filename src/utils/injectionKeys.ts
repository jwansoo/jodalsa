import type { InjectionKey, Ref } from 'vue'

export interface MenuInjectionOprions {
  menuOpen: Ref<boolean>
  toggleMenu: () => void
}

export const menuKey = Symbol() as InjectionKey<MenuInjectionOprions>
