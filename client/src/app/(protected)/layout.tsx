
import { redirect } from "next/navigation";
import React from "react";
import { cookies } from "next/headers";


const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {


   const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    redirect("/login");
  }
  return <>{children}</>;
};

export default ProtectedLayout;