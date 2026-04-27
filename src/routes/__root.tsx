import type { ReactNode } from "react";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import App from "../App";
import "../index.css";

export const Route = createRootRoute({
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: RootNotFound,
});

function RootComponent() {
  return (
    <App>
      <Outlet />
    </App>
  );
}

function RootNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="text-center">
        <h1 className="mb-3 text-4xl font-bold text-foreground">404</h1>
        <p className="mb-4 text-muted-foreground">Página não encontrada.</p>
        <Link to="/" className="text-primary underline underline-offset-4">
          Voltar para a tela inicial
        </Link>
      </div>
    </div>
  );
}

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Dashboard COPSOQ II — Análise Psicossocial Executiva</title>
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}