import { defineStore } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import LoadQuestionAPI from '@/assets/full.json?url'

export const useQuestionStore = defineStore('question', () => {
  const route = useRoute()
  const allQuestions = ref<Question[]>([])
  const category = computed(() => {
    if (Array.isArray(route.params.category))
      return route.params.category[0] || 'a'
    else
      return route.params.category || 'a'
  })

  const questions = computed(() => {
    return allQuestions.value.filter(question => question.category.includes(category.value.toUpperCase()))
  })

  onMounted(async () => {
    const data = await fetch(LoadQuestionAPI).then(res => res.json()) as Question[]
    if (Array.isArray(data) && data.length)
      allQuestions.value = data
  })

  return {
    questions,
    category,
  }
})
