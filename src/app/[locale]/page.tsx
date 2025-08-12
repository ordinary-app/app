"use client";

import { Button } from "@/components/ui/button";
import { Edit, Users, Shield, Heart, Coins, UserCheck } from "lucide-react";
import { ConnectKitButton } from "connectkit";
import { useLensAuthStore } from "@/stores/auth-store";
import { useAccount, useDisconnect } from "wagmi";
import { useEffect } from "react";
import { Suspense } from "react";
import { LandingSection } from "@/components/home/landing-section";
import { DetailSection } from "@/components/home/detail-section";
import { Loading } from "@/components/loading";

export default function HomePage() {
  const { currentProfile, loading } = useLensAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main>
        <LandingSection />
        <Suspense fallback={<Loading />}>
          <DetailSection />
        </Suspense>
      </main>
    </div>
  );
}
