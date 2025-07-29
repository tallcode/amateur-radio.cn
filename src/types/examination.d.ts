interface Examination {
  id: string
  category: string
  createdAt: number
  questions: {
    I: string
    O: number[]
    T: number[]
    S: number[]
  }[]
}
