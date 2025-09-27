"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { analyzePrescription, type AnalyzePrescriptionOutput } from "@/ai/flows/prescription-analysis-summary";
import { Loader2, Upload, FileText, AlertCircle, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AnalysisClient() {
  const [file, setFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalyzePrescriptionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setAnalysisResult(null);
      setError(null);
    }
  };

  const readFileAsDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a prescription file to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const dataUri = await readFileAsDataURI(file);
      const result = await analyzePrescription({ prescriptionDataUri: dataUri });
      setAnalysisResult(result);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(errorMessage);
      toast({
        title: "Analysis Failed",
        description: "There was a problem analyzing your prescription. " + errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Upload Prescription</CardTitle>
          <CardDescription>Upload an image or PDF of your prescription for AI-powered analysis.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prescription-file">Prescription File</Label>
              <div className="flex items-center gap-4">
                <Input id="prescription-file" type="file" onChange={handleFileChange} accept="image/*,.pdf" className="flex-grow" />
                <Button type="submit" disabled={isLoading || !file}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
              {file && <p className="text-sm text-muted-foreground">Selected file: {file.name}</p>}
            </div>
          </form>
        </CardContent>
      </Card>
      
      {analysisResult && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Analysis Results</h2>
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
               <FileText className="h-5 w-5" />
               <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{analysisResult.summary}</p>
            </CardContent>
          </Card>
          {analysisResult.drugInteractions && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Potential Drug Interactions</AlertTitle>
              <AlertDescription>{analysisResult.drugInteractions}</AlertDescription>
            </Alert>
          )}
          {analysisResult.dosageConcerns && (
             <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Potential Dosage Concerns</AlertTitle>
              <AlertDescription>{analysisResult.dosageConcerns}</AlertDescription>
            </Alert>
          )}
           <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>Disclaimer</AlertTitle>
              <AlertDescription>
                This AI analysis is for informational purposes only and not a substitute for professional medical advice. Always consult with a qualified healthcare provider.
              </AlertDescription>
            </Alert>
        </div>
      )}
    </div>
  );
}
