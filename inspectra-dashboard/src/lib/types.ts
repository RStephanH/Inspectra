export type Severity = "Critical" | "High" | "Medium" | "Low" | "Informational";

export type Vulnerability = {
  id: string;
  type: string;
  description: string;
  severity: Severity;
  resource: string;
  domainScanned: string; 
};
