import { uniq } from 'lodash-es'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import * as database from './database'

export const useQuestionStore = defineStore('question', () => {
  const route = useRoute()
  const questions = ref<Question[]>([])

  const keyword = ref<string>()
  const paragraph = ref<string>()

  const category = computed<'a' | 'b' | 'c'>(() => {
    const param = route.params.category as 'a' | 'b' | 'c'
    if (Array.isArray(param))
      return param[0] || 'a'
    else
      return param || 'a'
  })

  function match(q: Question, keyword?: string, paragraph?: string): boolean {
    if (!keyword && !paragraph)
      return true
    const keywordLower = keyword?.toLowerCase()
    return (!!keywordLower && (q.Q.toLowerCase().includes(keywordLower) || q.O.some(option => option.toLowerCase().includes(keywordLower))))
      || (!!paragraph && q.P.join('.').startsWith(paragraph))
  }

  const filteredQuestions = computed(() => {
    if (keyword.value || paragraph.value) {
      return questions.value.filter(question => match(question, keyword.value, paragraph.value))
    }
    else {
      return questions.value
    }
  })

  const paragraphs = computed(() => {
    return uniq(questions.value.map((question) => {
      const { P } = question
      return P.join('.')
    }))
  })

  const clear = async () => {
    await database.clear()
    questions.value = []
    keyword.value = undefined
    paragraph.value = undefined
    if (category.value) {
      questions.value = await database.get(category.value)
    }
  }

  watch(category, async (category) => {
    if (category) {
      questions.value = []
      keyword.value = undefined
      paragraph.value = undefined
      questions.value = await database.get(category)
    }
  }, {
    immediate: true,
  })

  return {
    full: questions,
    questions: filteredQuestions,
    paragraphs,
    category,
    keyword,
    paragraph,
    clear,
    match,
  }
})
