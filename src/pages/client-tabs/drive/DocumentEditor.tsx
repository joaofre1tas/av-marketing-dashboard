import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { useDrive } from './DriveContext'
import { EditorTabs } from './EditorTabs'
import { EditorToolbar } from './EditorToolbar'
import { VersionHistory } from './VersionHistory'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { History, Download, Check, Save } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function DocumentEditor() {
  const { activeDocumentId, items, renameItem, setItems } = useDrive()
  const [showHistory, setShowHistory] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [bounds, setBounds] = useState<{
    top: number
    left: number
    right: number
    bottom: number
  } | null>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const activeDoc = items.find((i) => i.id === activeDocumentId)

  useLayoutEffect(() => {
    if (!activeDocumentId) return

    const mainEl = document.querySelector('main')
    if (!mainEl) {
      setBounds({ top: 64, left: 256, right: 0, bottom: 0 })
      return
    }

    const originalOverflow = mainEl.style.overflow

    const updateBounds = () => {
      const rect = mainEl.getBoundingClientRect()
      setBounds({
        top: rect.top,
        left: rect.left,
        right: document.documentElement.clientWidth - rect.right,
        bottom: document.documentElement.clientHeight - rect.bottom,
      })
    }

    updateBounds()
    mainEl.style.overflow = 'hidden'

    const observer = new ResizeObserver(updateBounds)
    observer.observe(mainEl)

    return () => {
      observer.disconnect()
      mainEl.style.overflow = originalOverflow
    }
  }, [activeDocumentId])

  useEffect(() => {
    if (editorRef.current && activeDoc) {
      if (editorRef.current.innerHTML !== (activeDoc.content || '')) {
        editorRef.current.innerHTML = activeDoc.content || '<p><br></p>'
      }
    }
  }, [activeDocumentId])

  const handleInput = () => {
    setIsSaving(true)
    const content = editorRef.current?.innerHTML || ''

    const timeout = setTimeout(() => {
      setItems((prev) =>
        prev.map((item) => (item.id === activeDocumentId ? { ...item, content } : item)),
      )
      setIsSaving(false)
    }, 1000)

    return () => clearTimeout(timeout)
  }

  const handleExportPDF = () => {
    toast({ title: 'Exportando PDF', description: 'O download começará em breve.' })
  }

  const handleExportDocx = () => {
    toast({ title: 'Exportando DOCX', description: 'O download começará em breve.' })
  }

  if (!activeDocumentId || !activeDoc || !bounds) return null

  return (
    <div
      className="fixed z-50 bg-[#121212] flex flex-col font-sans animate-fade-in text-foreground overflow-hidden"
      style={{
        top: `${bounds.top}px`,
        left: `${bounds.left}px`,
        right: `${bounds.right}px`,
        bottom: `${bounds.bottom}px`,
      }}
    >
      <EditorTabs />

      <div className="flex items-center justify-between px-4 py-2 border-b border-[#171717] bg-background">
        <div className="flex items-center gap-4 flex-1">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#" onClick={(e) => e.preventDefault()}>
                  Drive
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  <Input
                    value={activeDoc.name}
                    onChange={(e) => renameItem(activeDoc.id, e.target.value)}
                    className="h-7 w-64 bg-transparent border-transparent hover:border-[#171717] focus:border-primary focus-visible:ring-0 px-1 font-medium"
                  />
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          {isSaving ? (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Save className="w-3 h-3 animate-pulse" /> Salvando...
            </span>
          ) : (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Check className="w-3 h-3" /> Salvo
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowHistory(!showHistory)}>
            <History className="w-4 h-4 mr-2" /> Histórico
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <Download className="w-4 h-4 mr-2" /> PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportDocx}>
            <Download className="w-4 h-4 mr-2" /> DOCX
          </Button>
        </div>
      </div>

      <EditorToolbar />

      <div className="flex-1 overflow-hidden flex relative bg-[#0a0a0a]">
        <div className="flex-1 overflow-auto p-8 flex justify-center pb-32">
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            className="w-full max-w-[850px] min-h-[1056px] bg-[#121212] border border-[#171717] shadow-lg p-12 outline-none prose prose-invert max-w-none focus:ring-1 focus:ring-primary transition-shadow rounded-sm"
            style={{ fontFamily: 'Figtree, sans-serif' }}
          />
        </div>
        {showHistory && <VersionHistory onClose={() => setShowHistory(false)} />}
      </div>
    </div>
  )
}
