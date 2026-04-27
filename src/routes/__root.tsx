import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  shellComponent: RootShell,
  component: () => <Outlet />,
  notFoundComponent: () => (
    <div style={{ padding: 24 }}>
      <h1>404 — Página não encontrada</h1>
    </div>
  ),
});

function RootShell({ children }: { children: React.ReactNode }) {
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