import { useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
} from 'lucide-react'

export function RichTextEditor({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const exec = (command: string, arg?: string) => {
    document.execCommand(command, false, arg)
    editorRef.current?.focus()
    onChange(editorRef.current?.innerHTML || '')
  }

  return (
    <div className="border border-input rounded-md overflow-hidden bg-background focus-within:ring-1 focus-within:ring-ring transition-shadow">
      <div className="flex flex-wrap items-center gap-1 p-1 border-b border-border bg-muted/30">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => exec('formatBlock', 'H1')}
        >
          <Heading1 className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => exec('formatBlock', 'H2')}
        >
          <Heading2 className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => exec('formatBlock', 'H3')}
        >
          <Heading3 className="h-3.5 w-3.5" />
        </Button>
        <div className="w-[1px] h-4 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => exec('bold')}
        >
          <Bold className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => exec('italic')}
        >
          <Italic className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => exec('underline')}
        >
          <Underline className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => exec('strikeThrough')}
        >
          <Strikethrough className="h-3.5 w-3.5" />
        </Button>
        <div className="w-[1px] h-4 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => exec('insertUnorderedList')}
        >
          <List className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => exec('insertOrderedList')}
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div
        ref={editorRef}
        className="min-h-[120px] p-3 outline-none prose prose-invert max-w-none prose-sm"
        contentEditable
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
      />
    </div>
  )
}
