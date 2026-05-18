'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function NavActive() {
  const pathname = usePathname()

  useEffect(() => {
    document.querySelectorAll('.nav-item').forEach(el => {
      const href = el.getAttribute('href') || ''
      // exact match for these routes, prefix match for others
      const exactRoutes = ['/daily', '/stats', '/excerpts', '/reading']
      const isActive = exactRoutes.includes(href)
        ? pathname === href
        : href === '/'
          ? pathname === '/'
          : pathname.startsWith(href)
      el.classList.toggle('active', isActive)
    })
  }, [pathname])

  return null
}
