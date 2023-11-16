import { createPinia } from 'pinia'

export { useQuestionStore } from './question'
export { useExamStore } from './exam'
export { useWrongStore } from './wrong'

export default createPinia()
