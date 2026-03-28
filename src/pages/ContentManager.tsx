import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Edit, Copy, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const contents = [
  {
    id: 1,
    title: 'O que é Marketing de Autoridade?',
    channel: 'Blog',
    status: 'Publicado',
    owner: 'João Silva',
    date: '24 Out, 2023',
  },
  {
    id: 2,
    title: 'Dicas para engajar no Instagram',
    channel: 'Instagram',
    status: 'Agendado',
    owner: 'Maria Clara',
    date: '28 Out, 2023',
  },
  {
    id: 3,
    title: 'Guia de Design System 2024',
    channel: 'LinkedIn',
    status: 'Rascunho',
    owner: 'Pedro Valor',
    date: '02 Nov, 2023',
  },
  {
    id: 4,
    title: 'Case de Sucesso: Agência Y',
    channel: 'Blog',
    status: 'Rascunho',
    owner: 'João Silva',
    date: '05 Nov, 2023',
  },
  {
    id: 5,
    title: 'Reels: Bastidores da Agência',
    channel: 'Instagram',
    status: 'Publicado',
    owner: 'Maria Clara',
    date: '20 Out, 2023',
  },
]

export default function ContentManager() {
  const { toast } = useToast()

  const handleAction = (action: string) => {
    toast({
      title: `Ação Realizada`,
      description: `Comando '${action}' executado com sucesso.`,
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Publicado':
        return (
          <Badge
            variant="outline"
            className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-medium"
          >
            Publicado
          </Badge>
        )
      case 'Agendado':
        return (
          <Badge
            variant="outline"
            className="bg-orange-500/10 text-orange-500 border-orange-500/20 font-medium"
          >
            Agendado
          </Badge>
        )
      case 'Rascunho':
        return (
          <Badge
            variant="outline"
            className="bg-muted/50 text-muted-foreground border-border font-medium"
          >
            Rascunho
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold mb-1">Gerenciador de Conteúdo</h1>
        <p className="text-muted-foreground">Administre e publique os conteúdos da agência.</p>
      </div>

      <Tabs defaultValue="todos" className="w-full">
        <TabsList className="mb-6 bg-card border border-border">
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="rascunhos">Rascunhos</TabsTrigger>
          <TabsTrigger value="agendados">Agendados</TabsTrigger>
          <TabsTrigger value="publicados">Publicados</TabsTrigger>
        </TabsList>

        <TabsContent
          value="todos"
          className="border border-border rounded-xl bg-card overflow-hidden mt-0"
        >
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[40%]">Título</TableHead>
                <TableHead>Canal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contents.map((item) => (
                <TableRow key={item.id} className="group hover:bg-muted/20 transition-colors">
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell className="text-muted-foreground">{item.channel}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-muted-foreground">{item.owner}</TableCell>
                  <TableCell className="text-muted-foreground">{item.date}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:text-primary"
                        onClick={() => handleAction('Editar')}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:text-primary"
                        onClick={() => handleAction('Duplicar')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:text-destructive"
                        onClick={() => handleAction('Excluir')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  )
}
