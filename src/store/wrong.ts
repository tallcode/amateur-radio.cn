import { defineStore, storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { useQuestionStore } from './question'

const key = 'wrong'

function loadWrong() {
  try {
    const allWrong = localStorage.getItem(key)
    if (allWrong)
      return JSON.parse(allWrong)
    else
      return []
  }
  catch (e) {
    return []
  }
}

function saveWrong(allWrong?: Wrong[]) {
  if (!allWrong)
    localStorage.removeItem(key)
  else
    localStorage.setItem(key, JSON.stringify(allWrong))
}

export const useWrongStore = defineStore('wrong', () => {
  const _allWrong = ref<Wrong[]>(loadWrong() || [])
  const allWrong = computed({
    get() {
      return _allWrong.value
    },
    set(value) {
      _allWrong.value = value || []
      saveWrong(_allWrong.value)
    },
  })
  const questionStore = useQuestionStore()
  const { category } = storeToRefs(questionStore)
  const wrongQuestion = computed(() => {
    return allWrong.value.filter(w => w.category === category.value).sort((a, b) => b.time - a.time)
  })

  const record = function (questionId: string, yourAnswer: number) {
    const index = allWrong.value.findIndex(w => w.questionId === questionId && w.category === category.value)
    if (index !== -1)
      allWrong.value.splice(index, 1)
    const wrong: Wrong = {
      id: uuidv4(),
      time: Date.now(),
      category: category.value,
      questionId,
      yourAnswer,
    }
    allWrong.value = [wrong, ...allWrong.value]
  }

  const remove = function (id: string) {
    allWrong.value = allWrong.value.filter(w => w.id !== id)
  }

  const clear = function () {
    allWrong.value = allWrong.value.filter(w => w.category !== category.value)
  }

  return {
    wrongQuestion,
    record,
    remove,
    clear,
  }
})
