import {
  Search,
  Grid,
  List,
  FolderPlus,
  FilePlus,
  ChevronRight,
  Home,
  Upload,
  X,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDrive } from './DriveContext'

export function DriveToolbar() {
  const { searchQuery, setSearchQuery, viewMode, setViewMode, createFolder, createFile } =
    useDrive()

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
      <DriveBreadcrumb />

      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar arquivos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9 bg-card border-border"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center border border-border rounded-md bg-card p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-sm transition-colors ${viewMode === 'grid' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-sm transition-colors ${viewMode === 'list' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="btn-av whitespace-nowrap gap-2 ml-2">
              <FilePlus className="h-4 w-4" /> Novo
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 border-border bg-popover">
            <DropdownMenuItem
              onClick={() => {
                const name = prompt('Nome da pasta:', 'Nova Pasta')
                if (name) createFolder(name)
              }}
            >
              <FolderPlus className="mr-2 h-4 w-4 text-muted-foreground" /> Nova Pasta
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                const name = prompt('Nome do documento:', 'Documento sem título')
                if (name) createFile(name, 'document')
              }}
            >
              <FilePlus className="mr-2 h-4 w-4 text-muted-foreground" /> Documento
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => createFile('imagem_upload.png', 'image')}>
              <Upload className="mr-2 h-4 w-4 text-muted-foreground" /> Upload de Arquivo
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

function DriveBreadcrumb() {
  const { items, currentFolderId, setCurrentFolderId } = useDrive()

  const path = []
  let curr = currentFolderId
  while (curr) {
    const folder = items.find((i) => i.id === curr)
    if (folder) {
      path.unshift(folder)
      curr = folder.parentId
    } else {
      break
    }
  }

  return (
    <div className="flex items-center gap-1.5 text-sm text-muted-foreground overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar font-medium">
      <button
        onClick={() => setCurrentFolderId(null)}
        className="hover:text-foreground flex items-center gap-1.5 transition-colors whitespace-nowrap"
      >
        <Home className="h-4 w-4" /> Meu Drive
      </button>
      {path.map((folder) => (
        <div key={folder.id} className="flex items-center gap-1.5">
          <ChevronRight className="h-4 w-4 opacity-50" />
          <button
            onClick={() => setCurrentFolderId(folder.id)}
            className="hover:text-foreground transition-colors truncate max-w-[150px]"
          >
            {folder.name}
          </button>
        </div>
      ))}
    </div>
  )
}
