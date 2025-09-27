import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BadgeCheck, DollarSign, FileScan, MapPin, Sparkles, Video, FilePenLine } from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "Prescription Analysis",
    description: "Upload and analyze your prescriptions using AI.",
    href: "/analysis",
    icon: FileScan,
  },
  {
    title: "Prescription Validation",
    description: "Validate your prescription with healthcare databases.",
    href: "/validation",
    icon: BadgeCheck,
  },
  {
    title: "Doctor Consultation",
    description: "Connect with doctors for virtual consultations.",
    href: "/consult",
    icon: Video,
  },
  {
    title: "Find Services",
    description: "Locate nearby hospitals and pharmacies.",
    href: "/locate",
    icon: MapPin,
  },
  {
    title: "Medication Pricing",
    description: "Compare prices for your medications.",
    href: "/pricing",
    icon: DollarSign,
  },
];

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
          <p className="text-muted-foreground">Here's your personalized health dashboard.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Link href={feature.href} key={feature.title} className="block h-full">
              <Card className="flex h-full flex-col justify-between hover:shadow-lg transition-shadow duration-300 group hover:border-primary">
                <div>
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">
                      {feature.title}
                    </CardTitle>
                    <feature.icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </div>
                <CardContent>
                  <div className="flex items-center text-sm font-medium text-primary group-hover:underline">
                    Proceed <ArrowRight className="ml-1 h-4 w-4"/>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
