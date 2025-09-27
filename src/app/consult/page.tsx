"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { User, Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const doctors = [
  {
    id: "d1",
    name: "Dr. Emily Carter",
    specialty: "Cardiologist",
    status: "Available",
    image: PlaceHolderImages.find(img => img.id === "doctor-1"),
    price: 150,
  },
  {
    id: "d2",
    name: "Dr. Ben Adams",
    specialty: "Pediatrician",
    status: "Available",
    image: PlaceHolderImages.find(img => img.id === "doctor-2"),
    price: 120,
  },
  {
    id: "d3",
    name: "Dr. Sophia Chen",
    specialty: "Dermatologist",
    status: "Busy",
    image: PlaceHolderImages.find(img => img.id === "doctor-3"),
    price: 180,
  },
];

const availableTimes = [
  "09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"
];

export type Doctor = (typeof doctors)[0];

export default function ConsultPage() {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleBookingClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setSelectedDate(new Date());
    setSelectedTime(null);
  };

  const handleConfirmBooking = () => {
    if (selectedDoctor && selectedDate && selectedTime) {
      toast({
        title: "Booking Confirmed!",
        description: `Your appointment with ${selectedDoctor.name} is set. You will be redirected to the session.`,
      });
      setSelectedDoctor(null);
      // Redirect to the session page
      router.push(`/consult/session?doctor=${selectedDoctor.id}`);
    }
  };

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
                 <div className="flex justify-between items-center mb-4">
                  <span>Price</span>
                  <p className="font-semibold">${doctor.price} / session</p>
                </div>
                <Button 
                  className="w-full" 
                  disabled={doctor.status !== "Available"}
                  onClick={() => handleBookingClick(doctor)}
                >
                  Book Consultation
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {selectedDoctor && (
        <Dialog open={!!selectedDoctor} onOpenChange={() => setSelectedDoctor(null)}>
          <DialogContent className="sm:max-w-[425px] md:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Book Consultation with {selectedDoctor.name}</DialogTitle>
              <DialogDescription>
                Select a date and time for your appointment. Consultation fee: ${selectedDoctor.price}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="flex justify-center">
                 <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  className="rounded-md border"
                />
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2"><Clock className="h-5 w-5" /> Select a Time Slot</h4>
                <div className="grid grid-cols-2 gap-2">
                  {availableTimes.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
               <div className="w-full text-left text-sm text-muted-foreground">
                {selectedDate && selectedTime && (
                  <p className="font-semibold flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Appointment: {format(selectedDate, "EEE, MMM d, yyyy")} at {selectedTime}
                  </p>
                )}
              </div>
              <Button 
                onClick={handleConfirmBooking}
                disabled={!selectedDate || !selectedTime}
              >
                Confirm Booking & Join
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AppShell>
  );
}

    