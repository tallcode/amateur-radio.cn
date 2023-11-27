import { defineStore, storeToRefs } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { ref, watch } from 'vue'
import { useQuestionStore } from '../question'
import * as database from './database'

export const useBookmarkStore = defineStore('bookmark', () => {
  const questionStore = useQuestionStore()
  const { category } = storeToRefs(questionStore)
  const bookmarks = ref<Bookmark[]>([])

  const remove = async function (id: string) {
    bookmarks.value = bookmarks.value.filter(b => b.id !== id)
    await database.remove(category.value, id)
  }

  const clear = async function () {
    bookmarks.value = []
    await database.clear(category.value)
  }

  const record = async function (questionId: string, yourAnswer: number) {
    const bookmark = bookmarks.value.find(b => b.questionId === questionId && b.category === category.value)
    if (bookmark)
      await remove(bookmark.id)
    const newBookmark: Bookmark = {
      id: uuidv4(),
      time: Date.now(),
      category: category.value,
      questionId,
      yourAnswer,
    }
    bookmarks.value = [newBookmark, ...bookmarks.value]
    await database.create(category.value, newBookmark)
  }

  watch(category, async (category) => {
    if (category) {
      bookmarks.value = []
      bookmarks.value = (await database.read(category)).sort((a, b) => b.time - a.time)
    }
  }, {
    immediate: true,
  })

  return {
    bookmarks,
    record,
    remove,
    clear,
  }
})
