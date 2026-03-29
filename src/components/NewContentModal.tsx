import { useState } from 'react'
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
import useMainStore, { PostStatus, PostFormat } from '@/stores/main'
import { useToast } from '@/hooks/use-toast'
import { RichTextEditor } from './RichTextEditor'

export default function NewContentModal() {
  const {
    isNewContentModalOpen,
    setNewContentModalOpen,
    clients,
    driveItems,
    addDriveItem,
    addPost,
  } = useMainStore()
  const { toast } = useToast()

  const [clientId, setClientId] = useState('')
  const [documentId, setDocumentId] = useState('')
  const [newDocName, setNewDocName] = useState('')
  const [postFormat, setPostFormat] = useState<PostFormat>('Reels')
  const [postDate, setPostDate] = useState<Date>()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<PostStatus>('Redação')
  const [caption, setCaption] = useState('')

  const handleOpenChange = (open: boolean) => {
    setNewContentModalOpen(open)
    if (!open) {
      setClientId('')
      setDocumentId('')
      setNewDocName('')
      setPostFormat('Reels')
      setPostDate(undefined)
      setTitle('')
      setDescription('')
      setStatus('Redação')
      setCaption('')
    }
  }

  const clientDocs = driveItems.filter(
    (i) => i.type === 'document' && (!clientId || i.clientId === clientId),
  )

  const handleSubmit = () => {
    if (
      !clientId ||
      !documentId ||
      !postFormat ||
      !postDate ||
      !title ||
      !description ||
      !status ||
      !caption
    ) {
      toast({ title: 'Erro', description: 'Preencha todos os campos.', variant: 'destructive' })
      return
    }
    if (documentId === 'new' && !newDocName) {
      toast({
        title: 'Erro',
        description: 'Informe o nome do novo documento.',
        variant: 'destructive',
      })
      return
    }

    let finalDocId = documentId
    if (documentId === 'new') {
      finalDocId = 'doc-' + Date.now()
      addDriveItem({
        id: finalDocId,
        parentId: null,
        name: newDocName,
        type: 'document',
        lastModified: new Date().toISOString().split('T')[0],
        createdBy: 'Você',
        clientId,
        content: `<h1>${newDocName}</h1><p>Documento editorial criado via modal de Novo Conteúdo.</p>`,
      })
    }

    addPost({
      id: 'post-' + Date.now(),
      clientId,
      documentId: finalDocId,
      format: postFormat,
      postDate: postDate.toISOString(),
      title,
      description,
      status,
      caption,
      comments: [],
    })

    toast({ title: 'Conteúdo Criado', description: 'O post foi salvo no documento com sucesso.' })
    handleOpenChange(false)
  }

  return (
    <Dialog open={isNewContentModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-[#121212] border-[#171717] font-sans">
        <DialogHeader>
          <DialogTitle className="text-xl">Novo Conteúdo</DialogTitle>
          <DialogDescription>
            Crie um novo post e vincule a um documento editorial no Drive.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Cliente</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger>
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

            <div className="flex flex-col gap-2">
              <Label>Documento Editorial</Label>
              <Select value={documentId} onValueChange={setDocumentId} disabled={!clientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o documento" />
                </SelectTrigger>
                <SelectContent>
                  {clientDocs.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="new" className="font-semibold text-primary">
                    Criar novo documento...
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {documentId === 'new' && (
            <div className="flex flex-col gap-2 p-4 bg-muted/10 border border-border/50 rounded-lg animate-fade-in-down">
              <Label>Nome do Novo Documento</Label>
              <Input
                value={newDocName}
                onChange={(e) => setNewDocName(e.target.value)}
                placeholder="Calendário Editorial | Nome do Cliente | AAAA-MM"
              />
              <p className="text-[11px] text-muted-foreground">
                O nome do documento deve seguir o formato: Calendário Editorial | Nome do Cliente |
                AAAA-MM
              </p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Formato</Label>
              <Select value={postFormat} onValueChange={(v) => setPostFormat(v as PostFormat)}>
                <SelectTrigger>
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
                      'justify-start text-left font-normal',
                      !postDate && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {postDate ? format(postDate, 'dd/MM/yyyy') : <span>Selecione uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={postDate} onSelect={setPostDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as PostStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Redação">Redação</SelectItem>
                  <SelectItem value="Revisão">Revisão</SelectItem>
                  <SelectItem value="Alteração">Alteração</SelectItem>
                  <SelectItem value="Produção">Produção</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Título do Post</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Reels | Hook da Capa"
            />
            <p className="text-[11px] text-muted-foreground">
              O título deve seguir o formato: Reels | Hook da Capa · Carrossel | Headline do Post ·
              Estático | Headline do Post
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Descrição do Post</Label>
            <RichTextEditor value={description} onChange={setDescription} />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Legenda</Label>
            <Textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Escreva a legenda do post..."
              className="min-h-[120px] resize-y"
            />
          </div>
        </div>

        <DialogFooter className="pt-4 border-t border-border">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Criar Conteúdo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
