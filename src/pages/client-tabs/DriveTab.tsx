import { useState, useCallback, useRef, useEffect } from 'react'
import { DriveProvider, useDrive } from './drive/DriveContext'
import { DriveToolbar } from './drive/DriveToolbar'
import { DriveGrid } from './drive/DriveGrid'
import { DriveList } from './drive/DriveList'
import {
  Folder,
  Pin,
  UploadCloud,
  File as FileIcon,
  XCircle,
  CheckCircle2,
  Loader2,
  Search,
} from 'lucide-react'
import { DocumentEditor } from './drive/DocumentEditor'
import { Progress } from '@/components/ui/progress'
import { DriveItemType } from './drive/types'
import { cn } from '@/lib/utils'
import { DriveSearchResults } from './drive/DriveSearchResults'

interface UploadTask {
  id: string
  name: string
  progress: number
  error?: string
}

function UploadPanel({ uploads }: { uploads: UploadTask[] }) {
  if (uploads.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 bg-card border border-border shadow-lg rounded-xl overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-secondary/50 px-4 py-3 border-b border-border flex items-center justify-between">
        <h4 className="text-sm font-semibold flex items-center gap-2 text-foreground">
          <UploadCloud className="h-4 w-4" />
          Enviando {uploads.length} {uploads.length === 1 ? 'arquivo' : 'arquivos'}...
        </h4>
      </div>
      <div className="max-h-60 overflow-y-auto p-2 space-y-2">
        {uploads.map((upload) => (
          <div
            key={upload.id}
            className="p-2 rounded-lg bg-background border border-border flex items-center gap-3"
          >
            <div
              className={cn(
                'h-8 w-8 rounded flex flex-shrink-0 items-center justify-center',
                upload.error ? 'bg-destructive/10' : 'bg-secondary/50',
              )}
            >
              {upload.error ? (
                <XCircle className="h-4 w-4 text-destructive" />
              ) : upload.progress >= 100 ? (
                <CheckCircle2 className="h-4 w-4 text-primary" />
              ) : (
                <FileIcon className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <p className="text-xs font-medium truncate pr-2 text-foreground">{upload.name}</p>
                {upload.error ? (
                  <span className="text-[10px] text-destructive font-medium">Erro</span>
                ) : upload.progress >= 100 ? (
                  <span className="text-[10px] text-primary font-medium">Concluído</span>
                ) : (
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {Math.round(upload.progress)}%
                  </span>
                )}
              </div>
              {upload.error ? (
                <div className="h-1.5 w-full bg-destructive/20 rounded-full overflow-hidden">
                  <div className="h-full bg-destructive w-full" />
                </div>
              ) : upload.progress >= 100 ? (
                <div className="h-1.5 w-full bg-primary/20 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-full animate-in fade-in" />
                </div>
              ) : (
                <Progress value={upload.progress} className="h-1.5" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DriveContent() {
  const { items, currentFolderId, viewMode, searchQuery, activeDocumentId, createFile, moveItem } =
    useDrive()

  const [isDragging, setIsDragging] = useState(false)
  const dragCounter = useRef(0)
  const [uploads, setUploads] = useState<UploadTask[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true)
      const timer = setTimeout(() => setIsSearching(false), 300)
      return () => clearTimeout(timer)
    } else {
      setIsSearching(false)
    }
  }, [searchQuery])

  const onDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current += 1

    // Only show upload overlay if it contains files (external drag)
    if (
      e.dataTransfer.types &&
      e.dataTransfer.types.includes('Files') &&
      !e.dataTransfer.types.includes('application/x-drive-item')
    ) {
      setIsDragging(true)
    }
  }, [])

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current -= 1
    if (dragCounter.current === 0) {
      setIsDragging(false)
    }
  }, [])

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // If dragging an internal item, allow dropping to root
    if (e.dataTransfer.types && e.dataTransfer.types.includes('application/x-drive-item')) {
      e.dataTransfer.dropEffect = 'move'
    }
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      dragCounter.current = 0

      const driveItemId = e.dataTransfer.getData('application/x-drive-item')
      if (driveItemId) {
        // Move to root
        moveItem(driveItemId, null)
        return
      }

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const files = Array.from(e.dataTransfer.files)

        files.forEach((file) => {
          const uploadId = Math.random().toString(36).substring(7)
          setUploads((prev) => [...prev, { id: uploadId, name: file.name, progress: 0 }])

          // Simulate file upload progress
          let currentProgress = 0
          const interval = setInterval(() => {
            currentProgress += Math.random() * 15 + 5

            if (currentProgress >= 100) {
              clearInterval(interval)

              // Artificial failure rate of ~10% to demonstrate error handling
              if (Math.random() > 0.9) {
                setUploads((prev) =>
                  prev.map((u) =>
                    u.id === uploadId
                      ? { ...u, progress: -1, error: 'Falha no envio do arquivo' }
                      : u,
                  ),
                )
                setTimeout(() => {
                  setUploads((current) => current.filter((u) => u.id !== uploadId))
                }, 4000)
                return
              }

              setUploads((prev) => {
                const updated = prev.map((u) => (u.id === uploadId ? { ...u, progress: 100 } : u))
                setTimeout(() => {
                  setUploads((current) => current.filter((u) => u.id !== uploadId))
                }, 2000)
                return updated
              })

              let type: DriveItemType = 'document'
              if (file.type.startsWith('image/')) type = 'image'
              else if (file.type === 'application/pdf') type = 'pdf'

              const formatSize = (bytes: number) => {
                if (bytes < 1024) return bytes + ' B'
                else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
                else return (bytes / 1048576).toFixed(1) + ' MB'
              }

              createFile(file.name, type, formatSize(file.size))
            } else {
              setUploads((prev) =>
                prev.map((u) => (u.id === uploadId ? { ...u, progress: currentProgress } : u)),
              )
            }
          }, 300)
        })
      }
    },
    [createFile, moveItem],
  )

  let currentItems = items.filter((item) => item.parentId === currentFolderId)
  let searchResults: typeof items = []

  if (searchQuery) {
    searchResults = items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }

  const pinnedItems = items.filter((item) => item.isPinned && !searchQuery)

  if (activeDocumentId) {
    return <DocumentEditor />
  }

  return (
    <div
      className={cn(
        'flex flex-col h-full animate-fade-in pb-8 relative rounded-xl transition-colors min-h-[500px]',
        isDragging && 'bg-secondary/10',
      )}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <DriveToolbar />

      {isDragging && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl border-2 border-dashed border-primary m-1 transition-all animate-in fade-in duration-200 shadow-sm">
          <div className="flex flex-col items-center justify-center p-8 text-center pointer-events-none">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-pulse">
              <UploadCloud className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground tracking-tight">
              Solte os arquivos aqui
            </h3>
            <p className="text-muted-foreground mt-2 max-w-sm">
              Eles serão enviados automaticamente para esta pasta do cliente.
            </p>
          </div>
        </div>
      )}

      <UploadPanel uploads={uploads} />

      <div className="flex-1 space-y-10 flex flex-col">
        {pinnedItems.length > 0 && (
          <section>
            <h4 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-foreground mb-4 uppercase">
              <Pin className="h-4 w-4 text-primary" /> Acesso Rápido / Fixados
            </h4>
            {viewMode === 'grid' ? (
              <DriveGrid items={pinnedItems} />
            ) : (
              <DriveList items={pinnedItems} />
            )}
          </section>
        )}

        {searchQuery ? (
          <section className="flex-1 flex flex-col">
            <h4 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-foreground mb-4 uppercase">
              <Search className="h-4 w-4 text-primary" /> Resultados da Busca
            </h4>
            {isSearching ? (
              <div className="flex-1 flex flex-col items-center justify-center py-24 text-center border border-border rounded-lg bg-card/50 min-h-[300px]">
                <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                <p className="text-foreground font-medium">Buscando arquivos...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <DriveSearchResults items={searchResults} />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-border rounded-lg bg-card/50 transition-colors min-h-[300px]">
                <div className="h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-muted-foreground opacity-50" />
                </div>
                <p className="text-foreground font-medium text-lg">
                  Nenhum arquivo encontrado para '{searchQuery}'
                </p>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                  Tente usar termos diferentes ou verifique a ortografia.
                </p>
              </div>
            )}
          </section>
        ) : (
          <section className="flex-1 flex flex-col">
            {pinnedItems.length > 0 && (
              <h4 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-foreground mb-4 uppercase">
                <Folder className="h-4 w-4 text-muted-foreground" /> Todos os Arquivos
              </h4>
            )}

            {currentItems.length > 0 ? (
              viewMode === 'grid' ? (
                <DriveGrid items={currentItems} />
              ) : (
                <DriveList items={currentItems} />
              )
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-border rounded-lg bg-card/50 transition-colors hover:bg-secondary/10 min-h-[300px]">
                <div className="h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
                  <UploadCloud className="h-8 w-8 text-muted-foreground opacity-50" />
                </div>
                <p className="text-foreground font-medium text-lg">Nenhum arquivo encontrado</p>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                  Arraste arquivos para cá ou clique em Novo para adicionar.
                </p>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}

export default function DriveTab() {
  return (
    <DriveProvider>
      <DriveContent />
    </DriveProvider>
  )
}
