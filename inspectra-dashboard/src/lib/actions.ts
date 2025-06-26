"use server";

// src/lib/actions.ts
export async function scanDomain(domain: string) {
  const response = await fetch('http://engine:3000/analyze-domain', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ domain }),
  });
  if (!response.ok) throw new Error('Scan failed');
  return response.json();
}
