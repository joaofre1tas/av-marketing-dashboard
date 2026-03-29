import { useState, useEffect } from 'react'
import { DriveItem } from '@/pages/client-tabs/drive/types'

export type PostStatus = 'Redação' | 'Revisão' | 'Alteração' | 'Produção'
export type PostFormat = 'Reels' | 'Carrossel' | 'Estático'

export interface PostComment {
  id: string
  author: string
  timestamp: string
  text: string
}

export interface Post {
  id: string
  clientId: string
  documentId: string
  format: PostFormat
  postDate: string
  title: string
  description: string
  status: PostStatus
  caption: string
  comments: PostComment[]
}

export interface Client {
  id: string
  name: string
}

export interface GlobalState {
  clients: Client[]
  posts: Post[]
  driveItems: DriveItem[]
  isNewContentModalOpen: boolean
}

const initialState: GlobalState = {
  clients: [
    { id: '1', name: 'Agência Y' },
    { id: '2', name: 'Tech Start' },
    { id: '3', name: 'Zeta Bank' },
  ],
  posts: [
    {
      id: 'p1',
      clientId: '1',
      documentId: '3',
      format: 'Estático',
      postDate: new Date().toISOString(),
      title: 'Estático | O que é Marketing de Autoridade?',
      description:
        '<p>Marketing de autoridade é essencial para o crescimento sustentável da marca.</p>',
      status: 'Produção',
      caption: 'Aprenda o que é marketing de autoridade e como aplicar no seu negócio. #Marketing',
      comments: [
        {
          id: 'c1',
          author: 'João Silva',
          timestamp: new Date().toISOString(),
          text: 'Ótima copy, o cliente vai adorar!',
        },
      ],
    },
  ],
  driveItems: [
    {
      id: '1',
      parentId: null,
      name: 'Campanha Q1 2026',
      type: 'folder',
      lastModified: '2026-03-25',
      createdBy: 'Ana Silva',
      isPinned: true,
      clientId: '1',
    },
    {
      id: '3',
      parentId: null,
      name: 'Calendário Editorial | Agência Y | 2026-03',
      type: 'document',
      lastModified: '2026-03-15',
      createdBy: 'Ana Silva',
      isPinned: true,
      content:
        '<h1>Calendário Editorial Q1</h1><p>Documento para estruturação das postagens do primeiro trimestre.</p>',
      clientId: '1',
    },
  ],
  isNewContentModalOpen: false,
}

let state = initialState
const listeners = new Set<() => void>()

export default function useMainStore() {
  const [snapshot, setSnapshot] = useState(state)

  useEffect(() => {
    const l = () => setSnapshot(state)
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  }, [])

  const notify = () => listeners.forEach((l) => l())

  return {
    ...snapshot,
    setNewContentModalOpen: (open: boolean) => {
      state = { ...state, isNewContentModalOpen: open }
      notify()
    },
    addPost: (post: Post) => {
      state = { ...state, posts: [...state.posts, post] }
      notify()
    },
    updatePostStatus: (id: string, status: PostStatus) => {
      state = { ...state, posts: state.posts.map((p) => (p.id === id ? { ...p, status } : p)) }
      notify()
    },
    addComment: (postId: string, comment: PostComment) => {
      state = {
        ...state,
        posts: state.posts.map((p) =>
          p.id === postId ? { ...p, comments: [...p.comments, comment] } : p,
        ),
      }
      notify()
    },
    addDriveItem: (item: DriveItem) => {
      state = { ...state, driveItems: [...state.driveItems, item] }
      notify()
    },
    updateDriveItem: (id: string, updates: Partial<DriveItem>) => {
      state = {
        ...state,
        driveItems: state.driveItems.map((i) => (i.id === id ? { ...i, ...updates } : i)),
      }
      notify()
    },
    deleteDriveItem: (id: string) => {
      state = {
        ...state,
        driveItems: state.driveItems.filter((i) => i.id !== id && i.parentId !== id),
      }
      notify()
    },
  }
}
