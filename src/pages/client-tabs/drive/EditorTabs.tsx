import { useDrive } from './DriveContext'
import { FileText, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function EditorTabs() {
  const { openDocuments, activeDocumentId, setActiveDocumentId, closeDocument, items } = useDrive()

  return (
    <div className="flex bg-[#0a0a0a] border-b border-[#171717] overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {openDocuments.map((id) => {
        const doc = items.find((i) => i.id === id)
        if (!doc) return null
        const isActive = activeDocumentId === id

        return (
          <div
            key={id}
            onClick={() => setActiveDocumentId(id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 min-w-[150px] max-w-[200px] border-r border-[#171717] cursor-pointer group transition-colors',
              isActive
                ? 'bg-[#121212] text-foreground'
                : 'bg-[#0a0a0a] text-muted-foreground hover:bg-[#121212]/50',
            )}
          >
            <FileText className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm truncate flex-1">{doc.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                closeDocument(id)
              }}
              className="opacity-0 group-hover:opacity-100 p-0.5 rounded-sm hover:bg-[#171717] transition-all"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
