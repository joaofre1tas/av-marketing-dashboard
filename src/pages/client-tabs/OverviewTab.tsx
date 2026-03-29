import { useState } from 'react'
import { Upload, Download, Clock, Instagram, Youtube, Linkedin } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/hooks/use-toast'

export default function OverviewTab() {
  const { toast } = useToast()
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      toast({
        title: 'Arquivo Enviado',
        description: `${file.name} foi adicionado ao repositório.`,
      })
    }
  }

  const handleSaveGuidelines = () => {
    toast({ title: 'Sucesso', description: 'Diretrizes da marca atualizadas.' })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold font-sans mb-6 text-foreground">
            Diretrizes da Marca
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Cores da Marca (HEX)</Label>
              <Input placeholder="#121212, #FF4A4A" className="bg-background border-border" />
            </div>
            <div className="space-y-2">
              <Label>Tipografia (.ttf, .otf)</Label>
              <Input type="file" accept=".ttf,.otf" className="bg-background border-border" />
            </div>
            <div className="col-span-1 md:col-span-2 space-y-2">
              <Label>Logotipo (.pdf, .png, .svg)</Label>
              <Input type="file" accept=".pdf,.png,.svg" className="bg-background border-border" />
            </div>
            <div className="col-span-1 md:col-span-2 space-y-2">
              <Label>Voz e Tom</Label>
              <Textarea
                placeholder="Insira as diretrizes de comunicação, palavras a evitar, personalidade da marca..."
                className="min-h-[120px] bg-background border-border"
              />
            </div>
            <div className="col-span-1 md:col-span-2 flex justify-end mt-2">
              <button className="btn-av" onClick={handleSaveGuidelines}>
                Salvar Diretrizes
              </button>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold font-sans mb-6 text-foreground">Redes Sociais</h3>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex items-center gap-2 w-32 shrink-0">
                <Instagram className="h-5 w-5 text-muted-foreground" />
                <Label>Instagram</Label>
              </div>
              <Input placeholder="@handle" className="w-full sm:w-1/3 bg-background" />
              <Input placeholder="URL do Perfil" className="w-full sm:w-2/3 bg-background" />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex items-center gap-2 w-32 shrink-0">
                <Youtube className="h-5 w-5 text-muted-foreground" />
                <Label>YouTube</Label>
              </div>
              <Input placeholder="@handle" className="w-full sm:w-1/3 bg-background" />
              <Input placeholder="URL do Canal" className="w-full sm:w-2/3 bg-background" />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex items-center gap-2 w-32 shrink-0">
                <Linkedin className="h-5 w-5 text-muted-foreground" />
                <Label>LinkedIn</Label>
              </div>
              <Input placeholder="@handle" className="w-full sm:w-1/3 bg-background" />
              <Input placeholder="URL da Company Page" className="w-full sm:w-2/3 bg-background" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold font-sans mb-6 text-foreground">Repositório</h3>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center bg-background/50 hover:bg-background transition-colors">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <Label htmlFor="file-upload" className="cursor-pointer text-sm font-medium">
                Clique para enviar arquivos
                <span className="block text-xs text-muted-foreground mt-1">
                  Suporta .skill e outros formatos
                </span>
              </Label>
              <Input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".skill,*/*"
                onChange={handleFileUpload}
              />
            </div>

            {uploadedFile && (
              <div className="flex items-center justify-between p-3 rounded-md bg-background border border-border">
                <span className="text-sm truncate mr-2 text-foreground">{uploadedFile.name}</span>
                <Button variant="ghost" size="icon" className="shrink-0 text-primary">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold font-sans mb-6 text-foreground">
            Registro de Atividades
          </h3>
          <ScrollArea className="h-[280px] pr-4">
            <div className="space-y-6">
              {[
                { action: 'Atualizou as cores da marca', time: 'Há 2 horas', user: 'Pedro' },
                { action: 'Upload do arquivo logo-v2.skill', time: 'Ontem', user: 'Ana' },
                { action: 'Conectou o perfil do Instagram', time: '12 Nov', user: 'Pedro' },
                { action: 'Criou o perfil do cliente', time: '10 Nov', user: 'Sistema' },
              ].map((log, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-0.5">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground">{log.action}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{log.time}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{log.user}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
