'use client'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function NavActive() {
  const pathname = usePathname()

  useEffect(() => {
    document.querySelectorAll('.nav-item').forEach(el => {
      const href = el.getAttribute('href') || ''
      const isActive =
        href === '/' ? pathname === '/' :
        pathname.startsWith(href)
      el.classList.toggle('active', isActive)
    })
  }, [pathname])

  return null
}
