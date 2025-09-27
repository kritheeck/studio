'use server';

/**
 * @fileOverview AI flow to validate a prescription.
 *
 * - validatePrescription - Validates prescription data.
 * - PrescriptionValidationInput - Input type for validatePrescription.
 * - PrescriptionValidationOutput - Output type for validatePrescription.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PrescriptionValidationInputSchema = z.object({
  prescriptionText: z.string().describe('The plain text of the prescription to be validated.'),
});
export type PrescriptionValidationInput = z.infer<
  typeof PrescriptionValidationInputSchema
>;

const PrescriptionValidationOutputSchema = z.object({
  isSafe: z.boolean().describe('Whether the prescription is deemed safe or not.'),
  reason: z.string().describe('A brief explanation for the validation outcome.'),
});
export type PrescriptionValidationOutput = z.infer<
  typeof PrescriptionValidationOutputSchema
>;

export async function validatePrescription(
  input: PrescriptionValidationInput
): Promise<PrescriptionValidationOutput> {
  return prescriptionValidationFlow(input);
}

const validationPrompt = ai.definePrompt({
  name: 'prescriptionValidationPrompt',
  input: {schema: PrescriptionValidationInputSchema},
  output: {schema: PrescriptionValidationOutputSchema},
  prompt: `You are a prescription validation AI. Your task is to determine if a given prescription is safe based on the details provided.
Analyze the following prescription text:
"{{{prescriptionText}}}"

Based on common medical standards, flag any obvious and severe errors, such as extremely high dosages for common medications, dangerous combinations if multiple drugs are listed, or non-sensical frequencies. You do not have patient history; base your assessment only on the provided text. For most standard prescriptions, you should deem it safe. Only flag high-risk or clearly erroneous entries.

Is this prescription safe? Provide a reason for your decision.
`,
});

const prescriptionValidationFlow = ai.defineFlow(
  {
    name: 'prescriptionValidationFlow',
    inputSchema: PrescriptionValidationInputSchema,
    outputSchema: PrescriptionValidationOutputSchema,
  },
  async input => {
    const {output} = await validationPrompt(input);
    return output!;
  }
);
