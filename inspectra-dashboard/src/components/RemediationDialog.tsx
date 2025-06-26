"use client";

import { useEffect, useState } from 'react';
import type { Vulnerability } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Terminal } from "lucide-react";
import { ScrollArea } from '@/components/ui/scroll-area';

interface RemediationDialogProps {
  vulnerability: Vulnerability | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface RemediationState {
  steps: string | null;
  error: string | null;
}

async function getRemediationSteps(description: string, domain: string): Promise<RemediationState> {
  try {
    const response = await fetch('http://engine:3000/remediation-steps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, domain }),
    });
    if (!response.ok) {
      const data = await response.json();
      return { steps: null, error: data.error || 'Failed to get remediation steps' };
    }
    const data = await response.json();
    return { steps: data.steps, error: null };
  } catch (err: any) {
    return { steps: null, error: err.message || 'Network error' };
  }
}

export function RemediationDialog({ vulnerability, isOpen, onOpenChange }: RemediationDialogProps) {
  const [remediation, setRemediation] = useState<RemediationState>({ steps: null, error: null });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && vulnerability) {
      const fetchRemediation = async () => {
        setIsLoading(true);
        setRemediation({ steps: null, error: null }); // Reset previous state
        const result = await getRemediationSteps(vulnerability.description, vulnerability.domainScanned);
        setRemediation(result);
        setIsLoading(false);
      };
      fetchRemediation();
    }
  }, [isOpen, vulnerability]);

  if (!vulnerability) return null;

  return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl">Remediation Guidance</DialogTitle>
            <DialogDescription className="font-mono text-sm">
              For: {vulnerability.type} - {vulnerability.resource}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-grow pr-6">
            <div className="space-y-4 py-4">
              <p><strong className="text-foreground">Vulnerability:</strong> {vulnerability.description}</p>

              {isLoading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="ml-2 text-muted-foreground">Generating remediation steps...</p>
                  </div>
              )}

              {remediation.error && !isLoading && (
                  <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{remediation.error}</AlertDescription>
                  </Alert>
              )}

              {remediation.steps && !isLoading && (
                  <div className="prose prose-sm dark:prose-invert max-w-none rounded-md border bg-card p-4 shadow-sm font-mono">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Recommended Steps:</h3>
                    <div className="whitespace-pre-wrap break-words leading-relaxed text-card-foreground">
                      {remediation.steps}
                    </div>
                  </div>
              )}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  );
}
