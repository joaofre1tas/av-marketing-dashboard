import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  CalendarDays,
  Activity,
  Search,
  Plus,
  Settings,
  LogOut,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

import logoHorizontal from '@/assets/logo-horizontal.svg'
import logoMonogram from '@/assets/logo-monogram.svg'
import useMainStore from '@/stores/main'
import NewContentModal from '@/components/NewContentModal'

const navLinks = [
  { path: '/analise', label: 'Análise', icon: LayoutDashboard },
  { path: '/clientes', label: 'Clientes', icon: Users },
  { path: '/conteudo', label: 'Gerenciador de Conteúdo', icon: FileText },
  { path: '/calendario', label: 'Calendário', icon: CalendarDays },
  { path: '/monitoramento', label: 'Monitoramento', icon: Activity },
]

export default function Layout() {
  const location = useLocation()
  const { toast } = useToast()
  const { setNewContentModalOpen } = useMainStore()

  const handleNewContent = () => {
    setNewContentModalOpen(true)
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="py-6 px-4">
          <img
            src={logoHorizontal}
            alt="O Agência de Valor"
            className="h-8 w-auto object-contain object-left"
          />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {navLinks.map(({ path, label, icon: Icon }) => {
                const isActive = location.pathname === path
                return (
                  <SidebarMenuItem key={path}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        'h-10 transition-colors',
                        isActive &&
                          'relative before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-gradient-av',
                      )}
                    >
                      <Link to={path}>
                        <Icon className="h-4 w-4" />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton size="lg" className="hover:bg-muted/50">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={logoMonogram} alt="User" className="object-cover" />
                      <AvatarFallback>AV</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-0.5 leading-none">
                      <span className="font-semibold text-sm">Pedro Valor</span>
                      <span className="text-xs text-muted-foreground">Admin</span>
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" /> Configurações
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" /> Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="relative flex flex-col h-svh overflow-hidden bg-background">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4 gap-4 bg-background/95 backdrop-blur-md z-20">
          <div className="flex flex-1 items-center gap-4">
            <SidebarTrigger />
            <div className="relative max-w-md w-full hidden sm:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar conteúdo, métricas..."
                className="pl-9 bg-card border-border"
              />
            </div>
          </div>
          <button className="btn-av" onClick={handleNewContent}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Conteúdo
          </button>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-auto relative z-0">
          <Outlet />
        </main>
      </SidebarInset>
      <NewContentModal />
    </SidebarProvider>
  )
}
