import { FolderLock } from 'lucide-react'

export default function DriveTab() {
  return (
    <div className="flex flex-col items-center justify-center py-32 bg-card border border-border rounded-lg shadow-sm">
      <div className="h-20 w-20 rounded-full bg-background border border-border flex items-center justify-center mb-6">
        <FolderLock className="h-10 w-10 text-muted-foreground opacity-60" />
      </div>
      <h3 className="text-2xl font-semibold font-sans text-foreground mb-2">Drive de Arquivos</h3>
      <p className="text-muted-foreground max-w-md text-center">
        O armazenamento em nuvem dedicado para todos os ativos e entregáveis deste cliente estará
        disponível em breve.
      </p>
    </div>
  )
}
