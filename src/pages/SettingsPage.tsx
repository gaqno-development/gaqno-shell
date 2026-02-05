import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@gaqno-development/frontcore/components/ui'
import { Avatar, AvatarFallback, AvatarImage } from '@gaqno-development/frontcore/components/ui'
import { ModelSelect } from '@gaqno-development/frontcore/components/model-select'
import { useLocalStorage, AI_MODEL_PREFERENCES_KEY } from '@gaqno-development/frontcore/hooks'
import { User, Settings as SettingsIcon, Shield, Sparkles } from 'lucide-react'
import { useSettings } from '../hooks/useSettings'

interface AIModelPreferences {
  text?: { provider?: string; model?: string }
  image?: { provider?: string; model?: string }
}

const defaultPreferences: AIModelPreferences = {
  text: {},
  image: {},
}

export default function SettingsPage() {
  const { profile, loading } = useSettings()
  const [preferences, setPreferences] = useLocalStorage<AIModelPreferences>(
    AI_MODEL_PREFERENCES_KEY,
    defaultPreferences,
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie suas preferências e informações da conta
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <CardTitle>Perfil</CardTitle>
            </div>
            <CardDescription>
              Suas informações pessoais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback>
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{profile?.name}</h3>
                <p className="text-sm text-muted-foreground capitalize">
                  {profile?.role}
                </p>
              </div>
            </div>

            {profile?.department && (
              <div>
                <p className="text-sm font-medium">Departamento</p>
                <p className="text-sm text-muted-foreground">
                  {profile.department}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Segurança</CardTitle>
            </div>
            <CardDescription>
              Configurações de segurança da conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Autenticação</p>
              <p className="text-sm text-muted-foreground">
                Autenticação via Supabase
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <CardTitle>Modelos de IA</CardTitle>
            </div>
            <CardDescription>
              Selecione os modelos padrão para texto e imagem
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm font-medium mb-2">Modelo de texto (chat, livros)</p>
              <ModelSelect
                capability="text"
                providerValue={preferences.text?.provider}
                onProviderChange={(provider) =>
                  setPreferences((p) => ({
                    ...p,
                    text: { ...p.text, provider, model: undefined },
                  }))
                }
                value={preferences.text?.model}
                onValueChange={(model, provider) =>
                  setPreferences((p) => ({
                    ...p,
                    text: { ...p.text, model, provider },
                  }))
                }
                placeholder="Selecione o modelo de texto"
              />
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Modelo de imagem</p>
              <ModelSelect
                capability="image"
                providerValue={preferences.image?.provider}
                onProviderChange={(provider) =>
                  setPreferences((p) => ({
                    ...p,
                    image: { ...p.image, provider, model: undefined },
                  }))
                }
                value={preferences.image?.model}
                onValueChange={(model, provider) =>
                  setPreferences((p) => ({
                    ...p,
                    image: { ...p.image, model, provider },
                  }))
                }
                placeholder="Selecione o modelo de imagem"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              <CardTitle>Preferências</CardTitle>
            </div>
            <CardDescription>
              Customize sua experiência
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Tema</p>
              <p className="text-sm text-muted-foreground">
                Sistema (padrão)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

