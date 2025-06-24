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

fetch('/api/search?keyword=1312321').then(res => res.json()).then((res) => {
  console.log(res)
})

fetch('/t-api').then(res => res.json()).then((res) => {
  console.log(res)
})
