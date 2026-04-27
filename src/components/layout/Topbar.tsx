import { Download, Globe, Accessibility, BookOpen, Bell, ChevronDown, Languages } from "lucide-react";

export const Topbar = () => {
  return (
    <header className="fixed top-0 left-12 right-0 h-14 bg-white border-b border-border flex items-center justify-between px-4 z-30">
      {/* Left: Install button */}
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border bg-muted/40 hover:bg-muted text-xs font-medium text-foreground/80 transition-colors">
          <Download className="h-3.5 w-3.5" />
          Instalar
        </button>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        <button title="Idioma" className="h-9 w-9 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-primary">
          <Globe className="h-[18px] w-[18px]" strokeWidth={1.7} />
        </button>
        <button title="Acessibilidade" className="h-9 w-9 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-primary">
          <Accessibility className="h-[18px] w-[18px]" strokeWidth={1.7} />
        </button>
        <button title="Manual" className="h-9 w-9 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-primary">
          <BookOpen className="h-[18px] w-[18px]" strokeWidth={1.7} />
        </button>
        <button title="Notificações" className="h-9 w-9 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-primary relative">
          <Bell className="h-[18px] w-[18px]" strokeWidth={1.7} />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
        </button>

        <button className="flex items-center gap-1.5 px-2 h-9 rounded-md border border-border hover:bg-muted text-xs">
          <Languages className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="font-medium">Português</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </button>

        <div className="flex items-center gap-2 pl-2 ml-1 border-l border-border">
          <div className="text-right leading-tight">
            <p className="text-[11px] font-semibold text-foreground">Caio</p>
            <p className="text-[10px] text-accent font-medium">Administrador</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-primary-foreground text-xs font-bold ring-2 ring-white shadow">
            C
          </div>
        </div>
      </div>
    </header>
  );
};
