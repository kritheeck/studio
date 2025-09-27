'use server';

/**
 * @fileOverview AI flow to get information about a medication.
 *
 * - getMedicationInfo - Fetches warnings and side effects for a given medication.
 * - MedicationInfoInput - Input type for getMedicationInfo.
 * - MedicationInfoOutput - Output type for getMedicationInfo.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MedicationInfoInputSchema = z.object({
  medicationName: z.string().describe('The name of the medication.'),
});
export type MedicationInfoInput = z.infer<typeof MedicationInfoInputSchema>;

const MedicationInfoOutputSchema = z.object({
  allergyWarning: z
    .string()
    .describe('A critical warning for individuals with specific allergies. Start with "Do not consume if...".'),
  sideEffects: z
    .string()
    .describe('A summary of potential common side effects.'),
});
export type MedicationInfoOutput = z.infer<typeof MedicationInfoOutputSchema>;

export async function getMedicationInfo(
  input: MedicationInfoInput
): Promise<MedicationInfoOutput> {
  return medicationInfoFlow(input);
}

const medicationInfoPrompt = ai.definePrompt({
  name: 'medicationInfoPrompt',
  input: {schema: MedicationInfoInputSchema},
  output: {schema: MedicationInfoOutputSchema},
  prompt: `You are a pharmacist providing critical safety information about a medication.

  For the medication "{{medicationName}}", provide:
  1. A concise but serious allergy warning. It should clearly state contraindications for people with specific allergies.
  2. A brief summary of the most common potential side effects.
  `,
});

const medicationInfoFlow = ai.defineFlow(
  {
    name: 'medicationInfoFlow',
    inputSchema: MedicationInfoInputSchema,
    outputSchema: MedicationInfoOutputSchema,
  },
  async input => {
    const {output} = await medicationInfoPrompt(input);
    return output!;
  }
);
