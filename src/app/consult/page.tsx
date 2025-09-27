import { AppShell } from "@/components/app-shell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { User } from "lucide-react";

const doctors = [
  {
    name: "Dr. Emily Carter",
    specialty: "Cardiologist",
    status: "Available",
    image: PlaceHolderImages.find(img => img.id === "doctor-1"),
  },
  {
    name: "Dr. Ben Adams",
    specialty: "Pediatrician",
    status: "Available",
    image: PlaceHolderImages.find(img => img.id === "doctor-2"),
  },
  {
    name: "Dr. Sophia Chen",
    specialty: "Dermatologist",
    status: "Busy",
    image: PlaceHolderImages.find(img => img.id === "doctor-3"),
  },
];

export default function ConsultPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Virtual Consultations</h2>
          <p className="text-muted-foreground">Connect with healthcare professionals from the comfort of your home.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => (
            <Card key={doctor.name} className="flex flex-col">
              <CardHeader className="items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  {doctor.image && <AvatarImage src={doctor.image.imageUrl} alt={doctor.image.description} data-ai-hint={doctor.image.imageHint} />}
                  <AvatarFallback><User className="h-12 w-12" /></AvatarFallback>
                </Avatar>
                <CardTitle>{doctor.name}</CardTitle>
                <p className="text-muted-foreground">{doctor.specialty}</p>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow justify-end">
                <div className="flex justify-between items-center mb-4">
                  <span>Status</span>
                  <Badge variant={doctor.status === "Available" ? "default" : "secondary"} className={doctor.status === 'Available' ? 'bg-accent text-accent-foreground' : ''}>
                    {doctor.status}
                  </Badge>
                </div>
                <Button className="w-full" disabled={doctor.status !== "Available"}>
                  Book Consultation
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-sm text-muted-foreground text-center">Note: This is a placeholder UI. The Doctor Consultation API is not integrated.</p>
      </div>
    </AppShell>
  );
}
