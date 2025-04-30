import AdminMap from "@/components/maps/AdminMap";
import { requireAdmin } from "@/lib/auth-guard";

const MapPage = async () => {
  await requireAdmin();

  return (
    <div className="bg-white-700 mx-auto my-5 w-[98%] h-[500px]">
      <AdminMap />
    </div>
  );
};

export default MapPage;
