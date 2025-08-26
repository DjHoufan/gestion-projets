import { GetUserCookies } from "@/core/hooks/use-get-user-cookies";
import { ProfileBody } from "@/core/view/profile/profile-body";
import React from "react";

const Profile = async () => {
  const currentUser = await GetUserCookies();
  return <ProfileBody Id={currentUser.id} />;
};

export default Profile;
