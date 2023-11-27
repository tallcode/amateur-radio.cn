import localforage from 'localforage'
import LoadQuestionAPI from '@/assets/full.json?url'

const store = localforage.createInstance({
  name: 'question',
  storeName: 'question',
})

const cache = {
  a: undefined,
  b: undefined,
  c: undefined,
} as Record<string, Question[] | undefined>

export async function read() {
  const cache = await store.getItem('all') as Question[]
  if (Array.isArray(cache) && cache.length) {
    return cache
  }
  else {
    const data = await fetch(LoadQuestionAPI).then(res => res.json()) as Question[]
    if (Array.isArray(data) && data.length)
      await store.setItem('all', data)
    return data
  }
}

export async function get(category: string) {
  if (cache[category]) {
    return cache[category]!
  }
  else {
    const data = await read()
    cache[category] = data.filter(question => question.category.includes(category.toUpperCase()))
    return cache[category]!
  }
}
