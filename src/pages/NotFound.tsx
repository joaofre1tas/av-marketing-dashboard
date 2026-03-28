import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center animate-fade-in">
      <div className="text-center space-y-4 max-w-md mx-auto p-8 bg-card border border-border rounded-xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-av" />
        <h1 className="text-6xl font-bold text-gradient-av">404</h1>
        <p className="text-xl text-foreground font-semibold">Página não encontrada</p>
        <p className="text-muted-foreground text-sm">
          O caminho que você tentou acessar não existe ou foi movido.
        </p>
        <div className="pt-4">
          <Link to="/" className="btn-av w-full text-center">
            Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
