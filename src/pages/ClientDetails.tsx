import { useParams, Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import OverviewTab from './client-tabs/OverviewTab'
import CalendarTab from './client-tabs/CalendarTab'
import DriveTab from './client-tabs/DriveTab'

export default function ClientDetails() {
  const { id } = useParams()

  // Mocked active client based on ID or default
  const clientName = id === '2' ? 'Sabor & Arte' : 'TechCorp Solutions'
  const logoUrl =
    id === '2'
      ? 'https://img.usecurling.com/i?q=food&shape=fill&color=orange'
      : 'https://img.usecurling.com/i?q=tech&shape=fill&color=blue'

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 border-b border-border pb-6">
        <Link
          to="/clientes"
          className="p-2 -ml-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <Avatar className="h-10 w-10 border border-border bg-background">
          <AvatarImage src={logoUrl} className="object-cover p-1.5" />
          <AvatarFallback>CL</AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-semibold font-sans text-foreground">{clientName}</h1>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-card border border-border h-12 w-full justify-start p-1 mb-6 rounded-lg">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-background data-[state=active]:text-foreground rounded-md px-6"
          >
            Visão Geral
          </TabsTrigger>
          <TabsTrigger
            value="calendar"
            className="data-[state=active]:bg-background data-[state=active]:text-foreground rounded-md px-6"
          >
            Calendário
          </TabsTrigger>
          <TabsTrigger
            value="drive"
            className="data-[state=active]:bg-background data-[state=active]:text-foreground rounded-md px-6"
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
