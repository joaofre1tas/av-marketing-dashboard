import { useState } from 'react'
import { format } from 'date-fns'
import { CalendarIcon, ChevronLeft, Folder as FolderIcon } from 'lucide-react'
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

function FolderBrowser({
  clientId,
  driveItems,
  selectedFolderId,
  onSelectFolder,
  currentNavFolderId,
  setCurrentNavFolderId,
}: {
  clientId: string
  driveItems: any[]
  selectedFolderId: string | null
  onSelectFolder: (id: string | null) => void
  currentNavFolderId: string | null
  setCurrentNavFolderId: (id: string | null) => void
}) {
  const folders = driveItems.filter((i) => i.type === 'folder' && i.clientId === clientId)

  const currentFolders = folders.filter(
    (f) => f.parentId === currentNavFolderId || (!currentNavFolderId && !f.parentId),
  )

  const handleNavigateUp = () => {
    if (!currentNavFolderId) return
    const current = folders.find((f) => f.id === currentNavFolderId)
    setCurrentNavFolderId(current?.parentId || null)
  }

  return (
    <div className="border border-border rounded-md overflow-hidden bg-background">
      <div className="flex items-center gap-2 p-2 bg-muted/50 border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          disabled={!currentNavFolderId}
          onClick={handleNavigateUp}
          type="button"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-xs font-medium">
          {currentNavFolderId
            ? folders.find((f) => f.id === currentNavFolderId)?.name || 'Pasta'
            : 'Raiz do Drive'}
        </span>
      </div>
      <div className="p-2 flex flex-col gap-1 max-h-40 overflow-y-auto">
        {currentFolders.length === 0 && (
          <div className="text-xs text-muted-foreground p-2 text-center">Nenhuma subpasta</div>
        )}
        {currentFolders.map((folder) => (
          <div
            key={folder.id}
            className="flex items-center justify-between p-1 hover:bg-muted/50 rounded group"
          >
            <div
              className="flex items-center gap-2 cursor-pointer flex-1"
              onClick={() => setCurrentNavFolderId(folder.id)}
            >
              <FolderIcon className="h-4 w-4 text-blue-400 fill-blue-400/20" />
              <span className="text-xs">{folder.name}</span>
            </div>
            <Button
              variant={selectedFolderId === folder.id ? 'default' : 'outline'}
              size="sm"
              className={cn(
                'h-6 text-[10px] px-2 opacity-0 group-hover:opacity-100 transition-opacity',
                selectedFolderId === folder.id && 'opacity-100',
              )}
              onClick={() => onSelectFolder(selectedFolderId === folder.id ? null : folder.id)}
              type="button"
            >
              {selectedFolderId === folder.id ? 'Selecionada' : 'Selecionar'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

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
  const [platform, setPlatform] = useState('')
  const [postFormat, setPostFormat] = useState<PostFormat | ''>('')
  const [postDate, setPostDate] = useState<Date>()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<PostStatus>('Decupagem')
  const [caption, setCaption] = useState('')

  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [currentNavFolderId, setCurrentNavFolderId] = useState<string | null>(null)

  const handleOpenChange = (open: boolean) => {
    setNewContentModalOpen(open)
    if (!open) {
      setClientId('')
      setDocumentId('')
      setNewDocName('')
      setPlatform('')
      setPostFormat('')
      setPostDate(undefined)
      setTitle('')
      setDescription('')
      setStatus('Decupagem')
      setCaption('')
      setSelectedFolderId(null)
      setCurrentNavFolderId(null)
    }
  }

  const clientDocs = driveItems.filter(
    (i) => i.type === 'document' && (!clientId || i.clientId === clientId),
  )

  const handleSubmit = () => {
    if (
      !clientId ||
      !documentId ||
      !platform ||
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
        parentId: selectedFolderId || null,
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
      format: postFormat as PostFormat,
      socialMedia: platform,
      postDate: postDate.toISOString(),
      title,
      description,
      status,
      caption,
      comments: [],
    } as any)

    toast({ title: 'Conteúdo Criado', description: 'O post foi salvo com sucesso.' })
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
            <div className="flex flex-col gap-4 p-4 bg-muted/10 border border-border/50 rounded-lg animate-fade-in-down">
              <div className="flex flex-col gap-2">
                <Label>Nome do Novo Documento</Label>
                <Input
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  placeholder="Calendário Editorial | Nome do Cliente | AAAA-MM"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Pasta de Destino (Opcional)</Label>
                <FolderBrowser
                  clientId={clientId}
                  driveItems={driveItems}
                  selectedFolderId={selectedFolderId}
                  onSelectFolder={setSelectedFolderId}
                  currentNavFolderId={currentNavFolderId}
                  setCurrentNavFolderId={setCurrentNavFolderId}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Rede Social</Label>
              <Select
                value={platform}
                onValueChange={(v) => {
                  setPlatform(v)
                  setPostFormat('')
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="YouTube">YouTube</SelectItem>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Formato</Label>
              <Select
                value={postFormat}
                onValueChange={(v) => setPostFormat(v as PostFormat)}
                disabled={!platform}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {platform === 'Instagram' && (
                    <>
                      <SelectItem value="Reels">Reels</SelectItem>
                      <SelectItem value="Estático">Estático</SelectItem>
                      <SelectItem value="Carrossel">Carrossel</SelectItem>
                    </>
                  )}
                  {platform === 'YouTube' && <SelectItem value="Vídeo">Vídeo</SelectItem>}
                  {platform === 'LinkedIn' && (
                    <>
                      <SelectItem value="Artigo">Artigo</SelectItem>
                      <SelectItem value="Post">Post</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Data</Label>
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
                    {postDate ? format(postDate, 'dd/MM/yyyy') : <span>Selecione</span>}
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Reels | Hook da Capa"
            />
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
