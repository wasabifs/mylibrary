import { Client } from '@notionhq/client'

export const notion = new Client({ auth: process.env.NOTION_TOKEN })
export const DB_ID = process.env.NOTION_DB_ID!

// ─── Types ─────────────────────────────────────────────────────────────────

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

export interface ExcerptFlat {
  bookTitle: string
  bookCover: string | null
  author: string
  rating: string
  finishDate: string | null
  text: string
}

export interface ReadingStats {
  totalBooks: number
  totalFinished: number
  totalReading: number
  totalUnread: number
  totalHighlightBooks: number
  maxHighlightBook: { title: string; count: number } | null
  byYear: { year: string; count: number }[]
  byMonth: { month: string; count: number }[]   // 新增：月份分佈
  byTag: { tag: string; count: number }[]
  byRating: { rating: string; count: number }[]
  avgDaysPerBook: number
  longestBook: { title: string; days: number } | null
  fastestBook: { title: string; days: number } | null
  mostTagged: { tag: string; count: number } | null
}

// ─── Helpers ───────────────────────────────────────────────────────────────

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

  return {
    pageId: page.id,
    title, subtitle, author, publisher, rating, tags,
    cover, startDate, finishDate, no,
    motivation, bookInfo, afterthought, followUp, aiSummary,
    hasNote, hasReview,
  }
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

// ─── Rating star count helper ───────────────────────────────────────────────
function countStars(rating: string): number {
  const filled = (rating.match(/★/g) || []).length
  if (filled > 0) return filled
  return rating.replace(/[☆\s]/g, '').length
}

// ─── Fetch all blocks with pagination (breaks 100-block limit) ─────────────
async function fetchAllBlocks(pageId: string): Promise<string[]> {
  const highlights: string[] = []
  let cursor: string | undefined
  do {
    const res = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 100,
      ...(cursor ? { start_cursor: cursor } : {}),
    })
    for (const block of res.results) {
      const b = block as any
      const richText = b[b.type]?.rich_text
      if (!richText) continue
      const text = richText.map((r: any) => r.plain_text).join('').trim()
      if (text.length > 8) highlights.push(text)
    }
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined
  } while (cursor)
  return highlights
}

// ─── Public API ────────────────────────────────────────────────────────────

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
  const highlights = await fetchAllBlocks(pageId)
  return { ...base, highlights }
}

/** All books with highlights — for 節錄重點 tab */
export async function getAllBooksWithHighlights(): Promise<Book[]> {
  const pages = await queryAllPages({
    property: '筆記',
    checkbox: { equals: true },
  })

  const baseBooks = pages.map(p => parsePage(p))

  // 並行抓取所有書的 blocks（支援超過 100 筆）
  const highlightsArr = await Promise.all(
    baseBooks.map(b => fetchAllBlocks(b.pageId))
  )

  const books: Book[] = baseBooks
    .map((base, i) => ({ ...base, highlights: highlightsArr[i] }))
    .filter(b => b.highlights.length > 0)

  books.sort((a, b) => {
    if (!a.finishDate) return 1
    if (!b.finishDate) return -1
    return b.finishDate.localeCompare(a.finishDate)
  })

  return books
}

/** Flat list of all excerpts — for 每日精選 */
export async function getAllExcerptsFlat(): Promise<ExcerptFlat[]> {
  const books = await getAllBooksWithHighlights()
  const flat: ExcerptFlat[] = []
  for (const book of books) {
    for (const text of book.highlights) {
      if (text.trim()) {
        flat.push({
          bookTitle: book.title,
          bookCover: book.cover,
          author: book.author,
          rating: book.rating,
          finishDate: book.finishDate,
          text: text.trim(),
        })
      }
    }
  }
  return flat
}

/** Reading statistics — for 統計 tab */
export async function getReadingStats(): Promise<ReadingStats> {
  const pages = await queryAllPages()
  const books = pages.map(p => parsePage(p))

  const totalBooks = books.length
  const finished = books.filter(b => b.finishDate)
  const totalFinished = finished.length
  const totalReading = books.filter(b => b.startDate && !b.finishDate).length
  const totalUnread = books.filter(b => !b.startDate).length
  const totalHighlightBooks = books.filter(b => b.hasNote).length

  // By year (finish date) — sorted newest first (desc)
  const yearMap: Record<string, number> = {}
  for (const b of finished) {
    const year = b.finishDate!.slice(0, 4)
    yearMap[year] = (yearMap[year] || 0) + 1
  }
  const byYear = Object.entries(yearMap)
    .sort((a, b) => b[0].localeCompare(a[0])) // desc: newest first
    .map(([year, count]) => ({ year, count }))

  // By tag
  const tagMap: Record<string, number> = {}
  for (const b of books) {
    for (const t of b.tags) {
      tagMap[t] = (tagMap[t] || 0) + 1
    }
  }
  const byTag = Object.entries(tagMap)
    .sort((a, b) => b[1] - a[1])
    .map(([tag, count]) => ({ tag, count }))

  // By rating — sorted by star count descending
  const ratingMap: Record<string, number> = {}
  for (const b of books) {
    if (b.rating) {
      ratingMap[b.rating] = (ratingMap[b.rating] || 0) + 1
    }
  }
  const byRating = Object.entries(ratingMap)
    .sort((a, b) => countStars(b[0]) - countStars(a[0])) // most stars first
    .map(([rating, count]) => ({ rating, count }))

  // Avg days, longest, fastest
  const withDays = finished
    .filter(b => b.startDate)
    .map(b => ({
      title: b.title,
      days: Math.floor(
        (new Date(b.finishDate!).getTime() - new Date(b.startDate!).getTime()) / 86400000
      ),
    }))
    .filter(b => b.days >= 0)

  const avgDaysPerBook = withDays.length
    ? Math.round(withDays.reduce((s, b) => s + b.days, 0) / withDays.length)
    : 0

  const longestBook = withDays.length
    ? withDays.reduce((a, b) => (b.days > a.days ? b : a))
    : null

  const fastestBook = withDays.length
    ? withDays.reduce((a, b) => (b.days < a.days ? b : a))
    : null

  const mostTagged = byTag[0] ?? null

  // 月份分佈（1～12 月，跨年度累計完讀數）
  const monthMap: Record<string, number> = {}
  for (let m = 1; m <= 12; m++) {
    monthMap[String(m).padStart(2, '0')] = 0
  }
  for (const b of finished) {
    const month = b.finishDate!.slice(5, 7)
    monthMap[month] = (monthMap[month] || 0) + 1
  }
  const byMonth = Object.entries(monthMap)
    .sort()
    .map(([month, count]) => ({ month, count }))

  // 真實節錄條數最多的書：並行抓取有筆記的書的 blocks
  let maxHighlightBook: { title: string; count: number } | null = null
  const notesBooks = books.filter(b => b.hasNote)
  if (notesBooks.length > 0) {
    const counts = await Promise.all(
      notesBooks.map(async b => ({
        title: b.title,
        count: (await fetchAllBlocks(b.pageId)).length,
      }))
    )
    counts.sort((a, b) => b.count - a.count)
    maxHighlightBook = counts[0] ?? null
  }

  return {
    totalBooks,
    totalFinished,
    totalReading,
    totalUnread,
    totalHighlightBooks,
    maxHighlightBook,
    byYear,
    byMonth,
    byTag,
    byRating,
    avgDaysPerBook,
    longestBook,
    fastestBook,
    mostTagged,
  }
}
