import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import * as database from './database'

export const useQuestionStore = defineStore('question', () => {
  const route = useRoute()
  const questions = ref<Question[]>([])

  const category = computed(() => {
    if (Array.isArray(route.params.category))
      return route.params.category[0] || 'a'
    else
      return route.params.category || 'a'
  })

  watch(category, async (category) => {
    if (category) {
      questions.value = []
      questions.value = await database.get(category)
    }
  }, {
    immediate: true,
  })

  return {
    questions,
    category,
  }
})
