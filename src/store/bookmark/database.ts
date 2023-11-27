import localforage from 'localforage'
import { toRaw } from 'vue'

const key = 'bookmark'
const bookmarkStore = {
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
  if (bookmarkStore[category]) {
    const keys = await bookmarkStore[category].keys()
    const bookmarks = await Promise.all(keys.map(async (key) => {
      return await bookmarkStore[category as string].getItem(key) as Bookmark
    }))
    return bookmarks
  }
  else {
    return []
  }
}

export async function create(category: string, bookmark: Bookmark) {
  if (bookmarkStore[category])
    await bookmarkStore[category].setItem(bookmark.id, toRaw(bookmark))
}

export async function update(category: string, bookmark: Bookmark) {
  if (bookmarkStore[category])
    await bookmarkStore[category].setItem(bookmark.id, toRaw(bookmark))
}

export async function remove(category: string, id: string) {
  if (bookmarkStore[category])
    await bookmarkStore[category].removeItem(id)
}

export async function clear(category: string) {
  if (bookmarkStore[category])
    await bookmarkStore[category].clear()
}
