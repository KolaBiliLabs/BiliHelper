import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import { createApp } from 'vue'
import App from './App.vue'
import { debounceDirective, throttleDirective, visibleDirective } from './directives'

import { setupPinia } from './plugins/store'
import { setupRouter } from './router'

import { initIpc } from './utils/initIpc'
import './assets/main.css'

// 初始化 ipc
initIpc()

function bootstrap() {
  const app = createApp(App)

  // 设置 pinia
  setupPinia(app)
  // 设置路由
  setupRouter(app)

  // 动画指令 v-auto-animate
  app.use(autoAnimatePlugin)
  // 自定义指令
  app.directive('debounce', debounceDirective)
  app.directive('throttle', throttleDirective)
  app.directive('visible', visibleDirective)

  app.mount('#app')
}

bootstrap()
