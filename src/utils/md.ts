import katexEngine from 'katex'
import markdownit from 'markdown-it'
import Texmath from 'markdown-it-texmath'

const md = markdownit()
md.use(Texmath, {
  engine: katexEngine,
  delimiters: ['brackets', 'dollars'],
})

export default function renderMarkdown(markdown: string): string {
  return md.render(markdown)
}
