'use server';

/**
 * @fileOverview An AI flow to generate mock medication prices.
 *
 * - getMedicationPrices - Fetches a list of mock prices for a given medication.
 * - MedicationPricingInput - The input type for the getMedicationPrices function.
 * - MedicationPrice - The type for a single medication price entry.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MedicationPricingInputSchema = z.object({
  medicationName: z.string().describe('The name of the medication to price.'),
});
export type MedicationPricingInput = z.infer<typeof MedicationPricingInputSchema>;

const MedicationPriceSchema = z.object({
  name: z.string().describe('The full name of the medication, including dosage.'),
  pharmacy: z.string().describe('The name of the fictional pharmacy.'),
  price: z.number().describe('The price of the medication.'),
  stock: z.enum(['In Stock', 'Low Stock', 'Out of Stock']).describe('The stock status.'),
});
export type MedicationPrice = z.infer<typeof MedicationPriceSchema>;

const MedicationPricingOutputSchema = z.array(MedicationPriceSchema);

export async function getMedicationPrices(
  input: MedicationPricingInput
): Promise<MedicationPrice[]> {
  return medicationPricingFlow(input);
}

const pricingPrompt = ai.definePrompt({
  name: 'medicationPricingPrompt',
  input: { schema: MedicationPricingInputSchema },
  output: { schema: MedicationPricingOutputSchema },
  prompt: `You are a mock pharmacy price data generator.
For the medication "{{medicationName}}", generate a list of 3-5 realistic but fictional price listings from different fictional pharmacy names.
The medication name in the output should be exactly "{{medicationName}}".
Ensure prices are reasonable and vary between pharmacies.
Set the stock status for each. Make at least one "In Stock".
`,
});

const medicationPricingFlow = ai.defineFlow(
  {
    name: 'medicationPricingFlow',
    inputSchema: MedicationPricingInputSchema,
    outputSchema: MedicationPricingOutputSchema,
  },
  async (input) => {
    const { output } = await pricingPrompt(input);
    return output || [];
  }
);
