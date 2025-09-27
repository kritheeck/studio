'use server';

/**
 * @fileOverview AI-powered prescription analysis and summarization flow.
 *
 * - analyzePrescription - Analyzes and summarizes prescription information.
 * - AnalyzePrescriptionInput - Input type for analyzePrescription.
 * - AnalyzePrescriptionOutput - Output type for analyzePrescription.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePrescriptionInputSchema = z.object({
  prescriptionDataUri: z
    .string()
    .describe(
      "A prescription file (image or PDF) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzePrescriptionInput = z.infer<typeof AnalyzePrescriptionInputSchema>;

const AnalyzePrescriptionOutputSchema = z.object({
  summary: z.string().describe('A summarized overview of the prescription information.'),
  drugInteractions: z
    .string()
    .optional()
    .describe('Potential drug interactions flagged by AI, if any.'),
  dosageConcerns: z
    .string()
    .optional()
    .describe('Dosage concerns flagged by AI, if any.'),
});
export type AnalyzePrescriptionOutput = z.infer<typeof AnalyzePrescriptionOutputSchema>;

export async function analyzePrescription(
  input: AnalyzePrescriptionInput
): Promise<AnalyzePrescriptionOutput> {
  return analyzePrescriptionFlow(input);
}

const analyzePrescriptionPrompt = ai.definePrompt({
  name: 'analyzePrescriptionPrompt',
  input: {schema: AnalyzePrescriptionInputSchema},
  output: {schema: AnalyzePrescriptionOutputSchema},
  prompt: `You are a medical expert analyzing a prescription.

  Provide a summarized overview of the medication information. Identify and flag any potential drug interactions and dosage concerns.

  Analyze the following prescription:
  {{media url=prescriptionDataUri}}
  `,
});

const analyzePrescriptionFlow = ai.defineFlow(
  {
    name: 'analyzePrescriptionFlow',
    inputSchema: AnalyzePrescriptionInputSchema,
    outputSchema: AnalyzePrescriptionOutputSchema,
  },
  async input => {
    const {output} = await analyzePrescriptionPrompt(input);
    return output!;
  }
);
