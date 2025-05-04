// lib/useAdmin.ts
import { useEffect, useState } from 'react'

export default function useAdmin(): boolean {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const cookie = document.cookie
    const match = cookie.match(/ADMIN_SECRET=([a-zA-Z0-9-_]+)/)
    if (match && match[1] === process.env.NEXT_PUBLIC_ADMIN_SECRET) {
      setIsAdmin(true)
    }
  }, [])

  return isAdmin
}
