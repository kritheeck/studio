"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { validatePrescription, type PrescriptionValidationOutput } from "@/ai/flows/prescription-validation-flow";
import { Loader2, ShieldCheck, ShieldAlert } from "lucide-react";

export default function ValidationPage() {
  const [prescriptionDetails, setPrescriptionDetails] = useState("Lisinopril 10mg, once daily");
  const [isLoading, setIsLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<PrescriptionValidationOutput | null>(null);
  const { toast } = useToast();

  const isFormValid = () => prescriptionDetails.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast({
        title: "Incomplete Form",
        description: "Please enter the prescription details to validate.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setValidationResult(null);
    try {
      const result = await validatePrescription({ prescriptionText: prescriptionDetails });
      setValidationResult(result);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      toast({
        title: "Validation Failed",
        description: "There was a problem validating the prescription. " + errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Prescription Validation</CardTitle>
            <CardDescription>Enter prescription details to cross-reference against AI-powered checks for validation.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prescription-details">Prescription Details</Label>
                <Textarea
                  id="prescription-details"
                  placeholder="e.g., Lisinopril 10mg, one tablet daily"
                  value={prescriptionDetails}
                  onChange={(e) => setPrescriptionDetails(e.target.value)}
                  className="font-sans"
                  rows={4}
                />
              </div>
              <Button type="submit" disabled={isLoading || !isFormValid()}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validating...
                  </>
                ) : (
                  "Validate Prescription"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {validationResult && (
          <Card>
            <CardHeader>
              <CardTitle>Validation Result</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`flex items-start gap-4 p-4 rounded-lg ${validationResult.isSafe ? 'bg-green-100 dark:bg-green-900/50 border border-green-300 dark:border-green-700' : 'bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700'}`}>
                {validationResult.isSafe ? (
                  <ShieldCheck className="h-8 w-8 text-green-600 dark:text-green-400 mt-1" />
                ) : (
                  <ShieldAlert className="h-8 w-8 text-red-600 dark:text-red-400 mt-1" />
                )}
                <div>
                  <h3 className={`text-lg font-semibold ${validationResult.isSafe ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                    {validationResult.isSafe ? 'Prescription Deemed Safe' : 'Potential Safety Concern'}
                  </h3>
                  <p className={`text-sm ${validationResult.isSafe ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                    {validationResult.reason}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
