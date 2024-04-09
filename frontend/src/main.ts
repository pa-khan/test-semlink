import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { ISample } from './shared/contracts/sample'

const sample: ISample = {
  name: "Hello"
}

console.log(sample)

createApp(App).mount('#app')
