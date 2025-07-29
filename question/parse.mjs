import fs from 'node:fs/promises'

(async () => {
  const text = await fs.readFile('./C.txt', 'utf-8')
  const questions = text.split(/(?=[\r\n]\[J\])/).filter(q => !!q).map((q) => {
    const lines = q.split(/(?=\[[JIPQTABDCF]\])/)
    const data = lines.reduce((acc, line) => {
      const match = line.trim().match(/^\[([A-Z])\]/)
      if (match) {
        acc[match[1]] = line.trim().replace(/[\r\n]+/g, '')
      }
      return acc
    }, {})
    return {
      I: data.I.replace('[I]', '').replace(/^MC\d+-/, ''),
      P: data.P.replace('[P]', '').split('.'),
      J: data.J.replace('[J]', ''),
      Q: data.Q.replace('[Q]', ''),
      T: data.T.replace('[T]', '').split('').map(t => ['A', 'B', 'C', 'D'].findIndex(c => c === t)),
      O: [
        data.A.replace('[A]', ''),
        data.B.replace('[B]', ''),
        data.C.replace('[C]', ''),
        data.D.replace('[D]', ''),
      ],
      F: (data.F || '').replace('[F]', ''),
    }
  })
  await fs.writeFile('./C.json', JSON.stringify(questions, null, 2))
})()
