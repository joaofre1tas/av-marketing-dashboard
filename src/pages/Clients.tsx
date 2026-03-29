import { Link } from 'react-router-dom'
import { Instagram, Youtube, Linkedin, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const mockClients = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    cover: 'https://img.usecurling.com/p/400/200?q=technology&color=blue',
    logo: 'https://img.usecurling.com/i?q=tech&shape=fill&color=blue',
    socials: ['instagram', 'linkedin', 'youtube'],
  },
  {
    id: '2',
    name: 'Sabor & Arte',
    cover: 'https://img.usecurling.com/p/400/200?q=restaurant&color=orange',
    logo: 'https://img.usecurling.com/i?q=food&shape=fill&color=orange',
    socials: ['instagram', 'youtube'],
  },
  {
    id: '3',
    name: 'Financeira Atual',
    cover: 'https://img.usecurling.com/p/400/200?q=finance&color=green',
    logo: 'https://img.usecurling.com/i?q=finance&shape=fill&color=green',
    socials: ['linkedin'],
  },
  {
    id: '4',
    name: 'Studio Design',
    cover: 'https://img.usecurling.com/p/400/200?q=design&color=purple',
    logo: 'https://img.usecurling.com/i?q=design&shape=fill&color=violet',
    socials: ['instagram'],
  },
]

export default function Clients() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-semibold font-sans mb-2">Diretório de Clientes</h1>
        <p className="text-muted-foreground">
          Gerencie perfis, ativos de marca e calendários de conteúdo de forma centralizada.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockClients.map((client) => (
          <Link key={client.id} to={`/clientes/${client.id}`} className="group block h-full">
            <Card className="h-full bg-card border-border overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1">
              <div className="relative h-32 w-full bg-muted">
                <img
                  src={client.cover}
                  alt="Cover"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute -bottom-6 left-4">
                  <Avatar className="h-12 w-12 border-2 border-card bg-background">
                    <AvatarImage src={client.logo} className="object-cover p-2" />
                    <AvatarFallback>{client.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <CardContent className="pt-10 pb-6 px-4 flex flex-col items-start gap-4">
                <div className="w-full flex justify-between items-start">
                  <h3 className="font-semibold text-lg line-clamp-1 font-sans text-foreground">
                    {client.name}
                  </h3>
                  <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex gap-2 text-muted-foreground mt-auto">
                  {client.socials.includes('instagram') && <Instagram className="h-4 w-4" />}
                  {client.socials.includes('youtube') && <Youtube className="h-4 w-4" />}
                  {client.socials.includes('linkedin') && <Linkedin className="h-4 w-4" />}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
