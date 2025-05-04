// lib/useAdmin.ts
import { useEffect, useState } from 'react'

export default function useAdmin(): boolean {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasCookie = document.cookie.includes('admin=true')
      setIsAdmin(hasCookie)
    }
  }, [])

  return isAdmin
}
