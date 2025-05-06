import AdminMap from "@/components/maps/AdminMap";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const MapPage = async () => {
  const session = await auth();

  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "MODERATOR") {
    redirect("/auth/signin");
  }

  return (
    <div className="bg-white-700 mx-auto my-5 w-[98%] h-[500px]">
      <AdminMap />
    </div>
  );
};

export default MapPage;
