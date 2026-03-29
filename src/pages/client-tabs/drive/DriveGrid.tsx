import { FileText, Folder, Image as ImageIcon, File } from 'lucide-react'
import { DriveItem } from './types'
import { DriveContextMenu } from './DriveContextMenu'
import { useDrive } from './DriveContext'

export function DriveGrid({ items }: { items: DriveItem[] }) {
  const { setCurrentFolderId } = useDrive()

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {items.map((item) => (
        <DriveContextMenu key={item.id} item={item}>
          <div
            onDoubleClick={() => item.type === 'folder' && setCurrentFolderId(item.id)}
            className="flex flex-col items-center p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-all cursor-pointer group shadow-sm hover:shadow-md"
          >
            <div className="h-16 w-16 mb-4 flex items-center justify-center rounded-lg bg-secondary/30 group-hover:bg-secondary/60 transition-colors">
              <ItemIcon
                type={item.type}
                className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors"
              />
            </div>
            <span
              className="text-sm font-medium text-center truncate w-full text-foreground group-hover:text-primary transition-colors"
              title={item.name}
            >
              {item.name}
            </span>
            <span className="text-xs text-muted-foreground mt-1.5">
              {item.type === 'folder' ? 'Pasta' : item.size || 'Documento'}
            </span>
          </div>
        </DriveContextMenu>
      ))}
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
