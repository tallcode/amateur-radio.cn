import { defineStore } from 'pinia'
import * as database from './database'

export const useExplanationStore = defineStore('explanation', () => {
  async function get(questionId: string) {
    return database.get(questionId)
  }

  async function clear() {
    return database.clear()
  }

  return {
    get,
    clear,
  }
})
