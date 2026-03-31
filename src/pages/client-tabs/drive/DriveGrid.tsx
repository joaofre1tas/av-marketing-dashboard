import { useState } from 'react'
import { FileText, Folder, Image as ImageIcon, File } from 'lucide-react'
import { DriveItem } from './types'
import { DriveContextMenu } from './DriveContextMenu'
import { useDrive } from './DriveContext'
import { cn } from '@/lib/utils'

export function DriveGrid({ items }: { items: DriveItem[] }) {
  const {
    setCurrentFolderId,
    openDocument,
    moveItem,
    draggingItemId,
    setDraggingItemId,
    items: allItems,
  } = useDrive()
  const [dragOverId, setDragOverId] = useState<string | null>(null)

  const isDescendant = (childId: string | null, parentId: string) => {
    let current = allItems.find((i) => i.id === childId)
    while (current) {
      if (current.id === parentId) return true
      current = allItems.find((i) => i.id === current?.parentId)
    }
    return false
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {items.map((item) => {
        const isDragging = draggingItemId === item.id
        const isDragOver = dragOverId === item.id

        return (
          <DriveContextMenu key={item.id} item={item}>
            <div
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('application/x-drive-item', item.id)
                e.dataTransfer.effectAllowed = 'move'
                setDraggingItemId(item.id)
              }}
              onDragEnd={() => {
                setDraggingItemId(null)
                setDragOverId(null)
              }}
              onDragOver={(e) => {
                if (e.dataTransfer.types.includes('application/x-drive-item')) {
                  e.stopPropagation()
                  if (
                    item.type !== 'folder' ||
                    item.id === draggingItemId ||
                    (draggingItemId && isDescendant(item.id, draggingItemId))
                  ) {
                    e.dataTransfer.dropEffect = 'none'
                    return
                  }
                  e.preventDefault()
                  e.dataTransfer.dropEffect = 'move'
                  setDragOverId(item.id)
                }
              }}
              onDragLeave={() => setDragOverId(null)}
              onDrop={(e) => {
                if (e.dataTransfer.types.includes('application/x-drive-item')) {
                  e.stopPropagation()
                  setDragOverId(null)
                  const draggedId = e.dataTransfer.getData('application/x-drive-item')
                  if (!draggedId || item.type !== 'folder' || draggedId === item.id) return
                  if (isDescendant(item.id, draggedId)) return

                  e.preventDefault()
                  moveItem(draggedId, item.id)
                }
              }}
              onDoubleClick={() => {
                if (item.type === 'folder') setCurrentFolderId(item.id)
                if (item.type === 'document') openDocument(item.id)
              }}
              className={cn(
                'flex flex-col items-center p-4 bg-card border rounded-lg transition-all cursor-pointer group shadow-sm',
                isDragging
                  ? 'opacity-50 border-dashed border-primary'
                  : 'border-border hover:border-primary/50 hover:shadow-md',
                isDragOver &&
                  item.type === 'folder' &&
                  'border-primary bg-primary/5 ring-2 ring-primary/20',
              )}
            >
              <div
                className={cn(
                  'h-16 w-16 mb-4 flex items-center justify-center rounded-lg transition-colors',
                  isDragging ? 'bg-transparent' : 'bg-secondary/30 group-hover:bg-secondary/60',
                )}
              >
                <ItemIcon
                  type={item.type}
                  className={cn(
                    'h-8 w-8 transition-colors',
                    isDragging
                      ? 'text-primary/50'
                      : 'text-muted-foreground group-hover:text-primary',
                  )}
                />
              </div>
              <span
                className={cn(
                  'text-sm font-medium text-center truncate w-full transition-colors',
                  isDragging ? 'text-primary/50' : 'text-foreground group-hover:text-primary',
                )}
                title={item.name}
              >
                {item.name}
              </span>
              <span className="text-xs text-muted-foreground mt-1.5">
                {item.type === 'folder' ? 'Pasta' : item.size || 'Documento'}
              </span>
            </div>
          </DriveContextMenu>
        )
      })}
    </div>
  )
}

function ItemIcon({ type, className }: { type: string; className?: string }) {
  switch (type) {
    case 'folder':
      return <Folder className={className} />
    case 'image':
      return <ImageIcon className={className} />
    case 'pdf':
      return <FileText className={className} />
    case 'document':
      return <File className={className} />
    default:
      return <File className={className} />
  }
}
