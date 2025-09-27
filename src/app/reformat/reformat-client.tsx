"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { reformatPrescription, type PrescriptionReformattingOutput } from "@/ai/flows/prescription-reformatting-flow";
import { Loader2, FilePenLine, FileText } from "lucide-react";

export function ReformatClient() {
  const [patientId, setPatientId] = useState("P-12345");
  const [doctorId, setDoctorId] = useState("D-67890");
  const [patientName, setPatientName] = useState("Jane Doe");
  const [prescriptionDetails, setPrescriptionDetails] = useState('{ "medication": "Amoxicillin 500mg", "dosage": "1 capsule", "frequency": "every 8 hours for 7 days" }');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PrescriptionReformattingOutput | null>(null);
  const { toast } = useToast();

  const isFormValid = () => patientId.trim() && doctorId.trim() && patientName.trim() && prescriptionDetails.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast({
        title: "Incomplete Form",
        description: "Please fill out all fields to reformat the prescription.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      JSON.parse(prescriptionDetails);
    } catch (error) {
       toast({
        title: "Invalid JSON",
        description: "The prescription details must be in a valid JSON format.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);
    try {
      const apiResult = await reformatPrescription({ patientId, doctorId, patientName, prescriptionDetails });
      setResult(apiResult);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      toast({
        title: "Reformatting Failed",
        description: "There was a problem processing the prescription. " + errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reformat Prescription</CardTitle>
          <CardDescription>Convert structured prescription data into a patient-friendly, plain text format. Sensitive IDs will be removed.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="space-y-2">
                <Label htmlFor="patient-name">Patient Name</Label>
                <Input 
                  id="patient-name" 
                  placeholder="e.g., Jane Doe" 
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-id">Patient ID</Label>
                <Input 
                  id="patient-id" 
                  placeholder="e.g., P-12345" 
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctor-id">Prescribing Doctor ID</Label>
                <Input 
                  id="doctor-id" 
                  placeholder="e.g., D-67890" 
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="prescription-details">Prescription Details (JSON format)</Label>
              <Textarea
                id="prescription-details"
                value={prescriptionDetails}
                onChange={(e) => setPrescriptionDetails(e.target.value)}
                className="font-code"
                rows={6}
              />
            </div>
            <Button type="submit" disabled={isLoading || !isFormValid()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Reformatting...
                </>
              ) : (
                <>
                  <FilePenLine className="mr-2 h-4 w-4" />
                  Reformat Prescription
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Patient-Friendly Prescription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg bg-muted/50 border whitespace-pre-wrap font-sans text-card-foreground">
              {result.reformattedText}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
