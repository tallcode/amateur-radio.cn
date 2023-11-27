interface Examination {
  id: string
  category: string
  createdAt: number
  questions: {
    id: string
    options: number[]
    answer?: number
  }[]
}
