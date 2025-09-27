"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Hospital, MapPin, Pill, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from 'next/image';

const hospitalsData = [
  { name: "City General Hospital", address: "123 Health St, Metroville", distance: "2.5 miles" },
  { name: "St. Luke's Medical Center", address: "456 Wellness Ave, Metroville", distance: "4.1 miles" },
];

const pharmaciesData = [
  { name: "MediCare Pharmacy", address: "789 Cure Rd, Metroville", distance: "1.2 miles" },
  { name: "The Drug Store", address: "101 Pharmacy Ln, Metroville", distance: "1.8 miles" },
];

export default function LocatePage() {
  const [isSearching, setIsSearching] = useState(false);
  const [servicesFound, setServicesFound] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleFindServices = () => {
    setIsSearching(true);
    setLocationError(null);
    setServicesFound(false);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Simulate finding services after getting location
          setTimeout(() => {
            setServicesFound(true);
            setIsSearching(false);
          }, 1500);
        },
        (error) => {
          switch(error.code) {
            case error.PERMISSION_DENIED:
              setLocationError("You denied the request for Geolocation.");
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              setLocationError("The request to get user location timed out.");
              break;
            default:
              setLocationError("An unknown error occurred.");
              break;
          }
          setIsSearching(false);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
      setIsSearching(false);
    }
  };


  return (
    <AppShell>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Find Nearby Services</CardTitle>
            <CardDescription>Locate hospitals and pharmacies near you. Click the button to search based on your current location.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleFindServices} disabled={isSearching}>
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                  Searching...
                </>
              ) : (
                <>
                  <MapPin className="mr-2 h-4 w-4"/>
                  Find Services Near Me
                </>
              )}
            </Button>
          </CardContent>
        </Card>
        
        {locationError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{locationError}</AlertDescription>
          </Alert>
        )}

        {servicesFound && (
          <>
            <Card>
                <CardHeader>
                    <CardTitle>Map View</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden border">
                         <Image 
                            src="https://picsum.photos/seed/map/1200/800" 
                            alt="Map of nearby services" 
                            fill
                            style={{ objectFit: 'cover' }}
                            data-ai-hint="map city"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <p className="text-white text-lg font-semibold bg-black/50 px-4 py-2 rounded-md">Map Placeholder</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Hospital className="text-primary"/> Nearby Hospitals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {hospitalsData.map((item, index) => (
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
                   {pharmaciesData.map((item, index) => (
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
          </>
        )}
      </div>
    </AppShell>
  );
}
