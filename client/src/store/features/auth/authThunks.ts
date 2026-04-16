import {createAsyncThunk} from '@reduxjs/toolkit'
import { getCurrentUser } from "@/lib/auth-api";

export type AuthUser = {
  name: string | null;
  email: string | null;
  avatar: string | null;
  credits: number|null;
  plans: string|null;
};

export const rehydrateAuth = createAsyncThunk<AuthUser, void, { rejectValue: void }>(
    "auth/rehydrateAuth",
    async () => {
      const user = await getCurrentUser();
      return {
        name: user?.name ?? null,
        email: user?.email ?? null,
        avatar: user?.avatar ?? null,
        credits: user?.credits ?? null,
        plans: user?.plans ?? null,
      };
    }
  );