import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Instagram,
  Youtube,
  Linkedin,
  ExternalLink,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import useMainStore, { Client } from '@/stores/main'
import { NewClientModal } from '@/components/NewClientModal'
import { EditClientModal } from '@/components/EditClientModal'
import { useToast } from '@/hooks/use-toast'

export default function Clients() {
  const { clients, deleteClient } = useMainStore()
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false)

  const [clientToEdit, setClientToEdit] = useState<Client | null>(null)
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null)
  const { toast } = useToast()

  const confirmDelete = () => {
    if (clientToDelete) {
      deleteClient(clientToDelete.id)
      toast({
        title: 'Cliente excluído',
        description: 'O cliente foi removido com sucesso.',
      })
      setClientToDelete(null)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold font-sans mb-2">Diretório de Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie perfis, ativos de marca e calendários de conteúdo de forma centralizada.
          </p>
        </div>
        <Button onClick={() => setIsNewClientModalOpen(true)} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" /> Novo Cliente
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {clients.map((client) => {
          const fallbackLogo = `https://img.usecurling.com/i?q=${client.name.split(' ')[0]}&shape=fill&color=gray`
          const logo = client.guidelines?.logo || fallbackLogo
          const cover =
            client.coverImage || 'https://img.usecurling.com/p/400/200?q=abstract&color=gray'

          const platforms = client.socials.map((s) => s.platform.toLowerCase())

          return (
            <div key={client.id} className="relative group block h-full">
              <Link to={`/clientes/${client.id}`} className="block h-full">
                <Card className="h-full bg-card border-border overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1">
                  <div className="relative h-32 w-full bg-muted">
                    <img
                      src={cover}
                      alt={`${client.name} Cover`}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute -bottom-6 left-4">
                      <Avatar className="h-12 w-12 border-2 border-card bg-background">
                        <AvatarImage src={logo} className="object-cover p-1.5" />
                        <AvatarFallback>{client.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                  <CardContent className="pt-10 pb-6 px-4 flex flex-col items-start gap-4">
                    <div className="w-full flex justify-between items-start">
                      <h3 className="font-semibold text-lg line-clamp-1 font-sans text-foreground pr-8">
                        {client.name}
                      </h3>
                      <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2 mt-1" />
                    </div>
                    <div className="flex gap-2 text-muted-foreground mt-auto">
                      {platforms.includes('instagram') && <Instagram className="h-4 w-4" />}
                      {platforms.includes('youtube') && <Youtube className="h-4 w-4" />}
                      {platforms.includes('linkedin') && <Linkedin className="h-4 w-4" />}
                      {platforms.length === 0 && <span className="text-xs">Sem redes sociais</span>}
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 bg-background/50 hover:bg-background/80 backdrop-blur-sm"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.preventDefault()
                        setClientToEdit(client)
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={(e) => {
                        e.preventDefault()
                        setClientToDelete(client)
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )
        })}
        {clients.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed border-border rounded-xl">
            Nenhum cliente cadastrado. Clique em "Novo Cliente" para começar.
          </div>
        )}
      </div>

      <NewClientModal open={isNewClientModalOpen} onOpenChange={setIsNewClientModalOpen} />

      <EditClientModal
        client={clientToEdit}
        open={!!clientToEdit}
        onOpenChange={(open) => !open && setClientToEdit(null)}
      />

      <AlertDialog
        open={!!clientToDelete}
        onOpenChange={(open) => !open && setClientToDelete(null)}
      >
        <AlertDialogContent className="bg-[#121212] border-[#171717]">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir cliente?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir {clientToDelete?.name}? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="border-t border-[#171717] pt-4 mt-4">
            <AlertDialogCancel className="border-[#171717]">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
