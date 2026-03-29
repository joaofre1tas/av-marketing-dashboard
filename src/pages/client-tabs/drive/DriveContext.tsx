import { createContext, useContext, useState, ReactNode } from 'react'
import { DriveItem } from './types'

interface DriveContextType {
  items: DriveItem[]
  currentFolderId: string | null
  viewMode: 'grid' | 'list'
  searchQuery: string
  setItems: (items: DriveItem[] | ((prev: DriveItem[]) => DriveItem[])) => void
  setCurrentFolderId: (id: string | null) => void
  setViewMode: (mode: 'grid' | 'list') => void
  setSearchQuery: (query: string) => void
  createFolder: (name: string) => void
  createFile: (name: string, type: DriveItem['type']) => void
  renameItem: (id: string, newName: string) => void
  deleteItem: (id: string) => void
  togglePin: (id: string) => void
  duplicateItem: (id: string) => void
  moveItem: (id: string, newParentId: string | null) => void
  openDocuments: string[]
  activeDocumentId: string | null
  openDocument: (id: string) => void
  closeDocument: (id: string) => void
  setActiveDocumentId: (id: string | null) => void
}

const initialItems: DriveItem[] = [
  {
    id: '1',
    parentId: null,
    name: 'Campanha Q1 2026',
    type: 'folder',
    lastModified: '2026-03-25',
    createdBy: 'Ana Silva',
    isPinned: true,
  },
  {
    id: '2',
    parentId: null,
    name: 'Identidade Visual',
    type: 'folder',
    lastModified: '2026-03-20',
    createdBy: 'Carlos Souza',
  },
  {
    id: '3',
    parentId: null,
    name: 'Briefing Inicial',
    type: 'document',
    lastModified: '2026-03-15',
    createdBy: 'Ana Silva',
    isPinned: true,
    content:
      '<h1>Briefing Inicial de Campanha</h1><p>Este é o documento de briefing para a campanha do Q1.</p><ul><li>Objetivo: Brand Awareness</li><li>Público: Jovens 18-24</li></ul>',
  },
  {
    id: '4',
    parentId: '1',
    name: 'Banners Redes Sociais',
    type: 'folder',
    lastModified: '2026-03-26',
    createdBy: 'Ana Silva',
  },
  {
    id: '5',
    parentId: '1',
    name: 'copys_q1_aprovadas.pdf',
    type: 'pdf',
    lastModified: '2026-03-27',
    createdBy: 'João Pedro',
    size: '2.4 MB',
  },
  {
    id: '6',
    parentId: '4',
    name: 'post_instagram_v1.png',
    type: 'image',
    lastModified: '2026-03-28',
    createdBy: 'Carlos Souza',
    size: '4.1 MB',
  },
]

export const DriveContext = createContext<DriveContextType | null>(null)

import { DocumentEditor } from './DocumentEditor'

export function DriveProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<DriveItem[]>(initialItems)
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [openDocuments, setOpenDocuments] = useState<string[]>([])
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null)

  const openDocument = (id: string) => {
    if (!openDocuments.includes(id)) {
      setOpenDocuments((prev) => [...prev, id])
    }
    setActiveDocumentId(id)
  }

  const closeDocument = (id: string) => {
    setOpenDocuments((prev) => {
      const next = prev.filter((docId) => docId !== id)
      if (activeDocumentId === id) {
        setActiveDocumentId(next.length > 0 ? next[next.length - 1] : null)
      }
      return next
    })
  }

  const createFolder = (name: string) => {
    const newItem: DriveItem = {
      id: Date.now().toString(),
      parentId: currentFolderId,
      name,
      type: 'folder',
      lastModified: new Date().toISOString().split('T')[0],
      createdBy: 'Você',
    }
    setItems((prev) => [...prev, newItem])
  }

  const createFile = (name: string, type: DriveItem['type']) => {
    const newItem: DriveItem = {
      id: Date.now().toString(),
      parentId: currentFolderId,
      name,
      type,
      lastModified: new Date().toISOString().split('T')[0],
      createdBy: 'Você',
      size: type === 'document' ? '-' : '1.2 MB',
      content: type === 'document' ? '<h1>Novo Documento</h1><p><br></p>' : undefined,
    }
    setItems((prev) => [...prev, newItem])
    if (type === 'document') {
      openDocument(newItem.id)
    }
  }

  const renameItem = (id: string, newName: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, name: newName } : item)))
  }

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id && item.parentId !== id))
  }

  const togglePin = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isPinned: !item.isPinned } : item)),
    )
  }

  const duplicateItem = (id: string) => {
    const itemToDuplicate = items.find((i) => i.id === id)
    if (itemToDuplicate) {
      const newItem = {
        ...itemToDuplicate,
        id: Date.now().toString(),
        name: `${itemToDuplicate.name} (Cópia)`,
      }
      setItems((prev) => [...prev, newItem])
    }
  }

  const moveItem = (id: string, newParentId: string | null) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, parentId: newParentId } : item)),
    )
  }

  return (
    <DriveContext.Provider
      value={{
        items,
        currentFolderId,
        viewMode,
        searchQuery,
        setItems,
        setCurrentFolderId,
        setViewMode,
        setSearchQuery,
        createFolder,
        createFile,
        renameItem,
        deleteItem,
        togglePin,
        duplicateItem,
        moveItem,
        openDocuments,
        activeDocumentId,
        openDocument,
        closeDocument,
        setActiveDocumentId,
      }}
    >
      {children}
      <DocumentEditor />
    </DriveContext.Provider>
  )
}

export function useDrive() {
  const context = useContext(DriveContext)
  if (!context) throw new Error('useDrive must be used within DriveProvider')
  return context
}
