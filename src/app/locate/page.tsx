"use client";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Hospital, MapPin, Pill } from "lucide-react";

const hospitals = [
  { name: "City General Hospital", address: "123 Health St, Metroville", distance: "2.5 miles" },
  { name: "St. Luke's Medical Center", address: "456 Wellness Ave, Metroville", distance: "4.1 miles" },
];

const pharmacies = [
  { name: "MediCare Pharmacy", address: "789 Cure Rd, Metroville", distance: "1.2 miles" },
  { name: "The Drug Store", address: "101 Pharmacy Ln, Metroville", distance: "1.8 miles" },
];

export default function LocatePage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Find Nearby Services</CardTitle>
            <CardDescription>Locate hospitals and pharmacies near you. Click the button to simulate searching based on your location.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={(e) => e.preventDefault()}>
              <MapPin className="mr-2 h-4 w-4"/>
              Find Services Near Me
            </Button>
          </CardContent>
        </Card>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Hospital className="text-primary"/> Nearby Hospitals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {hospitals.map((item, index) => (
                <div key={item.name}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.address}</p>
                    </div>
                    <p className="text-sm font-medium whitespace-nowrap">{item.distance}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Pill className="text-primary"/> Nearby Pharmacies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               {pharmacies.map((item, index) => (
                <div key={item.name}>
                   {index > 0 && <Separator className="my-4" />}
                   <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.address}</p>
                    </div>
                    <p className="text-sm font-medium whitespace-nowrap">{item.distance}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <p className="text-sm text-muted-foreground text-center">Note: This is a placeholder UI. The Geolocation API is not integrated.</p>
      </div>
    </AppShell>
  );
}
