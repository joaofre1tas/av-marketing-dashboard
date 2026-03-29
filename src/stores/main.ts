import { useState, useEffect } from 'react'
import { DriveItem } from '@/pages/client-tabs/drive/types'

export type PostStatus =
  | 'Decupagem'
  | 'Redação'
  | 'Revisão'
  | 'Alteração'
  | 'Produção'
  | 'Agendamento'
  | 'Postado'
export type PostFormat = 'Reels' | 'Carrossel' | 'Estático' | 'Vídeo' | 'Artigo' | 'Post'

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
  socialMedia?: string
  postDate: string
  title: string
  description: string
  status: PostStatus
  caption: string
  comments: PostComment[]
}

export interface SocialMediaLink {
  platform: string
  url: string
}

export interface BrandGuidelines {
  colors?: string
  fonts?: string
  logo?: string
  voiceAndTone?: string
}

export interface Client {
  id: string
  name: string
  skillFile?: string
  coverImage?: string
  socials: SocialMediaLink[]
  guidelines?: BrandGuidelines
}

export interface GlobalState {
  clients: Client[]
  posts: Post[]
  driveItems: DriveItem[]
  isNewContentModalOpen: boolean
}

const initialState: GlobalState = {
  clients: [
    {
      id: '1',
      name: 'TechCorp Solutions',
      coverImage: 'https://img.usecurling.com/p/400/200?q=technology&color=blue',
      guidelines: {
        logo: 'https://img.usecurling.com/i?q=tech&shape=fill&color=blue',
        colors: '#0A2540, #00D4FF',
      },
      socials: [
        { platform: 'Instagram', url: 'https://instagram.com/techcorp' },
        { platform: 'LinkedIn', url: 'https://linkedin.com/company/techcorp' },
        { platform: 'YouTube', url: 'https://youtube.com/@techcorp' },
      ],
    },
    {
      id: '2',
      name: 'Sabor & Arte',
      coverImage: 'https://img.usecurling.com/p/400/200?q=restaurant&color=orange',
      guidelines: {
        logo: 'https://img.usecurling.com/i?q=food&shape=fill&color=orange',
        colors: '#FF5C00, #171717',
      },
      socials: [
        { platform: 'Instagram', url: 'https://instagram.com/saborearte' },
        { platform: 'YouTube', url: 'https://youtube.com/@saborearte' },
      ],
    },
    {
      id: '3',
      name: 'Financeira Atual',
      coverImage: 'https://img.usecurling.com/p/400/200?q=finance&color=green',
      guidelines: {
        logo: 'https://img.usecurling.com/i?q=finance&shape=fill&color=green',
      },
      socials: [{ platform: 'LinkedIn', url: 'https://linkedin.com/company/financeira' }],
    },
    {
      id: '4',
      name: 'Studio Design',
      coverImage: 'https://img.usecurling.com/p/400/200?q=design&color=purple',
      guidelines: {
        logo: 'https://img.usecurling.com/i?q=design&shape=fill&color=violet',
      },
      socials: [{ platform: 'Instagram', url: 'https://instagram.com/studiodesign' }],
    },
  ],
  posts: [
    {
      id: 'p1',
      clientId: '1',
      documentId: '3',
      format: 'Estático',
      socialMedia: 'Instagram',
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
    addClient: (client: Client) => {
      state = { ...state, clients: [...state.clients, client] }
      notify()
    },
    updateClient: (id: string, updates: Partial<Client>) => {
      state = {
        ...state,
        clients: state.clients.map((c) => (c.id === id ? { ...c, ...updates } : c)),
      }
      notify()
    },
    addPost: (post: Post) => {
      state = { ...state, posts: [...state.posts, post] }
      notify()
    },
    updatePost: (id: string, updates: Partial<Post>) => {
      state = { ...state, posts: state.posts.map((p) => (p.id === id ? { ...p, ...updates } : p)) }
      notify()
    },
    deletePost: (id: string) => {
      state = { ...state, posts: state.posts.filter((p) => p.id !== id) }
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
    deleteClient: (id: string) => {
      state = { ...state, clients: state.clients.filter((c) => c.id !== id) }
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
