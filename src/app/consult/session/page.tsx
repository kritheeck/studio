
"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  User,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import type { Doctor } from "../page";

// Mock doctors data needs to be available here too
const doctors = [
  {
    id: "d1",
    name: "Dr. Emily Carter",
    specialty: "Cardiologist",
    image: PlaceHolderImages.find((img) => img.id === "doctor-1"),
  },
  {
    id: "d2",
    name: "Dr. Ben Adams",
    specialty: "Pediatrician",
    image: PlaceHolderImages.find((img) => img.id === "doctor-2"),
  },
  {
    id: "d3",
    name: "Dr. Sophia Chen",
    specialty: "Dermatologist",
    image: PlaceHolderImages.find((img) => img.id === "doctor-3"),
  },
];

function SessionPageClient() {
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const searchParams = useSearchParams();
    const router = useRouter();
    const { toast } = useToast();

    const doctorId = searchParams.get("doctor");
    const doctor = doctors.find((d) => d.id === doctorId);

    useEffect(() => {
        if (!doctor) {
            router.push('/consult');
            return;
        }

        const getCameraPermission = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setHasCameraPermission(true);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error("Error accessing camera:", error);
                setHasCameraPermission(false);
                toast({
                    variant: "destructive",
                    title: "Camera Access Denied",
                    description: "Please enable camera permissions in your browser settings to join the call.",
                });
            }
        };
        getCameraPermission();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        }
    }, [doctor, router, toast]);

    const handleEndCall = () => {
        toast({
            title: "Call Ended",
            description: "Your consultation has ended.",
        });
        router.push("/dashboard");
    };
    
    useEffect(() => {
        if (videoRef.current && videoRef.current.srcObject) {
             const stream = videoRef.current.srcObject as MediaStream;
             stream.getVideoTracks().forEach(track => track.enabled = !isVideoOff);
             stream.getAudioTracks().forEach(track => track.enabled = !isMuted);
        }
    }, [isVideoOff, isMuted])


    if (!doctor) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    return (
        <div className="flex flex-col h-[calc(100vh-10rem)]">
            <h2 className="text-2xl font-bold mb-4">Consultation with {doctor.name}</h2>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="relative overflow-hidden">
                    <CardContent className="p-0 h-full">
                         <Avatar className="absolute top-4 left-4 z-10 h-16 w-16 border-2 border-white">
                           {doctor.image && <AvatarImage src={doctor.image.imageUrl} alt={doctor.image.description} data-ai-hint={doctor.image.imageHint} />}
                           <AvatarFallback><User/></AvatarFallback>
                        </Avatar>
                        <div className="h-full w-full bg-slate-900 flex items-center justify-center">
                            <p className="text-white font-semibold">Doctor's Video Feed (Simulation)</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="overflow-hidden bg-background">
                    <CardContent className="p-0 h-full relative">
                        {hasCameraPermission === false && (
                             <Alert variant="destructive" className="absolute top-4 left-4 right-4 z-20">
                              <AlertCircle className="h-4 w-4" />
                              <AlertTitle>Camera Access Required</AlertTitle>
                              <AlertDescription>
                                Please allow camera access to use this feature.
                              </AlertDescription>
                            </Alert>
                        )}
                         <video ref={videoRef} className="h-full w-full object-cover" autoPlay muted playsInline />
                         {isVideoOff && (
                             <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                                 <Avatar className="h-24 w-24">
                                     <AvatarFallback><User className="h-12 w-12" /></AvatarFallback>
                                 </Avatar>
                             </div>
                         )}
                    </CardContent>
                </Card>
            </div>
            <div className="flex justify-center items-center gap-4 mt-4 p-4 bg-card rounded-lg shadow-md">
                 <Button variant={isMuted ? "destructive" : "secondary"} size="icon" className="rounded-full h-14 w-14" onClick={() => setIsMuted(!isMuted)}>
                    {isMuted ? <MicOff /> : <Mic />}
                 </Button>
                 <Button variant={isVideoOff ? "destructive" : "secondary"} size="icon" className="rounded-full h-14 w-14" onClick={() => setIsVideoOff(!isVideoOff)}>
                    {isVideoOff ? <VideoOff /> : <Video />}
                 </Button>
                 <Button variant="destructive" size="icon" className="rounded-full h-14 w-14" onClick={handleEndCall}>
                    <PhoneOff />
                 </Button>
            </div>
        </div>
    )
}

export default function SessionPage() {
    return (
        <AppShell>
             <Suspense fallback={<div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
                <SessionPageClient />
            </Suspense>
        </AppShell>
    )
}

    