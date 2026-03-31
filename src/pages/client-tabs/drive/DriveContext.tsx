import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import { DriveItem } from './types'
import useMainStore from '@/stores/main'

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
  createFile: (name: string, type: DriveItem['type'], size?: string) => void
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

export const DriveContext = createContext<DriveContextType | null>(null)

export function DriveProvider({ children }: { children: ReactNode }) {
  const {
    driveItems,
    addDriveItem,
    updateDriveItem,
    deleteDriveItem: deleteDriveItemGlobal,
  } = useMainStore()

  const { id: clientId } = useParams<{ id: string }>()

  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [openDocuments, setOpenDocuments] = useState<string[]>([])
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null)

  useEffect(() => {
    setCurrentFolderId(null)
    setSearchQuery('')
    setOpenDocuments([])
    setActiveDocumentId(null)
  }, [clientId])

  const items = driveItems.filter((item) => item.clientId === clientId)

  const setItems = () => {}

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
    addDriveItem({
      id: Date.now().toString(),
      parentId: currentFolderId,
      name,
      type: 'folder',
      lastModified: new Date().toISOString().split('T')[0],
      createdBy: 'Você',
      clientId,
    })
  }

  const createFile = (name: string, type: DriveItem['type'], size?: string) => {
    const newItem: DriveItem = {
      id: Date.now().toString() + Math.random().toString().slice(2, 6),
      parentId: currentFolderId,
      name,
      type,
      lastModified: new Date().toISOString().split('T')[0],
      createdBy: 'Você',
      size: size || (type === 'document' ? '-' : '1.2 MB'),
      content: type === 'document' ? '<h1>Novo Documento</h1><p><br></p>' : undefined,
      clientId,
    }
    addDriveItem(newItem)
    if (type === 'document') {
      openDocument(newItem.id)
    }
  }

  const renameItem = (id: string, newName: string) => {
    updateDriveItem(id, { name: newName })
  }

  const deleteItem = (id: string) => {
    deleteDriveItemGlobal(id)
  }

  const togglePin = (id: string) => {
    const item = items.find((i) => i.id === id)
    if (item) updateDriveItem(id, { isPinned: !item.isPinned })
  }

  const duplicateItem = (id: string) => {
    const itemToDuplicate = items.find((i) => i.id === id)
    if (itemToDuplicate) {
      addDriveItem({
        ...itemToDuplicate,
        id: Date.now().toString(),
        name: `${itemToDuplicate.name} (Cópia)`,
        clientId,
      })
    }
  }

  const moveItem = (id: string, newParentId: string | null) => {
    updateDriveItem(id, { parentId: newParentId })
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
    </DriveContext.Provider>
  )
}

export function useDrive() {
  const context = useContext(DriveContext)
  if (!context) throw new Error('useDrive must be used within DriveProvider')
  return context
}
