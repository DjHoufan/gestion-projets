import { GetUserCookies } from "@/core/hooks/use-get-user-cookies";
import { ProfileBody } from "@/core/view/profile/profile-body";
import React from "react";

// Configuration du cache pour cette page
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const Profile = async () => {
  const currentUser = await GetUserCookies();

  if (!currentUser) {
    throw new Error("User not authenticated");
  }

  return <ProfileBody Id={currentUser.id} />;
};

export default Profile;
