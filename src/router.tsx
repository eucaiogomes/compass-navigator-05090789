import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createTanStackRouter({
    routeTree,
    defaultPreload: "intent",
    scrollRestoration: true,
    defaultErrorComponent: ({ error, reset }) => (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="text-center">
          <h1 className="mb-3 text-2xl font-semibold text-foreground">Algo deu errado</h1>
          <p className="mb-4 text-sm text-muted-foreground">{error.message}</p>
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    ),
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}