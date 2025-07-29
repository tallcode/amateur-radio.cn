import localforage from 'localforage'
import QuestionA from '@/assets/A.json?url'
import QuestionB from '@/assets/B.json?url'
import QuestionC from '@/assets/C.json?url'

const question = {
  a: QuestionA,
  b: QuestionB,
  c: QuestionC,
}

const store = localforage.createInstance({
  name: 'question',
  storeName: 'question',
})

const cache = {
  a: undefined,
  b: undefined,
  c: undefined,
} as Record<string, Question[] | undefined>

export async function read(category: 'a' | 'b' | 'c') {
  const cache = await store.getItem(category) as Question[]
  if (Array.isArray(cache) && cache.length) {
    return cache
  }
  else {
    const data = await fetch(question[category]).then(res => res.json()) as Question[]
    if (Array.isArray(data) && data.length)
      await store.setItem(category, data)
    return data
  }
}

export async function get(category: 'a' | 'b' | 'c') {
  if (cache[category]) {
    return cache[category]!
  }
  else {
    const data = await read(category)
    cache[category] = data
    return cache[category]!
  }
}

export async function clear() {
  await store.clear()
  Object.keys(cache).forEach((key) => {
    cache[key as 'a' | 'b' | 'c'] = undefined
  })
  return true
}
