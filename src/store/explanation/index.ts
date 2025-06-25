import { defineStore } from 'pinia'
import * as database from './database'

export const useExplanationStore = defineStore('explanation', () => {
  async function get(questionId: string) {
    return database.get(questionId)
  }

  return {
    get,
  }
})
