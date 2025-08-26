"use server";
import { cookies } from "next/headers";
import { RolePermission } from "@/core/lib/types";
 

import CryptoJS from "crypto-js";

export const useGetUserCookies = async () => {
  let rolePermission: RolePermission | null = null;

  const token_acces = (await cookies()).get(process.env.AUTH_COOKIE_ACCESS!);


  if (token_acces?.value !== undefined) {
    const bytes = CryptoJS.AES.decrypt(
      token_acces?.value,
      process.env.NEXT_SECRET_KEY!
    );
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

    rolePermission = JSON.parse(decryptedText);
  }

  return rolePermission!;
};


export const GetUserCookies = async () => {
  let rolePermission: RolePermission | null = null;

  const token_acces = (await cookies()).get(process.env.AUTH_COOKIE_ACCESS!);

  if (token_acces?.value !== undefined) {
    const bytes = CryptoJS.AES.decrypt(
      token_acces?.value,
      process.env.NEXT_SECRET_KEY!
    );
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

    rolePermission = JSON.parse(decryptedText);
  }

  return rolePermission!;
};
