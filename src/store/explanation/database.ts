import localforage from 'localforage'

const store = localforage.createInstance({
  name: 'explanation',
  storeName: 'explanation',
})

async function fetchRemote(questionId: string) {
  try {
    const response = await fetch(`/explanation/${questionId}.txt`)
    if (response.ok) {
      return await response.text()
    }
  }
  catch (error) {
    console.error(error)
    return ''
  }
}

export async function get(questionId: string) {
  const exp = await store.getItem(questionId) as string
  if (exp) {
    return exp
  }
  else {
    const data = await fetchRemote(questionId) as string
    if (data)
      await store.setItem(questionId, data)
    return data
  }
}
