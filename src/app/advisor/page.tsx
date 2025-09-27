import { AppShell } from "@/components/app-shell";
import { AdvisorClient } from "./advisor-client";

export default function AdvisorPage() {
  return (
    <AppShell>
      <AdvisorClient />
    </AppShell>
  );
}
