import AdminMap from "@/components/maps/AdminMap";
import UserMap from "@/components/maps/UserMap";
import { auth } from "@/lib/auth";

const MapPage = async () => {
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <>
      {isAdmin ? (
        <div className="bg-white-700 mx-auto my-5 w-[98%] h-[500px]">
          <AdminMap />
        </div>
      ) : (
        <div className="bg-black mx-auto overflow-hidden  my-16 w-[98%] h-[540px]">
          <UserMap />
        </div>
      )}
    </>
  );
};

export default MapPage;
