import { sampleSize, shuffle, sortBy } from 'lodash-es'
import { defineStore, storeToRefs } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { ref, watch } from 'vue'
import { useQuestionStore } from '../question'
import * as database from './database'

export const useExaminationStore = defineStore('examination', () => {
  const questionStore = useQuestionStore()
  const { category, full } = storeToRefs(questionStore)
  const examinations = ref<Examination[]>([])

  const num = (category: string) => {
    switch (category) {
      case 'b':
        return 60
      case 'c':
        return 90
      default:
        return 40
    }
  }

  const create = async () => {
    const examQuestions = sortBy(sampleSize(full.value, num(category.value)), 'I')
    const newExamination: Examination = {
      id: uuidv4(),
      createdAt: Date.now(),
      category: category.value,
      questions: examQuestions.map((q) => {
        const O = shuffle([0, 1, 2, 3])
        return {
          I: q.I,
          O,
          T: q.T.map(id => O.indexOf(id)),
          S: [],
        }
      }),
    }
    examinations.value = [newExamination, ...examinations.value]
    await database.create(newExamination)
    return newExamination.id
  }

  const answer = async (id: string, questionId: string, answer: number[]) => {
    const examination = examinations.value.find(e => e.id === id)
    if (examination) {
      const question = examination.questions.find(question => question.I === questionId)
      if (question) {
        question.S = answer || []
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

  const clear = async () => {
    examinations.value = []
    await database.clear('a')
    await database.clear('b')
    await database.clear('c')
  }

  return {
    examinations,
    create,
    answer,
    remove,
    clear,
  }
})
