import { useParams, Link, Navigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import OverviewTab from './client-tabs/OverviewTab'
import CalendarTab from './client-tabs/CalendarTab'
import DriveTab from './client-tabs/DriveTab'
import useMainStore from '@/stores/main'

export default function ClientDetails() {
  const { id } = useParams()
  const { clients } = useMainStore()

  const client = clients.find((c) => c.id === id)

  if (!client) {
    return <Navigate to="/clientes" replace />
  }

  const logoUrl =
    client.guidelines?.logo ||
    `https://img.usecurling.com/i?q=${client.name.split(' ')[0]}&shape=fill&color=gray`

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 border-b border-[#171717] pb-6">
        <Link
          to="/clientes"
          className="p-2 -ml-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-[#171717]"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <Avatar className="h-10 w-10 border border-[#171717] bg-background">
          <AvatarImage src={logoUrl} className="object-cover p-1.5" />
          <AvatarFallback>{client.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-semibold font-sans text-foreground">{client.name}</h1>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-card border border-[#171717] h-12 w-full justify-start p-1 mb-6 rounded-lg overflow-x-auto">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-background data-[state=active]:text-foreground rounded-md px-6 shrink-0"
          >
            Visão Geral
          </TabsTrigger>
          <TabsTrigger
            value="calendar"
            className="data-[state=active]:bg-background data-[state=active]:text-foreground rounded-md px-6 shrink-0"
          >
            Calendário
          </TabsTrigger>
          <TabsTrigger
            value="drive"
            className="data-[state=active]:bg-background data-[state=active]:text-foreground rounded-md px-6 shrink-0"
          >
            Drive
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="overview" className="m-0">
            <OverviewTab />
          </TabsContent>
          <TabsContent value="calendar" className="m-0">
            <CalendarTab />
          </TabsContent>
          <TabsContent value="drive" className="m-0">
            <DriveTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
