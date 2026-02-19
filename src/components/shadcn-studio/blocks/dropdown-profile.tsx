import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  UserIcon,
  SettingsIcon,
  CreditCardIcon,
  UsersIcon,
  SquarePenIcon,
  CirclePlusIcon,
  LogOutIcon,
  RouteIcon
} from 'lucide-react'
import {
  Avatar,
  AvatarImage,
  AvatarFallback
} from '@gaqno-development/frontcore/components/ui'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@gaqno-development/frontcore/components/ui'
import type { ShellMenuItem } from '@/components/shell-sidebar'

export type ProfileDropdownProfile = {
  name?: string
  avatar_url?: string
  role?: string
}

export type ProfileDropdownUser = {
  email?: string
}

function flattenRoutes(items: ShellMenuItem[]): { label: string; href: string }[] {
  const out: { label: string; href: string }[] = []
  for (const item of items) {
    if (item.href && item.href !== '#') {
      out.push({ label: item.label, href: item.href })
    }
    if (item.children?.length) {
      out.push(...flattenRoutes(item.children))
    }
  }
  return out
}

type Props = {
  trigger: ReactNode
  defaultOpen?: boolean
  align?: 'start' | 'center' | 'end'
  menuItems?: ShellMenuItem[]
  profile?: ProfileDropdownProfile | null
  user?: ProfileDropdownUser | null
  onLogout?: () => void | Promise<void>
}

const ProfileDropdown = ({
  trigger,
  defaultOpen,
  align = 'end',
  menuItems = [],
  profile,
  user,
  onLogout
}: Props) => {
  const location = useLocation()
  const pathname = location.pathname
  const displayName = profile?.name ?? user?.email ?? null
  const displayEmail = user?.email ?? null
  const avatarFallback = displayName
    ? displayName.slice(0, 2).toUpperCase()
    : '?'
  const routes = flattenRoutes(menuItems)

  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className='w-80' align={align || 'end'}>
        <DropdownMenuLabel className='flex items-center gap-4 px-4 py-2.5 font-normal'>
          <div className='relative'>
            <Avatar className='size-10'>
              <AvatarImage
                src={profile?.avatar_url}
                alt={displayName ?? undefined}
              />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
            <span className='ring-card absolute right-0 bottom-0 block size-2 rounded-full bg-green-600 ring-2' />
          </div>
          <div className='flex flex-1 flex-col items-start'>
            <span className='text-foreground text-lg font-semibold'>
              {displayName ?? 'Account'}
            </span>
            {displayEmail && (
              <span className='text-muted-foreground text-base'>
                {displayEmail}
              </span>
            )}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {routes.length > 0 && (
          <>
            <DropdownMenuGroup>
              <DropdownMenuLabel className='text-muted-foreground px-4 py-1.5 text-xs font-medium'>
                Navegação
              </DropdownMenuLabel>
              <div className='max-h-48 overflow-y-auto'>
                {routes.map(({ label, href }, index) => (
                  <DropdownMenuItem key={`${href}-${index}`} asChild>
                    <Link
                      to={href}
                      className='flex items-center gap-2 px-4 py-2.5 text-base'
                    >
                      <RouteIcon className='text-foreground size-5 shrink-0' />
                      <span className={pathname === href || pathname.startsWith(href + '/') ? 'font-medium' : ''}>
                        {label}
                      </span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuGroup>
          <DropdownMenuItem className='px-4 py-2.5 text-base'>
            <UserIcon className='text-foreground size-5' />
            <span>My account</span>
          </DropdownMenuItem>
          <DropdownMenuItem className='px-4 py-2.5 text-base'>
            <SettingsIcon className='text-foreground size-5' />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem className='px-4 py-2.5 text-base'>
            <CreditCardIcon className='text-foreground size-5' />
            <span>Billing</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem className='px-4 py-2.5 text-base'>
            <UsersIcon className='text-foreground size-5' />
            <span>Manage team</span>
          </DropdownMenuItem>
          <DropdownMenuItem className='px-4 py-2.5 text-base'>
            <SquarePenIcon className='text-foreground size-5' />
            <span>Customization</span>
          </DropdownMenuItem>
          <DropdownMenuItem className='px-4 py-2.5 text-base'>
            <CirclePlusIcon className='text-foreground size-5' />
            <span>Add team account</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className='px-4 py-2.5 text-base text-destructive focus:text-destructive'
          onClick={onLogout}
        >
          <LogOutIcon className='size-5' />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProfileDropdown
