import { FarmerOfferForm } from "@/components/FarmerOfferForm";
import { FarmerStage } from "@/components/FarmerStage";
import { farmerBoard } from "@/data/dummy";

export default function NewOfferPage({ searchParams }: { searchParams: { permintaan?: string } }) {
  const r = farmerBoard.find((x) => x.id === searchParams.permintaan) ?? farmerBoard[0];
  return (
    <FarmerStage>
      <FarmerOfferForm request={r} />
    </FarmerStage>
  );
}
