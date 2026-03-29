import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import useMainStore, { Client, SocialMediaLink } from '@/stores/main'
import { ScrollArea } from '@/components/ui/scroll-area'

interface EditClientModalProps {
  client: Client | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditClientModal({ client, open, onOpenChange }: EditClientModalProps) {
  const { updateClient } = useMainStore()
  const { toast } = useToast()

  const [name, setName] = useState('')
  const [skillFile, setSkillFile] = useState<File | null>(null)
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [socials, setSocials] = useState<SocialMediaLink[]>([])
  const [colors, setColors] = useState('')
  const [fontsFile, setFontsFile] = useState<File | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [voiceAndTone, setVoiceAndTone] = useState('')

  const [niche, setNiche] = useState('')
  const [responsible, setResponsible] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [status, setStatus] = useState<'Ativo' | 'Pausado' | 'Encerrado'>('Ativo')

  useEffect(() => {
    if (client && open) {
      setName(client.name)
      setSocials(client.socials || [])
      setColors(client.guidelines?.colors || '')
      setVoiceAndTone(client.guidelines?.voiceAndTone || '')
      setNiche(client.niche || '')
      setResponsible(client.responsible || '')
      setTargetAudience(client.targetAudience || '')
      setStatus(client.status || 'Ativo')

      setSkillFile(null)
      setCoverImage(null)
      setFontsFile(null)
      setLogoFile(null)
    }
  }, [client, open])

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

  const handleSubmit = () => {
    if (!client) return
    if (!name) {
      toast({
        title: 'Campos obrigatórios ausentes',
        description: 'Preencha o Nome do cliente.',
        variant: 'destructive',
      })
      return
    }

    const coverUrl = coverImage ? URL.createObjectURL(coverImage) : client.coverImage
    const logoUrl = logoFile ? URL.createObjectURL(logoFile) : client.guidelines?.logo
    const skillName = skillFile ? skillFile.name : client.skillFile
    const fontsName = fontsFile ? fontsFile.name : client.guidelines?.fonts

    updateClient(client.id, {
      name,
      skillFile: skillName,
      coverImage: coverUrl,
      socials: socials.filter((s) => s.url.trim() !== ''),
      niche,
      responsible,
      targetAudience,
      status,
      guidelines: {
        ...client.guidelines,
        colors,
        fonts: fontsName,
        logo: logoUrl,
        voiceAndTone,
      },
    })

    toast({
      title: 'Cliente atualizado',
      description: 'As informações do cliente foram salvas com sucesso.',
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col bg-[#121212] border-[#171717] font-sans">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-xl">Editar Cliente</DialogTitle>
          <DialogDescription>
            Edite as informações e diretrizes de marca do cliente.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6 py-2">
          <div className="space-y-8 pb-4">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Informações Básicas
              </h3>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <Label>
                    Nome do cliente <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: TechCorp Solutions"
                    className="bg-background border-[#171717]"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label>
                      Arquivo de skill <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      type="file"
                      accept=".skill,*/*"
                      onChange={(e) => setSkillFile(e.target.files?.[0] || null)}
                      className="bg-background border-[#171717] file:text-foreground file:border-0 file:bg-transparent file:font-medium"
                    />
                    {client?.skillFile && (
                      <span
                        className="text-xs text-muted-foreground truncate"
                        title={client.skillFile}
                      >
                        Atual: {client.skillFile}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>
                      Capa do perfil <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      type="file"
                      accept=".png,.jpg,.jpeg,.webp"
                      onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                      className="bg-background border-[#171717] file:text-foreground file:border-0 file:bg-transparent file:font-medium"
                    />
                    <span className="text-xs text-muted-foreground">
                      Tamanho recomendado: 1200 x 400px{' '}
                      {client?.coverImage ? '(Imagem atual mantida)' : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Informações do Cliente
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Nicho</Label>
                  <Input
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    placeholder="Ex: Tecnologia"
                    className="bg-background border-[#171717]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Responsável</Label>
                  <Input
                    value={responsible}
                    onChange={(e) => setResponsible(e.target.value)}
                    placeholder="Ex: João Silva"
                    className="bg-background border-[#171717]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                    <SelectTrigger className="bg-background border-[#171717]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Pausado">Pausado</SelectItem>
                      <SelectItem value="Encerrado">Encerrado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Público-alvo</Label>
                <Textarea
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="Descreva o público-alvo do cliente"
                  className="min-h-[80px] bg-background border-[#171717]"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Redes sociais gerenciadas (Opcional)
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddSocial}
                  className="h-8 border-[#171717]"
                >
                  <Plus className="h-3 w-3 mr-2" /> Adicionar
                </Button>
              </div>

              <div className="space-y-3">
                {socials.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4 border border-dashed border-[#171717] rounded-md">
                    Nenhuma rede social adicionada.
                  </p>
                )}
                {socials.map((social, index) => (
                  <div key={index} className="flex items-center gap-3 animate-fade-in-down">
                    <Select
                      value={social.platform}
                      onValueChange={(val) => handleSocialChange(index, 'platform', val)}
                    >
                      <SelectTrigger className="w-[140px] bg-background border-[#171717]">
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
                      className="flex-1 bg-background border-[#171717]"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => handleRemoveSocial(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Diretrizes de marca (Opcional)
              </h3>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <Label>Cores</Label>
                  <Input
                    value={colors}
                    onChange={(e) => setColors(e.target.value)}
                    placeholder="Ex: primária #FF5C00, secundária #171717"
                    className="bg-background border-[#171717]"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label>Fontes (.ttf, .otf)</Label>
                    <Input
                      type="file"
                      accept=".ttf,.otf"
                      onChange={(e) => setFontsFile(e.target.files?.[0] || null)}
                      className="bg-background border-[#171717] file:text-foreground file:border-0 file:bg-transparent file:font-medium"
                    />
                    {client?.guidelines?.fonts && (
                      <span
                        className="text-xs text-muted-foreground truncate"
                        title={client.guidelines.fonts}
                      >
                        Atual: {client.guidelines.fonts}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Logotipo (.pdf, .png, .svg)</Label>
                    <Input
                      type="file"
                      accept=".pdf,.png,.svg"
                      onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                      className="bg-background border-[#171717] file:text-foreground file:border-0 file:bg-transparent file:font-medium"
                    />
                    {client?.guidelines?.logo && (
                      <span className="text-xs text-muted-foreground">Logotipo atual salvo.</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Tom de voz e instruções gerais</Label>
                  <Textarea
                    value={voiceAndTone}
                    onChange={(e) => setVoiceAndTone(e.target.value)}
                    placeholder="Insira diretrizes de comunicação, palavras a evitar..."
                    className="min-h-[100px] bg-background border-[#171717]"
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="shrink-0 pt-4 border-t border-[#171717]">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-[#171717]"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
