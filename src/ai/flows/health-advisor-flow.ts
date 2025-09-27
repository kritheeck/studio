'use server';

/**
 * @fileOverview AI flow to provide health advice based on symptoms.
 *
 * - getHealthAdvice - Fetches medications, dietary advice, and lifestyle tips.
 * - HealthAdvisorInput - Input type for getHealthAdvice.
 * - HealthAdvisorOutput - Output type for getHealthAdvice.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HealthAdvisorInputSchema = z.object({
  symptoms: z.string().describe("A description of symptoms, possibly from a doctor's notes."),
});
export type HealthAdvisorInput = z.infer<typeof HealthAdvisorInputSchema>;

const MedicationSuggestionSchema = z.object({
  name: z.string().describe('The name of the suggested medication.'),
  reason: z.string().describe('The reason for suggesting this medication.'),
});

const HealthAdvisorOutputSchema = z.object({
  medications: z
    .array(MedicationSuggestionSchema)
    .describe('A list of suggested over-the-counter or prescription medications.'),
  foodsToEat: z
    .array(z.string())
    .describe('A list of recommended foods to eat to help with the symptoms.'),
  foodsToAvoid: z
    .array(z.string())
    .describe('A list of foods to avoid.'),
  lifestyleAdvice: z
    .array(z.string())
    .describe('A list of general lifestyle advice to improve the condition.'),
});
export type HealthAdvisorOutput = z.infer<typeof HealthAdvisorOutputSchema>;

export async function getHealthAdvice(
  input: HealthAdvisorInput
): Promise<HealthAdvisorOutput> {
  return healthAdvisorFlow(input);
}

const healthAdvisorPrompt = ai.definePrompt({
  name: 'healthAdvisorPrompt',
  input: {schema: HealthAdvisorInputSchema},
  output: {schema: HealthAdvisorOutputSchema},
  prompt: `You are an AI Health Advisor. Based on the following symptoms, provide a list of potential over-the-counter medications, dietary recommendations (foods to eat and foods to avoid), and general lifestyle advice.

  IMPORTANT: Include a disclaimer that this is not a substitute for professional medical advice.

  Symptoms:
  "{{{symptoms}}}"
  `,
});

const healthAdvisorFlow = ai.defineFlow(
  {
    name: 'healthAdvisorFlow',
    inputSchema: HealthAdvisorInputSchema,
    outputSchema: HealthAdvisorOutputSchema,
  },
  async input => {
    const llmResponse = await ai.generate({
      model: 'googleai/gemini-pro',
      prompt: healthAdvisorPrompt.compile({input}),
      output: {schema: HealthAdvisorOutputSchema},
    });
    return llmResponse.output!;
  }
);
