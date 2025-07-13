import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import { createApp } from 'vue'
import App from './App.vue'
import { setupPinia } from './plugins/store'

import './assets/main.css'

function bootstrap() {
  const app = createApp(App)
  setupPinia(app)

  app.use(autoAnimatePlugin)
  app.mount('#app')
}

bootstrap()
