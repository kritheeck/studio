"use client";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ValidationPage() {
  return (
    <AppShell>
      <Card>
        <CardHeader>
          <CardTitle>Prescription Validation</CardTitle>
          <CardDescription>Cross-reference prescription data against healthcare databases for validation.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patient-id">Patient ID</Label>
                <Input id="patient-id" placeholder="e.g., P-12345" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctor-id">Prescribing Doctor ID</Label>
                <Input id="doctor-id" placeholder="e.g., D-67890" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="prescription-details">Prescription Details (JSON format)</Label>
              <Textarea
                id="prescription-details"
                placeholder='{ "medication": "Lisinopril", "dosage": "10mg", "frequency": "once daily" }'
                className="font-code"
                rows={6}
              />
            </div>
            <Button onClick={(e) => e.preventDefault()}>Validate Prescription</Button>
          </form>
          <p className="text-sm text-muted-foreground mt-4">Note: This is a placeholder UI. The Google Cloud Healthcare API is not integrated.</p>
        </CardContent>
      </Card>
    </AppShell>
  );
}
