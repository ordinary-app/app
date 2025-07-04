"use client";

import { useProfileSelectStore } from "@/stores/profile-select-store";
import { SelectAccountMenu } from "@/components/auth/account-select-menu";

export const GlobalModals = () => {
  const { setProfileSelectModalOpen, isProfileSelectModalOpen } = useProfileSelectStore();

  return <SelectAccountMenu open={isProfileSelectModalOpen} onOpenChange={setProfileSelectModalOpen} />;
};
