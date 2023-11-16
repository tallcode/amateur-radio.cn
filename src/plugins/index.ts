import type { App } from 'vue'
import pinia from '../store'
import router from '../router'
import vuetify from './vuetify'

export function registerPlugins(app: App) {
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
}
