import { createPinia } from 'pinia'

export { useBookmarkStore } from './bookmark/index'
export { useExaminationStore } from './examination/index'
export { useExplanationStore } from './explanation/index'
export { useQuestionStore } from './question'

export default createPinia()
