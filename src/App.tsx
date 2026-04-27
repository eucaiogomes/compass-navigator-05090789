import type { PropsWithChildren } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

const App = ({ children }: PropsWithChildren) => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    {children}
  </TooltipProvider>
);

export default App;
