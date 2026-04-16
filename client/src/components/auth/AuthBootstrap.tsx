"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { rehydrateAuth } from "@/store/features/auth/authThunks";

export default function AuthBootstrap({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(rehydrateAuth());
  }, [dispatch]);

  return <>{children}</>;
}