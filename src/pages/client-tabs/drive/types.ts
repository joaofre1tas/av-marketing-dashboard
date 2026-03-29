export type DriveItemType = 'folder' | 'image' | 'pdf' | 'document'

export interface DriveItem {
  id: string
  parentId: string | null
  name: string
  type: DriveItemType
  lastModified: string
  createdBy: string
  size?: string
  isPinned?: boolean
  content?: string
}
