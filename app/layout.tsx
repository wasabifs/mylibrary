import type { Metadata, Viewport } from 'next'
import NavActive from '@/components/NavActive'
import './globals.css'

export const metadata: Metadata = {
  title: 'MyLibrary',
  description: '我的閱讀紀錄',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
      <body>
        <NavActive />
        <div className="app-shell">{children}</div>
        <nav className="bottom-nav">
          <a href="/library" className="nav-item">
            <span className="nav-icon">⊞</span>
            <span className="nav-label">圖書館</span>
          </a>
          <a href="/reading" className="nav-item">
            <span className="nav-icon">◎</span>
            <span className="nav-label">閱讀中</span>
          </a>
          <a href="/" className="nav-item">
            <span className="nav-icon">❝</span>
            <span className="nav-label">節錄</span>
          </a>
        </nav>
      </body>
    </html>
  )
}
