import { createApp } from 'vue'
import App from './App.vue'
import { setupPinia } from './plugins/store'

import './assets/main.css'

function bootstrap() {
  const app = createApp(App)
  setupPinia(app)
  app.mount('#app')
}

bootstrap()
