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
import useMainStore, { Post } from '@/stores/main'
import { EditPostModal } from '@/components/EditPostModal'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'

const STATUS_STYLES: Record<string, string> = {
  Decupagem: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  Redação: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  Revisão: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  Alteração: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  Produção: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  Agendamento: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  Postado: 'bg-green-600/10 text-green-500 border-green-600/20',
}

export default function ContentManager() {
  const { posts, clients, addPost, deletePost } = useMainStore()
  const { toast } = useToast()

  const [statusFilter, setStatusFilter] = useState('Todos')
  const [clientFilter, setClientFilter] = useState('Todos')

  const [editModalOpen, setEditModalOpen] = useState(false)
  const [postToEdit, setPostToEdit] = useState<Post | null>(null)

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<Post | null>(null)

  const handleDuplicate = (post: Post) => {
    addPost({
      ...post,
      id: 'post-' + Date.now(),
      title: `${post.title} (Cópia)`,
      comments: [],
    })
    toast({ title: 'Conteúdo Duplicado', description: 'O post foi duplicado com sucesso.' })
  }

  const handleDeleteConfirm = () => {
    if (postToDelete) {
      deletePost(postToDelete.id)
      toast({ title: 'Conteúdo Excluído', description: 'O post foi removido com sucesso.' })
      setDeleteModalOpen(false)
      setPostToDelete(null)
    }
  }

  const filteredPosts = posts.filter((item) => {
    const matchStatus = statusFilter === 'Todos' || item.status === statusFilter
    const matchClient = clientFilter === 'Todos' || item.clientId === clientFilter
    return matchStatus && matchClient
  })

  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-semibold mb-1">Gerenciador de Conteúdo</h1>
          <p className="text-muted-foreground">Administre e publique os conteúdos da agência.</p>
        </div>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4">
          <Select value={clientFilter} onValueChange={setClientFilter}>
            <SelectTrigger className="bg-card border-[#171717] w-full sm:w-56">
              <SelectValue placeholder="Filtrar por cliente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos os clientes</SelectItem>
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-card border-[#171717] w-full sm:w-56">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos os status</SelectItem>
              {Object.keys(STATUS_STYLES).map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border border-[#171717] rounded-xl bg-card overflow-hidden mt-0">
        <Table className="[&_tr]:border-b-[#171717]">
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[35%]">Título</TableHead>
              <TableHead>Canal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPosts.map((item) => (
              <TableRow key={item.id} className="group hover:bg-muted/20 transition-colors">
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell className="text-muted-foreground">{item.format}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      'font-medium',
                      STATUS_STYLES[item.status] ||
                        'bg-muted/50 text-muted-foreground border-border',
                    )}
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {clients.find((c) => c.id === item.clientId)?.name || 'Desconhecido'}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(item.postDate).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:text-primary"
                      onClick={() => {
                        setPostToEdit(item)
                        setEditModalOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:text-primary"
                      onClick={() => handleDuplicate(item)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:text-destructive"
                      onClick={() => {
                        setPostToDelete(item)
                        setDeleteModalOpen(true)
                      }}
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

      <EditPostModal post={postToEdit} open={editModalOpen} onOpenChange={setEditModalOpen} />

      <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <AlertDialogContent className="bg-[#121212] border-[#171717]">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir conteúdo?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este post? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="border-t border-[#171717] pt-4 mt-4">
            <AlertDialogCancel className="border-[#171717]">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteConfirm}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
