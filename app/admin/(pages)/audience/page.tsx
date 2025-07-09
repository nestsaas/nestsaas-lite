import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { DashboardHeader } from "@/components/dashboard/header";
import { AudienceTable } from "./components/audience-table";
import { getAudience } from "@/app/admin/actions/audience-actions";

export default async function AudiencePage() {
  const audience = await getAudience();

  return (
    <div className="space-y-6 p-4">
      <DashboardHeader
        heading="Audience Management"
        text="Manage your audience and send newsletters to them."
      />

      <div className="py-10">
        <AudienceTable data={audience} />
      </div>
    </div>
  );
}
