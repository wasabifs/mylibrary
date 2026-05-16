import { Client } from '@notionhq/client'

export const notion = new Client({ auth: process.env.NOTION_TOKEN })
export const DB_ID = process.env.NOTION_DB_ID!

// ─── Types ───────────────────────────────────────────────

export interface Book {
  pageId: string
  title: string
  subtitle: string
  author: string
  publisher: string
  rating: string
  tags: string[]
  cover: string | null
  startDate: string | null
  finishDate: string | null
  highlights: string[]
  // detail fields
  no: string
  motivation: string
  bookInfo: string
  afterthought: string
  followUp: string
  aiSummary: string
  hasNote: boolean
  hasReview: boolean
}

// ─── Helpers ─────────────────────────────────────────────

function parsePage(page: any): Omit<Book, 'highlights'> {
  const props = page.properties
  const title = props['Name']?.title?.map((t: any) => t.plain_text).join('') || '未命名'
  const subtitle = props['副標']?.rich_text?.map((t: any) => t.plain_text).join('') || ''
  const author = props['作者']?.rich_text?.map((t: any) => t.plain_text).join('') || ''
  const publisher = props['出版社']?.rich_text?.map((t: any) => t.plain_text).join('') || ''
  const rating = props['推薦']?.select?.name || ''
  const tags = props['Tags']?.multi_select?.map((t: any) => t.name) || []
  const startDate = props['Start']?.date?.start || null
  const finishDate = props['Finish']?.date?.start || null
  const no = props['No.']?.rich_text?.map((t: any) => t.plain_text).join('') || ''
  const motivation = props['閱讀動機']?.rich_text?.map((t: any) => t.plain_text).join('') || ''
  const bookInfo = props['書籍資訊']?.rich_text?.map((t: any) => t.plain_text).join('') || ''
  const afterthought = props['讀後啟發']?.rich_text?.map((t: any) => t.plain_text).join('') || ''
  const followUp = props['後續行動']?.rich_text?.map((t: any) => t.plain_text).join('') || ''
  const aiSummary = props['AI 摘要']?.rich_text?.map((t: any) => t.plain_text).join('') || ''
  const hasNote = props['筆記']?.checkbox || false
  const hasReview = props['心得']?.checkbox || false

  const coverFiles = props['封面']?.files || []
  let cover: string | null = coverFiles[0]?.file?.url || coverFiles[0]?.external?.url || null
  if (!cover && page.icon?.type === 'external') cover = page.icon.external.url
  if (!cover && page.icon?.type === 'file') cover = page.icon.file.url

  return { pageId: page.id, title, subtitle, author, publisher, rating, tags, cover, startDate, finishDate, no, motivation, bookInfo, afterthought, followUp, aiSummary, hasNote, hasReview }
}

async function queryAllPages(filter?: any): Promise<any[]> {
  const pages: any[] = []
  let cursor: string | undefined
  do {
    const res = await notion.databases.query({
      database_id: DB_ID,
      ...(filter ? { filter } : {}),
      page_size: 100,
      ...(cursor ? { start_cursor: cursor } : {}),
    })
    pages.push(...res.results)
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined
  } while (cursor)
  return pages
}

// ─── Public API ──────────────────────────────────────────

/** All books (no highlights) — for Library grid */
export async function getAllBooks(): Promise<Book[]> {
  const pages = await queryAllPages()
  return pages
    .map(p => ({ ...parsePage(p), highlights: [] }))
    .sort((a, b) => {
      const na = parseInt(a.no.replace('#', '')) || 0
      const nb = parseInt(b.no.replace('#', '')) || 0
      return nb - na
    })
}

/** Books currently being read (has Start, no Finish) */
export async function getReadingBooks(): Promise<Book[]> {
  const pages = await queryAllPages({
    and: [
      { property: 'Start', date: { is_not_empty: true } },
      { property: 'Finish', date: { is_empty: true } },
    ],
  })
  return pages
    .map(p => ({ ...parsePage(p), highlights: [] }))
    .sort((a, b) => {
      if (!a.startDate) return 1
      if (!b.startDate) return -1
      return b.startDate.localeCompare(a.startDate)
    })
}

/** Single book with highlights */
export async function getBookDetail(pageId: string): Promise<Book> {
  const page = await notion.pages.retrieve({ page_id: pageId })
  const base = parsePage(page)

  const blocksRes = await notion.blocks.children.list({ block_id: pageId, page_size: 100 })
  const highlights: string[] = []
  for (const block of blocksRes.results) {
    const b = block as any
    const richText = b[b.type]?.rich_text
    if (!richText) continue
    const text = richText.map((r: any) => r.plain_text).join('').trim()
    if (text.length > 8) highlights.push(text)
  }

  return { ...base, highlights }
}

/** All books with highlights — for 節錄重點 tab */
export async function getAllBooksWithHighlights(): Promise<Book[]> {
  const pages = await queryAllPages({ property: '筆記', checkbox: { equals: true } })
  const books: Book[] = []

  for (const page of pages) {
    const base = parsePage(page)
    const blocksRes = await notion.blocks.children.list({ block_id: page.id, page_size: 100 })
    const highlights: string[] = []
    for (const block of blocksRes.results) {
      const b = block as any
      const richText = b[b.type]?.rich_text
      if (!richText) continue
      const text = richText.map((r: any) => r.plain_text).join('').trim()
      if (text.length > 8) highlights.push(text)
    }
    if (highlights.length > 0) books.push({ ...base, highlights })
  }

  books.sort((a, b) => {
    if (!a.finishDate) return 1
    if (!b.finishDate) return -1
    return b.finishDate.localeCompare(a.finishDate)
  })
  return books
}
