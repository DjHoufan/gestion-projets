"use server";
import { createActionServer } from "@/core/supabase/actions";
 
export const useCurrentUser = async () => {
  const supabase = await createActionServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
};


export const getCurrentUser = async () => {
  const supabase = await createActionServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
};
