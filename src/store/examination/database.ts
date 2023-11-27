import localforage from 'localforage'
import { toRaw } from 'vue'

const key = 'examination'
const examinationStore = {
  a: localforage.createInstance({
    name: `${key}_a`,
    storeName: `${key}_a`,
  }),
  b: localforage.createInstance({
    name: `${key}_b`,
    storeName: `${key}_b`,
  }),
  c: localforage.createInstance({
    name: `${key}_c`,
    storeName: `${key}_c`,
  }),
} as Record<string, LocalForage>

export async function read(category: string) {
  if (examinationStore[category]) {
    const keys = await examinationStore[category].keys()
    const examinations = await Promise.all(keys.map(async (key) => {
      return await examinationStore[category as string].getItem(key) as Examination
    }))
    return examinations
  }
  else {
    return []
  }
}

export async function create(examination: Examination) {
  if (examinationStore[examination.category])
    await examinationStore[examination.category].setItem(examination.id, toRaw(examination))
}

export async function update(examination: Examination) {
  if (examinationStore[examination.category])
    await examinationStore[examination.category].setItem(examination.id, toRaw(examination))
}

export async function remove(category: string, id: string) {
  if (examinationStore[category])
    await examinationStore[category].removeItem(id)
}

export async function clear(category: string) {
  if (examinationStore[category])
    await examinationStore[category].clear()
}
