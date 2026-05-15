"use client";

import { Suspense } from "react";
import s from "./Profile.module.scss";

interface ProfileData {
  name: string;
  contactPhone?: string | null;
  role: string;
}

export const Profile = ({ profileData }: { profileData: ProfileData }) => {
  return (
    <Suspense>
      <div className="mx-auto mt-4">
        <div>Имя: {profileData.name}</div>
        <div>Телефон: {profileData.contactPhone}</div>
        <div>Роль: {profileData.role}</div>
      </div>
    </Suspense>
  );
}