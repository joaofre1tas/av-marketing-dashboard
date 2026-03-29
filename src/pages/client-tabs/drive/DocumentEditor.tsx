import { useState, useEffect, useRef } from 'react'
import { useDrive } from './DriveContext'
import { EditorTabs } from './EditorTabs'
import { EditorToolbar } from './EditorToolbar'
import { VersionHistory } from './VersionHistory'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { History, Download, Check, Save, MessageSquare } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import useMainStore, { Post, PostStatus } from '@/stores/main'

function PostSection({ post }: { post: Post }) {
  const { updatePostStatus, addComment } = useMainStore()
  const [commentText, setCommentText] = useState('')

  const handleStatusChange = (val: string) => updatePostStatus(post.id, val as PostStatus)
  const handleAddComment = () => {
    if (!commentText.trim()) return
    addComment(post.id, {
      id: Date.now().toString(),
      author: 'Pedro Valor',
      timestamp: new Date().toISOString(),
      text: commentText,
    })
    setCommentText('')
  }

  return (
    <div className="border border-border rounded-lg p-6 flex flex-col gap-6 bg-[#0a0a0a] relative group shadow-sm">
      <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-gradient-av rounded-l-lg opacity-80" />
      <div className="flex justify-between items-start pl-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {post.format}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {new Date(post.postDate).toLocaleDateString('pt-BR')}
            </span>
          </div>
          <h2 className="text-xl font-bold font-sans tracking-tight text-foreground">
            {post.title}
          </h2>
        </div>
        <div className="w-40 flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Status do Post</Label>
          <Select value={post.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="h-9 bg-background border-border">
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

      <div className="pl-2">
        <h4 className="text-sm font-semibold mb-2 text-foreground/80 uppercase tracking-wider text-[11px]">
          Descrição Estruturada
        </h4>
        <div
          className="prose prose-invert prose-sm bg-[#121212] p-5 rounded-md border border-border max-w-none shadow-inner"
          dangerouslySetInnerHTML={{ __html: post.description }}
        />
      </div>

      <div className="pl-2">
        <h4 className="text-sm font-semibold mb-2 text-foreground/80 uppercase tracking-wider text-[11px]">
          Legenda do Post
        </h4>
        <div className="bg-[#121212] p-5 rounded-md border border-border text-sm whitespace-pre-wrap text-muted-foreground shadow-inner">
          {post.caption}
        </div>
      </div>

      <div className="border-t border-border pt-6 mt-2 pl-2">
        <h4 className="text-sm font-semibold mb-4 flex items-center gap-2 text-foreground/80">
          <MessageSquare className="w-4 h-4 text-primary" /> Discussão
        </h4>
        <div className="flex flex-col gap-4 mb-5">
          {post.comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <Avatar className="w-8 h-8 rounded-md">
                <AvatarFallback className="rounded-md bg-primary/20 text-primary text-xs">
                  {c.author[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col bg-[#121212] p-3.5 rounded-md border border-border flex-1 shadow-sm">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-semibold text-foreground/90">{c.author}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(c.timestamp).toLocaleString('pt-BR')}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.text}</p>
              </div>
            </div>
          ))}
          {post.comments.length === 0 && (
            <p className="text-xs text-muted-foreground italic">
              Nenhum comentário ainda. Inicie a discussão abaixo.
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <Input
            placeholder="Adicione um comentário..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="h-9 text-sm bg-[#121212] border-border"
            onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
          />
          <Button
            size="sm"
            onClick={handleAddComment}
            className="bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Enviar
          </Button>
        </div>
      </div>
    </div>
  )
}

export function DocumentEditor() {
  const { activeDocumentId, renameItem } = useDrive()
  const { driveItems, posts, updateDriveItem } = useMainStore()

  const [showHistory, setShowHistory] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const editorRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const activeDoc = driveItems.find((i) => i.id === activeDocumentId)
  const docPosts = posts
    .filter((p) => p.documentId === activeDocumentId)
    .sort((a, b) => new Date(a.postDate).getTime() - new Date(b.postDate).getTime())

  useEffect(() => {
    if (editorRef.current && activeDoc) {
      if (editorRef.current.innerHTML !== (activeDoc.content || '')) {
        editorRef.current.innerHTML = activeDoc.content || '<p><br></p>'
      }
    }
  }, [activeDocumentId, activeDoc])

  const handleInput = () => {
    setIsSaving(true)
    const content = editorRef.current?.innerHTML || ''

    const timeout = setTimeout(() => {
      if (activeDoc) {
        updateDriveItem(activeDoc.id, { content })
      }
      setIsSaving(false)
    }, 1000)

    return () => clearTimeout(timeout)
  }

  const handleExportPDF = () => {
    toast({ title: 'Exportando PDF', description: 'O download começará em breve.' })
  }

  const handleExportDocx = () => {
    toast({ title: 'Exportando DOCX', description: 'O download começará em breve.' })
  }

  if (!activeDocumentId || !activeDoc) return null

  return (
    <div className="flex flex-col font-sans animate-fade-in text-foreground bg-[#121212] border border-border rounded-lg shadow-sm w-full relative z-0">
      <EditorTabs />

      <div className="sticky top-0 z-10 flex flex-col bg-background rounded-t-lg shadow-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border">
          <div className="flex items-center gap-4 flex-1">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#" onClick={(e) => e.preventDefault()}>
                    Drive
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    <Input
                      value={activeDoc.name}
                      onChange={(e) => renameItem(activeDoc.id, e.target.value)}
                      className="h-7 w-64 bg-transparent border-transparent hover:border-border focus:border-primary focus-visible:ring-0 px-1 font-medium"
                    />
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            {isSaving ? (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Save className="w-3 h-3 animate-pulse" /> Salvando...
              </span>
            ) : (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Check className="w-3 h-3" /> Salvo
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowHistory(!showHistory)}>
              <History className="w-4 h-4 mr-2" /> Histórico
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportPDF}>
              <Download className="w-4 h-4 mr-2" /> PDF
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportDocx}>
              <Download className="w-4 h-4 mr-2" /> DOCX
            </Button>
          </div>
        </div>

        <EditorToolbar />
      </div>

      <div className="flex relative bg-[#0a0a0a] min-h-[800px] rounded-b-lg">
        <div className="flex-1 p-8 flex justify-center pb-32">
          <div className="w-full max-w-[850px] min-h-[1056px] bg-[#121212] border border-border shadow-lg p-12 outline-none flex flex-col gap-10 rounded-sm">
            <div
              ref={editorRef}
              contentEditable
              onInput={handleInput}
              className="prose prose-invert max-w-none focus:outline-none focus:ring-0"
              style={{ fontFamily: 'Figtree, sans-serif' }}
            />

            {docPosts.length > 0 && (
              <div className="flex flex-col gap-8 pt-8 border-t border-border">
                <h3 className="text-lg font-semibold tracking-tight text-muted-foreground flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Postagens Vinculadas ({docPosts.length})
                </h3>
                <div className="flex flex-col gap-12">
                  {docPosts.map((post) => (
                    <PostSection key={post.id} post={post} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {showHistory && <VersionHistory onClose={() => setShowHistory(false)} />}
      </div>
    </div>
  )
}
