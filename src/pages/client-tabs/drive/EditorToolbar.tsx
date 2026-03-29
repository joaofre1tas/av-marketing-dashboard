import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Table,
  Image,
  Link,
  Youtube,
  Info,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react'

export function EditorToolbar() {
  const exec = (command: string, value?: string) => {
    document.execCommand(command, false, value)
  }

  const insertHtml = (html: string) => {
    document.execCommand('insertHTML', false, html)
  }

  const addCallout = (type: 'info' | 'warning' | 'tip') => {
    const colors = {
      info: 'border-blue-500 bg-blue-500/10 text-blue-200',
      warning: 'border-yellow-500 bg-yellow-500/10 text-yellow-200',
      tip: 'border-green-500 bg-green-500/10 text-green-200',
    }
    const icons = {
      info: 'ℹ️',
      warning: '⚠️',
      tip: '💡',
    }
    const html = `<div class="p-4 border-l-4 my-4 rounded-r-md ${colors[type]} flex gap-3"><span class="text-xl">${icons[type]}</span><div class="flex-1"><p><strong>${type.toUpperCase()}:</strong> Insira seu texto aqui...</p></div></div><p><br></p>`
    insertHtml(html)
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-[#121212] text-foreground rounded-b-lg">
      <Select onValueChange={(v) => exec('formatBlock', v)}>
        <SelectTrigger className="w-[120px] h-8 bg-transparent border-transparent hover:border-border">
          <SelectValue placeholder="Estilo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="P">Normal</SelectItem>
          <SelectItem value="H1">Título 1</SelectItem>
          <SelectItem value="H2">Título 2</SelectItem>
          <SelectItem value="H3">Título 3</SelectItem>
          <SelectItem value="PRE">Código Block</SelectItem>
        </SelectContent>
      </Select>
      <Separator orientation="vertical" className="h-6 mx-1 bg-border" />

      <ToggleGroup type="multiple" className="justify-start">
        <ToggleGroupItem
          value="bold"
          onClick={() => exec('bold')}
          aria-label="Bold"
          className="h-8 w-8 px-0"
        >
          <Bold className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="italic"
          onClick={() => exec('italic')}
          aria-label="Italic"
          className="h-8 w-8 px-0"
        >
          <Italic className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="underline"
          onClick={() => exec('underline')}
          aria-label="Underline"
          className="h-8 w-8 px-0"
        >
          <Underline className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="strike"
          onClick={() => exec('strikeThrough')}
          aria-label="Strikethrough"
          className="h-8 w-8 px-0"
        >
          <Strikethrough className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="code"
          onClick={() => insertHtml('<code>Código</code>')}
          aria-label="Code"
          className="h-8 w-8 px-0"
        >
          <Code className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
      <Separator orientation="vertical" className="h-6 mx-1 bg-border" />

      <ToggleGroup type="single" className="justify-start">
        <ToggleGroupItem value="left" onClick={() => exec('justifyLeft')} className="h-8 w-8 px-0">
          <AlignLeft className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="center"
          onClick={() => exec('justifyCenter')}
          className="h-8 w-8 px-0"
        >
          <AlignCenter className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="right"
          onClick={() => exec('justifyRight')}
          className="h-8 w-8 px-0"
        >
          <AlignRight className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="justify"
          onClick={() => exec('justifyFull')}
          className="h-8 w-8 px-0"
        >
          <AlignJustify className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
      <Separator orientation="vertical" className="h-6 mx-1 bg-border" />

      <ToggleGroup type="multiple" className="justify-start">
        <ToggleGroupItem
          value="bullet"
          onClick={() => exec('insertUnorderedList')}
          className="h-8 w-8 px-0"
        >
          <List className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="number"
          onClick={() => exec('insertOrderedList')}
          className="h-8 w-8 px-0"
        >
          <ListOrdered className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="check"
          onClick={() =>
            insertHtml(
              '<div class="flex items-center gap-2 my-1"><input type="checkbox" class="w-4 h-4 rounded border-border" /> <span>Item</span></div>',
            )
          }
          className="h-8 w-8 px-0"
        >
          <CheckSquare className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="quote"
          onClick={() => exec('formatBlock', 'BLOCKQUOTE')}
          className="h-8 w-8 px-0"
        >
          <Quote className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
      <Separator orientation="vertical" className="h-6 mx-1 bg-border" />

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          title="Inserir Tabela"
          onClick={() =>
            insertHtml(
              '<table class="w-full border-collapse border border-[#171717] my-4"><tr><td class="border border-[#171717] p-2">Célula 1</td><td class="border border-[#171717] p-2">Célula 2</td></tr><tr><td class="border border-[#171717] p-2">Célula 3</td><td class="border border-[#171717] p-2">Célula 4</td></tr></table><p><br></p>',
            )
          }
        >
          <Table className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          title="Inserir Imagem"
          onClick={() => {
            const url = prompt('URL da Imagem:')
            if (url)
              insertHtml(`<img src="${url}" class="max-w-full rounded-md my-4" /><p><br></p>`)
          }}
        >
          <Image className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          title="Inserir Link"
          onClick={() => {
            const url = prompt('URL do Link:')
            if (url) exec('createLink', url)
          }}
        >
          <Link className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          title="Inserir YouTube"
          onClick={() => {
            const url = prompt('ID do Vídeo YouTube (ex: dQw4w9WgXcQ):')
            if (url)
              insertHtml(
                `<iframe width="560" height="315" src="https://www.youtube.com/embed/${url}" frameborder="0" allowfullscreen class="my-4 rounded-md aspect-video w-full"></iframe><p><br></p>`,
              )
          }}
        >
          <Youtube className="h-4 w-4" />
        </Button>
      </div>
      <Separator orientation="vertical" className="h-6 mx-1 bg-border" />

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-blue-400"
          title="Info Callout"
          onClick={() => addCallout('info')}
        >
          <Info className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-yellow-400"
          title="Warning Callout"
          onClick={() => addCallout('warning')}
        >
          <AlertTriangle className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-green-400"
          title="Tip Callout"
          onClick={() => addCallout('tip')}
        >
          <Lightbulb className="h-4 w-4" />
        </Button>
      </div>
      <Separator orientation="vertical" className="h-6 mx-1 bg-border" />

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs px-2"
          onClick={() => insertHtml('<hr class="my-6 border-[#171717]"/><p><br></p>')}
        >
          Divisor
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs px-2"
          onClick={() =>
            insertHtml(
              '<details class="my-4 border border-[#171717] rounded-md p-4 bg-background/50"><summary class="font-medium cursor-pointer">Seção Retrátil</summary><div class="mt-4"><p>Conteúdo escondido aqui...</p></div></details><p><br></p>',
            )
          }
        >
          Toggle
        </Button>
      </div>
      <Separator orientation="vertical" className="h-6 mx-1 bg-border" />

      <div className="flex items-center gap-2 px-2">
        <input
          type="color"
          className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
          title="Cor do Texto"
          onChange={(e) => exec('foreColor', e.target.value)}
        />
        <input
          type="color"
          className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
          title="Cor de Fundo"
          onChange={(e) => exec('hiliteColor', e.target.value)}
        />
      </div>
    </div>
  )
}
