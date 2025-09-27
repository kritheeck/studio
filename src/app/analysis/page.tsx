import { AppShell } from "@/components/app-shell";
import { AnalysisClient } from "./analysis-client";

export default function AnalysisPage() {
  return (
    <AppShell>
      <AnalysisClient />
    </AppShell>
  );
}
