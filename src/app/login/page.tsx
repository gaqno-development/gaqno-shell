'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@gaqno-dev/core/utils/supabase/client'

const AUTH_SERVICE_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || process.env.AUTH_SERVICE_URL || 'http://localhost:3001'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          router.push('/dashboard')
          return
        }

        try {
          const response = await fetch(`${AUTH_SERVICE_URL}/login`, {
            method: 'GET',
            headers: {
              'Accept': 'text/html',
            },
            credentials: 'include',
          })

          if (response.ok) {
            const html = await response.text()
            const parser = new DOMParser()
            const doc = parser.parseFromString(html, 'text/html')
            const body = doc.body.innerHTML
            
            const container = document.getElementById('auth-container')
            if (container) {
              container.innerHTML = body
              
              const scripts = doc.querySelectorAll('script')
              scripts.forEach((script) => {
                const newScript = document.createElement('script')
                if (script.src) {
                  newScript.src = script.src.startsWith('http') 
                    ? script.src 
                    : `${AUTH_SERVICE_URL}${script.src}`
                } else {
                  newScript.textContent = script.textContent
                }
                document.head.appendChild(newScript)
              })

              const links = doc.querySelectorAll('link[rel="stylesheet"]')
              links.forEach((link) => {
                const href = link.getAttribute('href')
                if (href && !document.querySelector(`link[href="${href}"]`)) {
                  const newLink = document.createElement('link')
                  newLink.rel = 'stylesheet'
                  newLink.href = href.startsWith('http') 
                    ? href 
                    : `${AUTH_SERVICE_URL}${href}`
                  document.head.appendChild(newLink)
                }
              })
            }
            setLoading(false)
          } else {
            setError('Serviço de autenticação não disponível')
            setLoading(false)
          }
        } catch (fetchError) {
          console.error('Error loading auth service:', fetchError)
          setError('Não foi possível carregar a página de login. Verifique se o serviço de autenticação está disponível.')
          setLoading(false)
        }
      } catch (error) {
        console.error('Auth check error:', error)
        setError('Erro ao verificar autenticação')
        setLoading(false)
      }
    }

    checkAuthAndLoad()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-center">
          <p className="text-muted-foreground">Carregando página de login...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  return <div id="auth-container" />
}

