import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import useMainStore, { PostStatus, PostFormat, Post } from '@/stores/main'
import { useToast } from '@/hooks/use-toast'
import { RichTextEditor } from './RichTextEditor'

interface EditPostModalProps {
  post: Post | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditPostModal({ post, open, onOpenChange }: EditPostModalProps) {
  const { clients, updatePost } = useMainStore()
  const { toast } = useToast()

  const [clientId, setClientId] = useState('')
  const [postFormat, setPostFormat] = useState<PostFormat>('Reels')
  const [postDate, setPostDate] = useState<Date>()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<PostStatus>('Decupagem')
  const [caption, setCaption] = useState('')

  useEffect(() => {
    if (post && open) {
      setClientId(post.clientId)
      setPostFormat(post.format)
      setPostDate(new Date(post.postDate))
      setTitle(post.title)
      setDescription(post.description)
      setStatus(post.status)
      setCaption(post.caption)
    }
  }, [post, open])

  const handleSubmit = () => {
    if (!post) return
    if (!clientId || !postFormat || !postDate || !title || !description || !status || !caption) {
      toast({ title: 'Erro', description: 'Preencha todos os campos.', variant: 'destructive' })
      return
    }

    updatePost(post.id, {
      clientId,
      format: postFormat,
      postDate: postDate.toISOString(),
      title,
      description,
      status,
      caption,
    })

    toast({ title: 'Sucesso', description: 'Post atualizado com sucesso.' })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-[#121212] border-[#171717] font-sans">
        <DialogHeader>
          <DialogTitle className="text-xl">Editar Conteúdo</DialogTitle>
          <DialogDescription>Atualize as informações do post.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="flex flex-col gap-2">
            <Label>Cliente</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger className="border-[#171717]">
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Formato</Label>
              <Select value={postFormat} onValueChange={(v) => setPostFormat(v as PostFormat)}>
                <SelectTrigger className="border-[#171717]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Reels">Reels</SelectItem>
                  <SelectItem value="Carrossel">Carrossel</SelectItem>
                  <SelectItem value="Estático">Estático</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Data de Postagem</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'justify-start text-left font-normal border-[#171717]',
                      !postDate && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {postDate ? format(postDate, 'dd/MM/yyyy') : <span>Selecione uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-[#171717]" align="start">
                  <Calendar mode="single" selected={postDate} onSelect={setPostDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as PostStatus)}>
                <SelectTrigger className="border-[#171717]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
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

          <div className="flex flex-col gap-2">
            <Label>Título do Post</Label>
            <Input
              className="border-[#171717]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Reels | Hook da Capa"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Descrição do Post</Label>
            <RichTextEditor value={description} onChange={setDescription} />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Legenda</Label>
            <Textarea
              className="border-[#171717] min-h-[120px] resize-y"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Escreva a legenda do post..."
            />
          </div>
        </div>

        <DialogFooter className="pt-4 border-t border-[#171717]">
          <Button
            variant="outline"
            className="border-[#171717]"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
