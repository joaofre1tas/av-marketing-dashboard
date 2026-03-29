import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  Upload,
  Download,
  Clock,
  Instagram,
  Youtube,
  Linkedin,
  Save,
  Plus,
  Trash2,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import useMainStore, { SocialMediaLink } from '@/stores/main'

export default function OverviewTab() {
  const { id } = useParams()
  const { clients, updateClient } = useMainStore()
  const { toast } = useToast()

  const client = clients.find((c) => c.id === id)

  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const [colors, setColors] = useState(client?.guidelines?.colors || '')
  const [voiceAndTone, setVoiceAndTone] = useState(client?.guidelines?.voiceAndTone || '')
  const [socials, setSocials] = useState<SocialMediaLink[]>(client?.socials || [])
  const [fontsFile, setFontsFile] = useState<File | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)

  useEffect(() => {
    if (client) {
      setColors(client.guidelines?.colors || '')
      setVoiceAndTone(client.guidelines?.voiceAndTone || '')
      setSocials(client.socials || [])
      setFontsFile(null)
      setLogoFile(null)
    }
  }, [client])

  if (!client) return null

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

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const coverUrl = URL.createObjectURL(file)
      updateClient(client.id, { coverImage: coverUrl })
      toast({
        title: 'Capa Atualizada',
        description: 'A nova imagem de capa foi salva com sucesso.',
      })
    }
  }

  const handleAddSocial = () => {
    setSocials([...socials, { platform: 'Instagram', url: '' }])
  }

  const handleRemoveSocial = (index: number) => {
    setSocials(socials.filter((_, i) => i !== index))
  }

  const handleSocialChange = (index: number, field: keyof SocialMediaLink, value: string) => {
    const newSocials = [...socials]
    newSocials[index] = { ...newSocials[index], [field]: value }
    setSocials(newSocials)
  }

  const handleSaveChanges = () => {
    const logoUrl = logoFile ? URL.createObjectURL(logoFile) : client.guidelines?.logo
    const fontsName = fontsFile ? fontsFile.name : client.guidelines?.fonts

    updateClient(client.id, {
      socials: socials.filter((s) => s.url.trim() !== ''),
      guidelines: {
        ...client.guidelines,
        colors,
        fonts: fontsName,
        logo: logoUrl,
        voiceAndTone,
      },
    })
    toast({
      title: 'Alterações Salvas',
      description: 'As informações foram atualizadas com sucesso.',
    })
  }

  const getPlatformIcon = (platform: string) => {
    const p = platform.toLowerCase()
    if (p === 'instagram') return <Instagram className="h-5 w-5 text-muted-foreground" />
    if (p === 'youtube') return <Youtube className="h-5 w-5 text-muted-foreground" />
    if (p === 'linkedin') return <Linkedin className="h-5 w-5 text-muted-foreground" />
    return <div className="h-5 w-5 rounded-full bg-muted-foreground/20" />
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden group border border-border">
        {client.coverImage ? (
          <img src={client.coverImage} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-muted/50 flex items-center justify-center">
            <span className="text-muted-foreground">Sem imagem de capa</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Label htmlFor="cover-upload" className="cursor-pointer">
            <div className="flex items-center gap-2 bg-background/90 text-foreground px-4 py-2 rounded-md hover:bg-background transition-colors shadow-sm">
              <Upload className="h-4 w-4" />
              <span className="text-sm font-medium">Alterar Capa</span>
            </div>
          </Label>
          <Input
            id="cover-upload"
            type="file"
            className="hidden"
            accept=".png,.jpg,.jpeg,.webp"
            onChange={handleCoverUpload}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold font-sans mb-6 text-foreground">
              Diretrizes da Marca
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Cores da Marca (HEX)</Label>
                <Input
                  value={colors}
                  onChange={(e) => setColors(e.target.value)}
                  placeholder="#121212, #FF4A4A"
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label>Tipografia (.ttf, .otf)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept=".ttf,.otf"
                    onChange={(e) => setFontsFile(e.target.files?.[0] || null)}
                    className="bg-background border-border flex-1 file:text-foreground file:border-0 file:bg-transparent file:font-medium"
                  />
                  {client.guidelines?.fonts && (
                    <span
                      className="text-xs text-muted-foreground max-w-[80px] truncate"
                      title={client.guidelines.fonts}
                    >
                      {client.guidelines.fonts}
                    </span>
                  )}
                </div>
              </div>
              <div className="col-span-1 md:col-span-2 space-y-2">
                <Label>Logotipo (.pdf, .png, .svg)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept=".pdf,.png,.svg"
                    onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                    className="bg-background border-border flex-1 file:text-foreground file:border-0 file:bg-transparent file:font-medium"
                  />
                  {client.guidelines?.logo && (
                    <span
                      className="text-xs text-muted-foreground max-w-[80px] truncate"
                      title="Logotipo salvo"
                    >
                      Ativo existente
                    </span>
                  )}
                </div>
              </div>
              <div className="col-span-1 md:col-span-2 space-y-2">
                <Label>Tom de Voz e Instruções Gerais</Label>
                <Textarea
                  value={voiceAndTone}
                  onChange={(e) => setVoiceAndTone(e.target.value)}
                  placeholder="Insira as diretrizes de comunicação, palavras a evitar, personalidade da marca..."
                  className="min-h-[120px] bg-background border-border"
                />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold font-sans text-foreground">Redes Sociais</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddSocial}
                className="h-8 border-border"
              >
                <Plus className="h-3 w-3 mr-2" /> Adicionar
              </Button>
            </div>
            <div className="space-y-4">
              {socials.length === 0 && (
                <p className="text-sm text-muted-foreground py-4 border border-dashed border-border rounded-md text-center">
                  Nenhuma rede social cadastrada para este cliente.
                </p>
              )}
              {socials.map((social, index) => (
                <div key={index} className="flex items-center gap-3 animate-fade-in-down">
                  <Select
                    value={social.platform}
                    onValueChange={(val) => handleSocialChange(index, 'platform', val)}
                  >
                    <SelectTrigger className="w-[140px] bg-background border-border shrink-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                      <SelectItem value="YouTube">YouTube</SelectItem>
                      <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    value={social.url}
                    onChange={(e) => handleSocialChange(index, 'url', e.target.value)}
                    placeholder="Link do perfil"
                    className="flex-1 bg-background border-border"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive shrink-0"
                    onClick={() => handleRemoveSocial(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  {social.url.trim() !== '' && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="shrink-0 text-muted-foreground"
                      asChild
                    >
                      <a href={social.url} target="_blank" rel="noreferrer">
                        <ExternalLinkIcon />
                      </a>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveChanges} className="gap-2">
              <Save className="h-4 w-4" /> Salvar Alterações
            </Button>
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

              {client.skillFile && !uploadedFile && (
                <div className="flex items-center justify-between p-3 rounded-md bg-background border border-border">
                  <span className="text-sm truncate mr-2 text-foreground">{client.skillFile}</span>
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
                {[{ action: 'Criou o perfil do cliente', time: '10 Nov', user: 'Sistema' }].map(
                  (log, i) => (
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
                  ),
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}

function ExternalLinkIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" x2="21" y1="14" y2="3" />
    </svg>
  )
}
