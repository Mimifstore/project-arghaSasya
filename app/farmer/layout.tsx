import { FarmerStage } from "@/components/FarmerStage";
import { FarmerTabs } from "@/components/farmer/FarmerTabs";

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
  return (
    <FarmerStage>
      <div className="flex min-h-full flex-col">
        <div className="flex-1 px-4 pb-4 pt-2">{children}</div>
        <FarmerTabs />
      </div>
    </FarmerStage>
  );
}
