import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MyLibrary',
  description: '我的閱讀節錄',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#0f0e0c',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@300;400;500&family=Noto+Sans+TC:wght@300;400&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
