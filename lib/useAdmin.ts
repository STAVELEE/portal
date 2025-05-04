import { useEffect, useState } from 'react'

export default function useAdmin(): boolean {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (typeof document === 'undefined') return

    const cookie = document.cookie
    const match = cookie.match(/ADMIN_SECRET=([^;]+)/)

    // 이 부분에 값이 잘 찍히는지 확인도 가능
    console.log('🔐 쿠키 값:', match?.[1])

    if (match && match[1]) {
      const localSecret = match[1]
      const expectedSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET
      if (localSecret === expectedSecret) {
        setIsAdmin(true)
      }
    }
  }, [])

  return isAdmin
}
