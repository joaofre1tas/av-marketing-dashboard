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

export function DriveList({ items }: { items: DriveItem[] }) {
  const { setCurrentFolderId, openDocument } = useDrive()

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
          {items.map((item) => (
            <DriveContextMenu key={item.id} item={item}>
              <TableRow
                className="border-border cursor-pointer hover:bg-secondary/30 transition-colors group"
                onDoubleClick={() => {
                  if (item.type === 'folder') setCurrentFolderId(item.id)
                  if (item.type === 'document') openDocument(item.id)
                }}
              >
                <TableCell className="font-medium flex items-center gap-3 text-foreground group-hover:text-primary transition-colors">
                  <ItemIcon
                    type={item.type}
                    className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors"
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
          ))}
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
