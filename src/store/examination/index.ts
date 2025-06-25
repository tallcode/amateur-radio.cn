import { sampleSize, shuffle, sortBy } from 'lodash-es'
import { defineStore, storeToRefs } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { ref, watch } from 'vue'
import { useQuestionStore } from '../question'
import * as database from './database'

export const useExaminationStore = defineStore('examination', () => {
  const questionStore = useQuestionStore()
  const { category, questions } = storeToRefs(questionStore)
  const examinations = ref<Examination[]>([])

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

  const create = async () => {
    const examQuestions = sortBy(sampleSize(questions.value, num(category.value)), 'id')
    const newExamination: Examination = {
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
    examinations.value = [newExamination, ...examinations.value]
    await database.create(newExamination)
    return newExamination.id
  }

  const answer = async (id: string, questionId: string, answer: number) => {
    const examination = examinations.value.find(e => e.id === id)
    if (examination) {
      const question = examination.questions.find(question => question.id === questionId)
      if (question && !question.answer) {
        question.answer = answer
        await database.update(examination)
      }
    }
  }

  const remove = async (id: string) => {
    examinations.value = examinations.value.filter(e => e.id !== id)
    await database.remove(category.value, id)
  }

  watch(category, async (category) => {
    if (category) {
      examinations.value = []
      examinations.value = (await database.read(category)).sort((a, b) => b.createdAt - a.createdAt)
    }
  }, {
    immediate: true,
  })

  return {
    examinations,
    create,
    answer,
    remove,
  }
})
