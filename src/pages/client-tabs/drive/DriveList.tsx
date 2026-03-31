import { useState } from 'react'
import { FileText, Folder, Image as ImageIcon, File } from 'lucide-react'
import { DriveItem } from './types'
import { DriveContextMenu } from './DriveContextMenu'
import { useDrive } from './DriveContext'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

export function DriveList({ items }: { items: DriveItem[] }) {
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
    <div className="border border-border rounded-lg bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-secondary/20">
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="font-medium text-muted-foreground w-1/2">Nome</TableHead>
            <TableHead className="font-medium text-muted-foreground">Tipo</TableHead>
            <TableHead className="font-medium text-muted-foreground">Tamanho</TableHead>
            <TableHead className="font-medium text-muted-foreground hidden md:table-cell">
              Modificado em
            </TableHead>
            <TableHead className="font-medium text-muted-foreground hidden md:table-cell">
              Criado por
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const isDragging = draggingItemId === item.id
            const isDragOver = dragOverId === item.id

            return (
              <DriveContextMenu key={item.id} item={item}>
                <TableRow
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
                    'border-border cursor-pointer transition-colors group',
                    isDragging ? 'opacity-50' : 'hover:bg-secondary/30',
                    isDragOver && item.type === 'folder' && 'bg-primary/20',
                  )}
                >
                  <TableCell
                    className={cn(
                      'font-medium flex items-center gap-3 transition-colors',
                      isDragging ? 'text-primary/50' : 'text-foreground group-hover:text-primary',
                    )}
                  >
                    <ItemIcon
                      type={item.type}
                      className={cn(
                        'h-5 w-5 transition-colors',
                        isDragging
                          ? 'text-primary/50'
                          : 'text-muted-foreground group-hover:text-primary',
                      )}
                    />
                    {item.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground capitalize">
                    {item.type === 'folder' ? 'Pasta' : item.type}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.size || '-'}</TableCell>
                  <TableCell className="text-muted-foreground hidden md:table-cell">
                    {item.lastModified}
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden md:table-cell">
                    {item.createdBy}
                  </TableCell>
                </TableRow>
              </DriveContextMenu>
            )
          })}
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                Nenhum item encontrado nesta exibição.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
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
