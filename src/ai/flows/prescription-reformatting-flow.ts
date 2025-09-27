'use server';

/**
 * @fileOverview AI flow to reformat a structured prescription into a patient-friendly text format.
 *
 * - reformatPrescription - Converts prescription data to a readable string.
 * - PrescriptionReformattingInput - Input type for reformatPrescription.
 * - PrescriptionReformattingOutput - Output type for reformatPrescription.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const PrescriptionReformattingInputSchema = z.object({
  patientId: z.string().describe("The patient's identifier (to be removed)."),
  doctorId: z.string().describe("The prescribing doctor's identifier (to be removed)."),
  patientName: z.string().describe("The patient's full name."),
  prescriptionDetails: z
    .string()
    .describe(
      'A JSON string with prescription details, e.g., { "medication": "Lisinopril", "dosage": "10mg", "frequency": "once daily" }'
    ),
});
export type PrescriptionReformattingInput = z.infer<
  typeof PrescriptionReformattingInputSchema
>;

export const PrescriptionReformattingOutputSchema = z.object({
  reformattedText: z.string().describe('The plain text, patient-friendly version of the prescription.'),
});
export type PrescriptionReformattingOutput = z.infer<
  typeof PrescriptionReformattingOutputSchema
>;

export async function reformatPrescription(
  input: PrescriptionReformattingInput
): Promise<PrescriptionReformattingOutput> {
  return prescriptionReformattingFlow(input);
}

const reformattingPrompt = ai.definePrompt({
  name: 'prescriptionReformattingPrompt',
  input: {schema: PrescriptionReformattingInputSchema},
  output: {schema: PrescriptionReformattingOutputSchema},
  prompt: `You are an expert medical document translator specializing in prescription reformatting. Your task is to convert the entire prescription from its structured format to plain, conversational text.

Instructions:
1.  Completely omit the patient identification number (Patient ID).
2.  Completely remove the doctor identification code (Doctor ID).
3.  Ensure all medication details, dosage instructions, and prescription specifics from the JSON remain intact.
4.  Format the text in a clear, easy-to-read manner that a patient can easily understand. Use the patient's name.

Prescription Data:
- Patient Name: {{{patientName}}}
- Patient ID: {{{patientId}}}
- Doctor ID: {{{doctorId}}}
- Details (JSON): {{{prescriptionDetails}}}
`,
});

const prescriptionReformattingFlow = ai.defineFlow(
  {
    name: 'prescriptionReformattingFlow',
    inputSchema: PrescriptionReformattingInputSchema,
    outputSchema: PrescriptionReformattingOutputSchema,
  },
  async input => {
    const {output} = await reformattingPrompt(input);
    return output!;
  }
);
