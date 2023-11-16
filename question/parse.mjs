import fs from 'node:fs/promises'

async function get(file) {
  const text = await fs.readFile(file, 'utf-8')
  const questions = text.split(/[\r\n]{4,}/).filter(q => !!q).map((q) => {
    const [I] = q.split(/\r\n/)
    return I
  })
  return questions
}

(async () => {
  const text = await fs.readFile('./FULL.txt', 'utf-8')
  const a = await get('./A.txt')
  const b = await get('./B.txt')
  const c = await get('./C.txt')
  const questions = text.split(/[\r\n]{4,}/).filter(q => !!q).map((q) => {
    const [I, Q, A, B, C, D, P] = q.split(/\r\n/)
    const category = []
    if (a.includes(I))
      category.push('A')

    if (b.includes(I))
      category.push('B')

    if (c.includes(I))
      category.push('C')

    return {
      id: I.replace('[I]', ''),
      category,
      question: Q.replace('[Q]', ''),
      picture: P.replace('[P]', ''),
      options: [
        A.replace('[A]', ''),
        B.replace('[B]', ''),
        C.replace('[C]', ''),
        D.replace('[D]', ''),
      ],
      answer: 0,
    }
  })
  await fs.writeFile('./full.json', JSON.stringify(questions, null, 2))
})()
