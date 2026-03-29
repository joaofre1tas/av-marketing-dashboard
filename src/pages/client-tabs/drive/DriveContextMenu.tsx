import { ReactNode } from 'react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from '@/components/ui/context-menu'
import { Edit2, FolderInput, Copy, Trash2, Pin, Home, Folder } from 'lucide-react'
import { DriveItem } from './types'
import { useDrive } from './DriveContext'

interface Props {
  children: ReactNode
  item: DriveItem
}

export function DriveContextMenu({ children, item }: Props) {
  const { items, renameItem, deleteItem, togglePin, duplicateItem, moveItem } = useDrive()

  const folders = items.filter(
    (i) => i.type === 'folder' && i.id !== item.id && i.id !== item.parentId,
  )

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-56 border-border bg-popover shadow-md">
        <ContextMenuItem onClick={() => togglePin(item.id)}>
          <Pin className="mr-2 h-4 w-4 text-muted-foreground" />{' '}
          {item.isPinned ? 'Desafixar' : 'Fixar no topo'}
        </ContextMenuItem>
        <ContextMenuSeparator className="bg-border" />
        <ContextMenuItem
          onClick={() => {
            const newName = prompt('Novo nome:', item.name)
            if (newName) renameItem(item.id, newName)
          }}
        >
          <Edit2 className="mr-2 h-4 w-4 text-muted-foreground" /> Renomear
        </ContextMenuItem>
        <ContextMenuItem onClick={() => duplicateItem(item.id)}>
          <Copy className="mr-2 h-4 w-4 text-muted-foreground" /> Duplicar
        </ContextMenuItem>

        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <FolderInput className="mr-2 h-4 w-4 text-muted-foreground" /> Mover para...
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="border-border w-48 bg-popover">
            {item.parentId !== null && (
              <ContextMenuItem onClick={() => moveItem(item.id, null)}>
                <Home className="mr-2 h-4 w-4 text-muted-foreground" /> Drive Raiz
              </ContextMenuItem>
            )}
            {folders.map((folder) => (
              <ContextMenuItem key={folder.id} onClick={() => moveItem(item.id, folder.id)}>
                <Folder className="mr-2 h-4 w-4 text-muted-foreground" /> {folder.name}
              </ContextMenuItem>
            ))}
            {folders.length === 0 && item.parentId === null && (
              <ContextMenuItem disabled>Nenhuma outra pasta</ContextMenuItem>
            )}
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator className="bg-border" />
        <ContextMenuItem
          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
          onClick={() => {
            if (confirm(`Tem certeza que deseja excluir "${item.name}"?`)) {
              deleteItem(item.id)
            }
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" /> Excluir
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
