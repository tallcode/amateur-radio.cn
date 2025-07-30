let mdInstance: any = null

async function initMarkdown() {
  if (mdInstance) {
    return mdInstance
  }

  const [
    { default: katexEngine },
    { default: markdownit },
    { default: Texmath },
  ] = await Promise.all([
    import('katex'),
    import('markdown-it'),
    import('markdown-it-texmath'),
  ])

  mdInstance = markdownit()
  mdInstance.use(Texmath, {
    engine: katexEngine,
    delimiters: ['brackets', 'dollars'],
  })

  return mdInstance
}

export default async function renderMarkdown(markdown: string): Promise<string> {
  const md = await initMarkdown()
  return md.render(markdown)
}
