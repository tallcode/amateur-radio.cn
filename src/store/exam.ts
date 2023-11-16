import { defineStore, storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { sampleSize, shuffle, sortBy } from 'lodash-es'
import { useQuestionStore } from './question'

const key = 'exam'

function loadExam() {
  try {
    const allExam = localStorage.getItem(key)
    if (allExam)
      return JSON.parse(allExam)
    else
      return []
  }
  catch (e) {
    return []
  }
}

function saveExam(allExam?: Exam[]) {
  if (!allExam)
    localStorage.removeItem(key)
  else
    localStorage.setItem(key, JSON.stringify(allExam))
}

export const useExamStore = defineStore('exam', () => {
  const _allExam = ref<Exam[]>(loadExam() || [])
  const allExam = computed({
    get() {
      return _allExam.value
    },
    set(value) {
      _allExam.value = value || []
      saveExam(_allExam.value)
    },
  })
  const questionStore = useQuestionStore()
  const { category, questions } = storeToRefs(questionStore)
  const exam = computed(() => {
    return allExam.value.filter(exam => exam.category === category.value).sort((a, b) => b.createdAt - a.createdAt)
  })

  const num = (category: string) => {
    switch (category) {
      case 'b':
        return 50
      case 'c':
        return 80
      default:
        return 30
    }
  }

  const create = () => {
    const examQuestions = sortBy(sampleSize(questions.value, num(category.value)), 'id')
    const exam: Exam = {
      id: uuidv4(),
      createdAt: Date.now(),
      category: category.value,
      questions: examQuestions.map((q) => {
        return {
          id: q.id,
          options: shuffle([0, 1, 2, 3]),
        }
      }),
    }
    allExam.value = [exam, ...allExam.value]
    return exam.id
  }

  const answer = (id: string, questionId: string, answer: number) => {
    const exam = allExam.value.find(exam => exam.id === id)
    if (exam) {
      const question = exam.questions.find(question => question.id === questionId)
      if (question) {
        question.answer = answer
        allExam.value = [...allExam.value]
      }
    }
  }

  const remove = (id: string) => {
    allExam.value = allExam.value.filter(exam => exam.id !== id)
  }

  return {
    exam,
    create,
    answer,
    remove,
  }
})
