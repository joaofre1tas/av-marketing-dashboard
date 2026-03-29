import { DriveProvider, useDrive } from './drive/DriveContext'
import { DriveToolbar } from './drive/DriveToolbar'
import { DriveGrid } from './drive/DriveGrid'
import { DriveList } from './drive/DriveList'
import { Folder, Pin } from 'lucide-react'

function DriveContent() {
  const { items, currentFolderId, viewMode, searchQuery } = useDrive()

  let currentItems = items.filter((item) => item.parentId === currentFolderId)

  if (searchQuery) {
    currentItems = items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }

  const pinnedItems = items.filter((item) => item.isPinned && !searchQuery)

  return (
    <div className="flex flex-col h-full animate-fade-in pb-8">
      <DriveToolbar />

      <div className="flex-1 space-y-10">
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

        <section>
          {pinnedItems.length > 0 && !searchQuery && (
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
            <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-border rounded-lg bg-card/50">
              <div className="h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
                <Folder className="h-8 w-8 text-muted-foreground opacity-50" />
              </div>
              <p className="text-foreground font-medium text-lg">Pasta vazia</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Nenhum arquivo encontrado nesta pasta. Arraste arquivos ou clique em Novo para
                adicionar.
              </p>
            </div>
          )}
        </section>
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
