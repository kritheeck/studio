"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getHealthAdvice, type HealthAdvisorOutput } from "@/ai/flows/health-advisor-flow";
import { Loader2, Sparkles, Pilcrow, Apple, Ban, Heart, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AdvisorClient() {
  const [symptoms, setSymptoms] = useState("");
  const [adviceResult, setAdviceResult] = useState<HealthAdvisorOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!symptoms.trim()) {
      toast({
        title: "No symptoms provided",
        description: "Please enter a description of the symptoms or doctor's notes.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setAdviceResult(null);

    try {
      const result = await getHealthAdvice({ symptoms });
      setAdviceResult(result);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      toast({
        title: "Analysis Failed",
        description: "There was a problem getting health advice. " + errorMessage,
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
          <CardTitle>AI Health Advisor</CardTitle>
          <CardDescription>Enter a doctor's description or your symptoms below to get AI-powered health advice, including medication and dietary suggestions.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="e.g., Patient complains of a persistent dry cough, headache, and a mild fever for the last 3 days..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows={5}
              className="text-base"
            />
            <Button type="submit" disabled={isLoading || !symptoms.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting Advice...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Get AI Advice
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {adviceResult && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Your Personalized Health Advice</h2>
          
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
               <Pilcrow className="h-5 w-5 text-primary" />
               <CardTitle>Medication Suggestions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {adviceResult.medications.map((med, index) => (
                <div key={index} className="p-4 rounded-md border bg-card">
                  <p className="font-semibold">{med.name}</p>
                  <p className="text-sm text-muted-foreground">{med.reason}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Apple className="h-5 w-5 text-green-500" />
                <CardTitle>Foods to Eat</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {adviceResult.foodsToEat.map((food, index) => <li key={index}>{food}</li>)}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Ban className="h-5 w-5 text-red-500" />
                <CardTitle>Foods to Avoid</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {adviceResult.foodsToAvoid.map((food, index) => <li key={index}>{food}</li>)}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
               <Heart className="h-5 w-5 text-pink-500" />
               <CardTitle>Lifestyle Advice</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {adviceResult.lifestyleAdvice.map((advice, index) => <li key={index}>{advice}</li>)}
              </ul>
            </CardContent>
          </Card>

           <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>Disclaimer</AlertTitle>
              <AlertDescription>
                This AI-generated advice is for informational purposes only and is not a substitute for professional medical advice. Always consult with a qualified healthcare provider for any health concerns.
              </AlertDescription>
            </Alert>
        </div>
      )}
    </div>
  );
}
