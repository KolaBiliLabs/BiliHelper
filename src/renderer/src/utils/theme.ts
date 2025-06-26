import { useSystemStore } from '@/stores/systemStore'

/**
 * 设置应用主题
 * @param theme 主题模式，可选值：'light' | 'dark'
 */
export function setTheme(theme: 'light' | 'dark') {
  const systemStore = useSystemStore()
  systemStore.theme = theme

  // 更新HTML元素的data-theme属性
  document.documentElement.setAttribute('data-theme', theme)
}
