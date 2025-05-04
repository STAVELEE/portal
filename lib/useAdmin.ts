// lib/useAdmin.ts
import { useEffect, useState } from 'react'
import useAdmin from '../lib/useAdmin'

export default function useAdmin(): boolean {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (typeof document !== 'undefined') {
      setIsAdmin(document.cookie.includes('admin=true'))
    }
  }, [])

  return isAdmin
}
