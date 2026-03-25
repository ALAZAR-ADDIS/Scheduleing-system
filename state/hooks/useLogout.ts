"use client";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/state/hooks";
import { logout } from "@/state/slices/auth/authSlice";

export function useLogout() {
  const dispatch = useAppDispatch();
  const router   = useRouter();

  return function handleLogout() {
    dispatch(logout());
    router.push("/auth/login");
  };
}
