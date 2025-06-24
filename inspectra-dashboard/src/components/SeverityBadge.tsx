import type { Severity } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, AlertTriangle, ShieldQuestion, InfoIcon, CircleHelp } from "lucide-react";
import { cn } from "@/lib/utils";

interface SeverityBadgeProps {
  severity: Severity;
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  const severityConfig = {
    Critical: { icon: ShieldAlert, color: "text-destructive", badgeVariant: "destructive" as const },
    High: { icon: AlertTriangle, color: "text-orange-400", badgeVariant: "outline" as const },
    Medium: { icon: ShieldQuestion, color: "text-yellow-400", badgeVariant: "outline" as const },
    Low: { icon: InfoIcon, color: "text-blue-400", badgeVariant: "outline" as const },
    Informational: { icon: CircleHelp, color: "text-muted-foreground", badgeVariant: "secondary" as const },
  };

  const config = severityConfig[severity];
  const IconComponent = config.icon;

  return (
    <Badge variant={config.badgeVariant} className={cn("flex items-center gap-1.5 whitespace-nowrap", config.badgeVariant === 'destructive' ? '' : config.color)}>
      <IconComponent className={cn("h-3.5 w-3.5", config.badgeVariant === 'destructive' ? 'text-destructive-foreground' : config.color)} />
      <span>{severity}</span>
    </Badge>
  );
}
