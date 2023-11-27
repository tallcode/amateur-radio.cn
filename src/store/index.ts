import { createPinia } from 'pinia'

export { useQuestionStore } from './question'
export { useExaminationStore } from './examination/index'
export { useBookmarkStore } from './bookmark/index'

export default createPinia()
