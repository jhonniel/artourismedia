export interface ParsedServiceContent {
  introHtml?: string
  experienceItems: string[]
}

export function parseServiceContent(content?: string): ParsedServiceContent {
  if (!content?.trim()) {
    return { experienceItems: [] }
  }

  const splitMatch = content.match(
    /([\s\S]*?)<h3[^>]*>\s*Projects and Experience:?\s*<\/h3>([\s\S]*)/i,
  )

  if (!splitMatch) {
    return { introHtml: content.trim(), experienceItems: [] }
  }

  const introHtml = splitMatch[1].trim() || undefined
  const listSection = splitMatch[2]
  const experienceItems: string[] = []
  const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi
  let match: RegExpExecArray | null

  while ((match = liRegex.exec(listSection)) !== null) {
    const text = match[1]
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    if (text) {
      experienceItems.push(text)
    }
  }

  return { introHtml, experienceItems }
}
