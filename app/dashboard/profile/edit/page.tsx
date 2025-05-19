import React from "react";
import UpdateUserForm from "./UpdateUserForm";
import { getUserById } from "@/lib/user.action";
import { auth } from "@/lib/auth";

const UpdateUserPage = async () => {
  const session = await auth();
  const user = await getUserById(session?.user?.id || "");

  return (
    <>
      <UpdateUserForm user={user} />
    </>
  );
};

export default UpdateUserPage;
