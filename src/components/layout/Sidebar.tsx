import { Home, Megaphone, Monitor, Workflow, Users, Briefcase, HeadphonesIcon, FolderOpen, ClipboardList, HelpCircle, User, Settings, FileText, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { icon: Home, label: "Início", active: true },
  { icon: Megaphone, label: "Comunicados" },
  { icon: Monitor, label: "Painel" },
  { icon: Workflow, label: "Processos" },
  { icon: Users, label: "Equipes" },
  { icon: Briefcase, label: "Áreas" },
  { icon: HeadphonesIcon, label: "Suporte" },
  { icon: FolderOpen, label: "Arquivos" },
  { icon: ClipboardList, label: "Avaliações" },
  { icon: HelpCircle, label: "Ajuda" },
  { icon: User, label: "Perfil" },
  { icon: Settings, label: "Configurações" },
  { icon: FileText, label: "Relatórios" },
];

export const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-12 bg-white border-r border-border flex flex-col items-center py-3 z-40">
      {/* Logo */}
      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center mb-3 shadow-sm">
        <span className="text-[10px] font-bold text-primary-foreground">L</span>
      </div>

      <nav className="flex-1 flex flex-col items-center gap-0.5 w-full overflow-y-auto">
        {items.map((it, i) => (
          <button
            key={i}
            title={it.label}
            className={cn(
              "h-9 w-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted/60 transition-colors relative",
              it.active && "text-primary"
            )}
          >
            {it.active && <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-accent rounded-r" />}
            <it.icon className="h-[18px] w-[18px]" strokeWidth={1.7} />
          </button>
        ))}
      </nav>

      {/* Logout */}
      <button
        title="Sair"
        className="h-9 w-9 rounded-md bg-accent flex items-center justify-center text-accent-foreground hover:bg-accent/90 mt-2"
      >
        <LogOut className="h-4 w-4" strokeWidth={2} />
      </button>
    </aside>
  );
};
