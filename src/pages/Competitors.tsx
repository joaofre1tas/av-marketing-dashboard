import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TrendingUp, TrendingDown } from 'lucide-react'

const metrics = [
  { name: 'Seguidores', av: '124.5k', beta: '45.2k', y: '89.1k', z: '210.4k' },
  { name: 'Taxa de Engajamento', av: '4.2%', beta: '2.4%', y: '3.1%', z: '1.9%' },
  { name: 'Frequência Semanal', av: '5 posts', beta: '3 posts', y: '7 posts', z: '4 posts' },
  { name: 'Alcance Médio', av: '45k', beta: '12k', y: '28k', z: '55k' },
]

export default function Competitors() {
  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold mb-1">Monitoramento da Concorrência</h1>
        <p className="text-muted-foreground">
          Compare o desempenho da Agência de Valor com o mercado.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-2">
        <Card className="hover:scale-[1.02] transition-transform shadow-none border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Agência Beta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold">45.2k</p>
                <p className="text-xs text-muted-foreground mt-1">Seguidores</p>
              </div>
              <p className="text-sm text-emerald-500 flex items-center font-medium bg-emerald-500/10 px-2 py-1 rounded">
                <TrendingUp className="h-4 w-4 mr-1" />
                2.4%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:scale-[1.02] transition-transform shadow-none border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">Studio Y</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold">89.1k</p>
                <p className="text-xs text-muted-foreground mt-1">Seguidores</p>
              </div>
              <p className="text-sm text-emerald-500 flex items-center font-medium bg-emerald-500/10 px-2 py-1 rounded">
                <TrendingUp className="h-4 w-4 mr-1" />
                1.2%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:scale-[1.02] transition-transform shadow-none border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">Marketing Z</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold">210.4k</p>
                <p className="text-xs text-muted-foreground mt-1">Seguidores</p>
              </div>
              <p className="text-sm text-destructive flex items-center font-medium bg-destructive/10 px-2 py-1 rounded">
                <TrendingDown className="h-4 w-4 mr-1" />
                -0.5%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-none border-border">
        <CardHeader>
          <CardTitle>Comparativo de Métricas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[250px]">Métrica</TableHead>
                <TableHead className="font-bold text-transparent bg-clip-text bg-gradient-av text-base border-l border-border">
                  O Agência de Valor
                </TableHead>
                <TableHead>Agência Beta</TableHead>
                <TableHead>Studio Y</TableHead>
                <TableHead>Marketing Z</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.map((m) => (
                <TableRow key={m.name} className="hover:bg-muted/20">
                  <TableCell className="font-medium text-muted-foreground">{m.name}</TableCell>
                  <TableCell className="text-foreground font-bold border-l border-border bg-muted/10">
                    {m.av}
                  </TableCell>
                  <TableCell>{m.beta}</TableCell>
                  <TableCell>{m.y}</TableCell>
                  <TableCell>{m.z}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
