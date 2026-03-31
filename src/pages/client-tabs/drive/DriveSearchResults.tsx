import { FileText, Folder, Image as ImageIcon, File } from 'lucide-react'
import { DriveItem } from './types'
import { useDrive } from './DriveContext'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function DriveSearchResults({ items }: { items: DriveItem[] }) {
  const { navigateToItem, items: allItems } = useDrive()

  const getItemPath = (item: DriveItem) => {
    const path: string[] = [item.name]
    let current = item.parentId
    while (current) {
      const parent = allItems.find((i) => i.id === current)
      if (parent) {
        path.unshift(parent.name)
        current = parent.parentId
      } else {
        break
      }
    }
    return path.length > 1 ? path.join(' > ') : `Meu Drive > ${item.name}`
  }

  return (
    <div className="border border-border rounded-lg bg-card overflow-hidden shadow-sm animate-in fade-in duration-300">
      <Table>
        <TableHeader className="bg-secondary/20">
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="font-medium text-muted-foreground w-[30%]">Nome</TableHead>
            <TableHead className="font-medium text-muted-foreground w-[30%]">Localização</TableHead>
            <TableHead className="font-medium text-muted-foreground">Tipo</TableHead>
            <TableHead className="font-medium text-muted-foreground hidden md:table-cell">
              Modificado em
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            return (
              <TableRow
                key={item.id}
                onClick={() => navigateToItem(item.id)}
                className="border-border cursor-pointer transition-colors hover:bg-secondary/30 group"
              >
                <TableCell className="font-medium flex items-center gap-3 transition-colors text-foreground group-hover:text-primary">
                  <ItemIcon
                    type={item.type}
                    className="h-5 w-5 flex-shrink-0 transition-colors text-muted-foreground group-hover:text-primary"
                  />
                  <span className="truncate">{item.name}</span>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm truncate max-w-[200px]">
                  {getItemPath(item)}
                </TableCell>
                <TableCell className="text-muted-foreground capitalize">
                  {item.type === 'folder'
                    ? 'Pasta'
                    : item.type === 'document'
                      ? 'Documento'
                      : item.type === 'image'
                        ? 'Imagem'
                        : item.type === 'pdf'
                          ? 'PDF'
                          : item.type}
                </TableCell>
                <TableCell className="text-muted-foreground hidden md:table-cell">
                  {item.lastModified}
                </TableCell>
              </TableRow>
            )
          })}
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
