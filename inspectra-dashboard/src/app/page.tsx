"use client";

import { useEffect, useState, useRef } from 'react';
import { SecureSpectHeader } from '@/components/SecureSpectHeader';
import { VulnerabilityReport } from '@/components/VulnerabilityReport';
import { RemediationDialog } from '@/components/RemediationDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { scanDomain } from '@/lib/actions';
import type { Vulnerability } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Download, Loader2, ScanLine, FileJson, FileText, Terminal } from 'lucide-react';

function SubmitButton({ loading }: { loading: boolean }) {
  return (
      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Scanning...
            </>
        ) : (
            <>
              <ScanLine className="mr-2 h-4 w-4" />
              Scan Domain
            </>
        )}
      </Button>
  );
}

export default function SecureSpectPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[] | null>(null);
  const [currentDomain, setCurrentDomain] = useState<string>('');
  const [selectedVulnerability, setSelectedVulnerability] = useState<Vulnerability | null>(null);
  const [isRemediationDialogOpen, setIsRemediationDialogOpen] = useState(false);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const result = await scanDomain(currentDomain);
      setVulnerabilities(result.analysis.vulnerabilities || []);
      setMessage(result.analysis.message || "Scan finished successfully.");
      toast({
        title: "Scan Complete",
        description: result.analysis.message || "Scan finished successfully.",
      });
    } catch (err: any) {
      const errMsg = err?.message || "Scan failed. Try again.";
      setVulnerabilities(null);
      setError(errMsg);
      toast({
        title: "Scan Error",
        description: errMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewRemediation = (vulnerability: Vulnerability) => {
    setSelectedVulnerability(vulnerability);
    setIsRemediationDialogOpen(true);
  };

  const convertToCSV = (data: Vulnerability[]) => {
    const headers = ['ID', 'Type', 'Description', 'Severity', 'Resource', 'DomainScanned'];
    const csvRows = [
      headers.join(','),
      ...data.map(row =>
          headers.map(header => JSON.stringify(row[header.toLowerCase() as keyof Vulnerability] || '')).join(',')
      ),
    ];
    return csvRows.join('\n');
  };

  const downloadFile = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const handleExportJSON = () => {
    if (vulnerabilities) {
      const jsonContent = JSON.stringify(vulnerabilities, null, 2);
      downloadFile(`securespect_report_${currentDomain.replace(/[^a-zA-Z0-9]/g, '_')}.json`, jsonContent, 'application/json');
    }
  };

  const handleExportCSV = () => {
    if (vulnerabilities) {
      const csvContent = convertToCSV(vulnerabilities);
      downloadFile(`securespect_report_${currentDomain.replace(/[^a-zA-Z0-9]/g, '_')}.csv`, csvContent, 'text/csv');
    }
  };

  return (
      <div className="min-h-screen flex flex-col">
        <SecureSpectHeader />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Scan Domain</CardTitle>
              <CardDescription>Enter a domain URL (e.g., https://example.com) to scan for vulnerabilities.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleScan} ref={formRef} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="domain">Domain URL</Label>
                  <Input
                      id="domain"
                      name="domain"
                      type="url"
                      placeholder="https://example.com"
                      required
                      onChange={(e) => setCurrentDomain(e.target.value)}
                      className="text-base"
                  />
                </div>
                <SubmitButton loading={loading} />
              </form>
            </CardContent>
          </Card>

          {loading && !vulnerabilities && !error && (
              <div className="flex flex-col items-center justify-center text-center p-8 rounded-lg bg-card shadow">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-xl font-medium text-foreground">Scanning domain: {currentDomain || 'your domain'}</p>
                <p className="text-muted-foreground">Please wait while we analyze the target...</p>
              </div>
          )}

          {error && (
              <Alert variant="destructive" className="mb-8">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Scan Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
          )}

          {vulnerabilities && vulnerabilities.length > 0 && (
              <div className="mb-8 space-x-2 text-right">
                <Button variant="outline" onClick={handleExportJSON}>
                  <FileJson className="mr-2 h-4 w-4" /> Export JSON
                </Button>
                <Button variant="outline" onClick={handleExportCSV}>
                  <FileText className="mr-2 h-4 w-4" /> Export CSV
                </Button>
              </div>
          )}

          {vulnerabilities !== null && vulnerabilities.length === 0 && message && !error && (
              <Card className="text-center p-8 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Scan Complete</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-muted-foreground">{message}</p>
                </CardContent>
              </Card>
          )}

          {vulnerabilities && vulnerabilities.length > 0 && (
              <VulnerabilityReport vulnerabilities={vulnerabilities} onViewRemediation={handleViewRemediation} />
          )}

          <RemediationDialog
              vulnerability={selectedVulnerability}
              isOpen={isRemediationDialogOpen}
              onOpenChange={setIsRemediationDialogOpen}
          />
        </main>
        <footer className="py-6 text-center text-muted-foreground border-t border-border mt-auto">
          <p>&copy; {new Date().getFullYear()} Inspectra. All rights reserved.</p>
        </footer>
      </div>
  );
}
