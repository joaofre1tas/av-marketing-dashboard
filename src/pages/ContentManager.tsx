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
import useMainStore from '@/stores/main'

export default function ContentManager() {
  const { posts } = useMainStore()
  const { toast } = useToast()

  const handleAction = (action: string) => {
    toast({
      title: `Ação Realizada`,
      description: `Comando '${action}' executado com sucesso.`,
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Produção':
        return (
          <Badge
            variant="outline"
            className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-medium"
          >
            Produção
          </Badge>
        )
      case 'Alteração':
        return (
          <Badge
            variant="outline"
            className="bg-orange-500/10 text-orange-500 border-orange-500/20 font-medium"
          >
            Alteração
          </Badge>
        )
      case 'Revisão':
        return (
          <Badge
            variant="outline"
            className="bg-blue-500/10 text-blue-500 border-blue-500/20 font-medium"
          >
            Revisão
          </Badge>
        )
      default:
        return (
          <Badge
            variant="outline"
            className="bg-muted/50 text-muted-foreground border-border font-medium"
          >
            {status}
          </Badge>
        )
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
              {posts.map((item) => (
                <TableRow key={item.id} className="group hover:bg-muted/20 transition-colors">
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell className="text-muted-foreground">{item.format}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-muted-foreground">Admin</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(item.postDate).toLocaleDateString('pt-BR')}
                  </TableCell>
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
