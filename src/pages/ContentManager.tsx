import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Edit, Copy, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import useMainStore from '@/stores/main'

export default function ContentManager() {
  const { posts } = useMainStore()
  const { toast } = useToast()
  const [statusFilter, setStatusFilter] = useState('Todos')

  const handleAction = (action: string) => {
    toast({
      title: `Ação Realizada`,
      description: `Comando '${action}' executado com sucesso.`,
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Decupagem':
        return (
          <Badge
            variant="outline"
            className="bg-purple-500/10 text-purple-500 border-purple-500/20 font-medium"
          >
            Decupagem
          </Badge>
        )
      case 'Redação':
        return (
          <Badge
            variant="outline"
            className="bg-blue-500/10 text-blue-500 border-blue-500/20 font-medium"
          >
            Redação
          </Badge>
        )
      case 'Revisão':
        return (
          <Badge
            variant="outline"
            className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 font-medium"
          >
            Revisão
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
      case 'Produção':
        return (
          <Badge
            variant="outline"
            className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-medium"
          >
            Produção
          </Badge>
        )
      case 'Agendamento':
        return (
          <Badge
            variant="outline"
            className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20 font-medium"
          >
            Agendamento
          </Badge>
        )
      case 'Postado':
        return (
          <Badge
            variant="outline"
            className="bg-green-600/10 text-green-500 border-green-600/20 font-medium"
          >
            Postado
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

  const filteredPosts = posts.filter(
    (item) => statusFilter === 'Todos' || item.status === statusFilter,
  )

  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-semibold mb-1">Gerenciador de Conteúdo</h1>
          <p className="text-muted-foreground">Administre e publique os conteúdos da agência.</p>
        </div>
        <div className="w-full sm:w-64">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-card border-border">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              <SelectItem value="Decupagem">Decupagem</SelectItem>
              <SelectItem value="Redação">Redação</SelectItem>
              <SelectItem value="Revisão">Revisão</SelectItem>
              <SelectItem value="Alteração">Alteração</SelectItem>
              <SelectItem value="Produção">Produção</SelectItem>
              <SelectItem value="Agendamento">Agendamento</SelectItem>
              <SelectItem value="Postado">Postado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border border-border rounded-xl bg-card overflow-hidden mt-0">
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
            {filteredPosts.map((item) => (
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
            {filteredPosts.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  Nenhum conteúdo encontrado para o filtro selecionado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
