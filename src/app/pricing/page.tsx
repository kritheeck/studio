"use client";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";

const priceData = [
  { pharmacy: "MediCare Pharmacy", price: "$15.99", stock: "In Stock" },
  { pharmacy: "The Drug Store", price: "$17.50", stock: "In Stock" },
  { pharmacy: "HealthFirst Pharma", price: "$14.75", stock: "Low Stock" },
  { pharmacy: "City General Pharmacy", price: "$18.20", stock: "Out of Stock" },
];

export default function PricingPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Medication Price Comparison</h2>
          <p className="text-muted-foreground">Find the best prices for your medication from local pharmacies.</p>
        </div>
        <div className="flex w-full max-w-lg items-center space-x-2">
          <Input type="text" placeholder="e.g., Atorvastatin 20mg" />
          <Button type="submit" onClick={(e) => e.preventDefault()}>
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pharmacy</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {priceData.map((item) => (
                <TableRow key={item.pharmacy}>
                  <TableCell className="font-medium">{item.pharmacy}</TableCell>
                  <TableCell className="font-semibold">{item.price}</TableCell>
                  <TableCell>{item.stock}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" disabled={item.stock === "Out of Stock"}>
                      Select
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="text-sm text-muted-foreground text-center">Note: This is a placeholder UI. The Medication Price Comparison API is not integrated.</p>
      </div>
    </AppShell>
  );
}
