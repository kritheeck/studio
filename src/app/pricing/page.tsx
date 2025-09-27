"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Search, PlusCircle, AlertTriangle, Loader2, Info, ShoppingCart, Trash2 } from "lucide-react";
import { getMedicationInfo, MedicationInfoOutput } from "@/ai/flows/medication-info-flow";
import { useToast } from "@/hooks/use-toast";

// Mock data for medication pricing
const allMedications = [
  { id: 1, name: "Atorvastatin 20mg", pharmacy: "MediCare Pharmacy", price: 15.99, stock: "In Stock" },
  { id: 2, name: "Atorvastatin 20mg", pharmacy: "The Drug Store", price: 17.50, stock: "In Stock" },
  { id: 3, name: "Lisinopril 10mg", pharmacy: "MediCare Pharmacy", price: 12.50, stock: "In Stock" },
  { id: 4, name: "Lisinopril 10mg", pharmacy: "HealthFirst Pharma", price: 11.95, stock: "Low Stock" },
  { id: 5, name: "Metformin 500mg", pharmacy: "City General Pharmacy", price: 8.20, stock: "In Stock" },
  { id: 6, name: "Metformin 500mg", pharmacy: "The Drug Store", price: 9.00, stock: "Out of Stock" },
  { id: 7, name: "Amlodipine 5mg", pharmacy: "MediCare Pharmacy", price: 14.30, stock: "In Stock" },
  { id: 8, name: "Amoxicillin 250mg", pharmacy: "HealthFirst Pharma", price: 22.00, stock: "In Stock" },
];

type Medication = typeof allMedications[0];

export default function PricingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Medication[]>([]);
  const [bill, setBill] = useState<Medication[]>([]);
  const [selectedMedInfo, setSelectedMedInfo] = useState<MedicationInfoOutput | null>(null);
  const [isInfoLoading, setIsInfoLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const results = allMedications.filter(med =>
      med.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
  };

  const addToBill = (med: Medication) => {
    setBill(prevBill => [...prevBill, med]);
    toast({
        title: "Added to Bill",
        description: `${med.name} from ${med.pharmacy} has been added.`
    })
  };

  const removeFromBill = (medId: number) => {
    setBill(prevBill => prevBill.filter(item => item.id !== medId));
  }

  const handleGetInfo = async (medName: string) => {
    setSelectedMedInfo(null);
    setIsDialogOpen(true);
    setIsInfoLoading(true);
    try {
      const result = await getMedicationInfo({ medicationName: medName });
      setSelectedMedInfo(result);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
       toast({
        title: "Failed to get info",
        description: "There was a problem fetching medication details. " + errorMessage,
        variant: "destructive",
      });
      setIsDialogOpen(false);
    } finally {
      setIsInfoLoading(false);
    }
  };

  const totalCost = bill.reduce((total, item) => total + item.price, 0).toFixed(2);

  return (
    <AppShell>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Medication Price Comparison</CardTitle>
                    <CardDescription>Find the best prices for your medication from local pharmacies.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSearch} className="flex w-full max-w-lg items-center space-x-2">
                        <Input 
                            type="text" 
                            placeholder="e.g., Atorvastatin 20mg"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                         />
                        <Button type="submit">
                            <Search className="mr-2 h-4 w-4" /> Search
                        </Button>
                    </form>
                </CardContent>
            </Card>

          {searchResults.length > 0 && (
             <Card>
                <CardHeader>
                    <CardTitle>Search Results</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                            <TableRow>
                                <TableHead>Medication</TableHead>
                                <TableHead>Pharmacy</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Availability</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {searchResults.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>{item.pharmacy}</TableCell>
                                    <TableCell className="font-semibold">${item.price.toFixed(2)}</TableCell>
                                    <TableCell>{item.stock}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                         <Button variant="outline" size="sm" onClick={() => handleGetInfo(item.name)}>
                                            <Info className="h-4 w-4" />
                                            <span className="sr-only">Info</span>
                                        </Button>
                                        <Button 
                                            variant="default" 
                                            size="sm" 
                                            disabled={item.stock === "Out of Stock"}
                                            onClick={() => addToBill(item)}
                                        >
                                            <PlusCircle className="h-4 w-4" />
                                             <span className="sr-only">Add</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </div>
                 </CardContent>
             </Card>
          )}
        </div>

        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                    <ShoppingCart className="h-6 w-6" />
                    <CardTitle>Your Bill</CardTitle>
                </CardHeader>
                <CardContent>
                    {bill.length === 0 ? (
                        <p className="text-muted-foreground">Your bill is empty. Add medications from the search results.</p>
                    ) : (
                         <div className="space-y-4">
                            {bill.map((item, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-sm text-muted-foreground">{item.pharmacy}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <p className="font-semibold">${item.price.toFixed(2)}</p>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeFromBill(item.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
                {bill.length > 0 && (
                    <CardFooter className="flex justify-between items-center font-bold text-lg border-t pt-4 mt-4">
                        <span>Total</span>
                        <span>${totalCost}</span>
                    </CardFooter>
                )}
            </Card>
        </div>
      </div>
      
       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Medication Information</DialogTitle>
          </DialogHeader>
          {isInfoLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : selectedMedInfo ? (
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Allergy Warning</AlertTitle>
                <AlertDescription>
                  {selectedMedInfo.allergyWarning}
                </AlertDescription>
              </Alert>
              <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Potential Side Effects</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        {selectedMedInfo.sideEffects}
                    </p>
                </CardContent>
              </Card>
            </div>
          ) : (
             <p className="py-4">No information available.</p>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
