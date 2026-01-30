import { useQueryClient } from '@tanstack/react-query'
import { useMe } from '@gaqno-development/frontcore/hooks/auth/useSsoAuth'
import { ssoAxiosClient } from '@gaqno-development/frontcore/utils/api/sso-client'

export interface UpdateProfileInput {
  firstName?: string
  lastName?: string
  phone?: string
  avatar?: string
}

export function useProfile() {
  const queryClient = useQueryClient()
  const { data: session, isLoading, error, refetch } = useMe({ enabled: true })

  const updateProfile = async (input: UpdateProfileInput) => {
    const { data } = await ssoAxiosClient.patch('/me', input)
    queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
    await refetch()
    return data
  }

  return {
    user: session?.user ?? null,
    session,
    isLoading,
    error,
    updateProfile,
    refetch,
  }
}
