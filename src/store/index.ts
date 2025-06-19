import { createPinia } from 'pinia'

export { useBookmarkStore } from './bookmark/index'
export { useExaminationStore } from './examination/index'
export { useQuestionStore } from './question'

export default createPinia()
