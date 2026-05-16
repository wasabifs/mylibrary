import { Client } from '@notionhq/client'

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

export const DB_ID = process.env.NOTION_DB_ID!

export interface Book {
  pageId: string
  title: string
  author: string
  rating: string
  tags: string[]
  cover: string | null
  finishDate: string | null
  highlights: string[]
}

export async function getAllBooksWithHighlights(): Promise<Book[]> {
  // 1. Query database — only pages with 筆記=true
  const pages: any[] = []
  let cursor: string | undefined

  do {
    const res = await notion.databases.query({
      database_id: DB_ID,
      filter: { property: '筆記', checkbox: { equals: true } },
      page_size: 100,
      ...(cursor ? { start_cursor: cursor } : {}),
    })
    pages.push(...res.results)
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined
  } while (cursor)

  // 2. For each page, fetch block children (highlights)
  const books: Book[] = []

  for (const page of pages) {
    const props = (page as any).properties
    const title = props['Name']?.title?.map((t: any) => t.plain_text).join('') || '未命名'
    const author = props['作者']?.rich_text?.map((t: any) => t.plain_text).join('') || ''
    const rating = props['推薦']?.select?.name || ''
    const tags = props['Tags']?.multi_select?.map((t: any) => t.name) || []
    const finishDate = props['Finish']?.date?.start || null

    // Cover
    const coverFiles = props['封面']?.files || []
    let cover: string | null =
      coverFiles[0]?.file?.url || coverFiles[0]?.external?.url || null
    if (!cover && (page as any).icon?.type === 'external')
      cover = (page as any).icon.external.url
    if (!cover && (page as any).icon?.type === 'file')
      cover = (page as any).icon.file.url

    // Highlights from page blocks
    const blocksRes = await notion.blocks.children.list({
      block_id: page.id,
      page_size: 100,
    })

    const highlights: string[] = []
    for (const block of blocksRes.results) {
      const b = block as any
      const richText = b[b.type]?.rich_text
      if (!richText) continue
      const text = richText.map((r: any) => r.plain_text).join('').trim()
      if (text.length > 8) highlights.push(text)
    }

    if (highlights.length > 0) {
      books.push({ pageId: page.id, title, author, rating, tags, cover, finishDate, highlights })
    }
  }

  // Sort by finishDate descending (most recent first)
  books.sort((a, b) => {
    if (!a.finishDate) return 1
    if (!b.finishDate) return -1
    return b.finishDate.localeCompare(a.finishDate)
  })

  return books
}
