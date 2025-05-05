import { requireAdmin } from "@/lib/auth-guard";
import AddUser from "./add-user";

const AddUserPage = async () => {
  await requireAdmin();
  return <AddUser />;
};

export default AddUserPage;
