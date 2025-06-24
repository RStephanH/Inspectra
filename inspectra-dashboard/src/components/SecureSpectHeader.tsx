import { ShieldHalf } from 'lucide-react';

export function SecureSpectHeader() {
  return (
    <header className="py-6 mb-8 border-b border-border">
      <div className="container mx-auto flex items-center gap-3">
        <ShieldHalf className="w-10 h-10 text-primary" />
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Inspectra
        </h1>
      </div>
    </header>
  );
}
