import { toast } from "sonner";
import { useLensAuthStore } from "@/stores/auth-store";
import { useReconnectWallet } from "@/hooks/auth/use-reconnect-wallet";

export const useAuthCheck = () => {
  const { currentProfile, sessionClient, loading } = useLensAuthStore();
  const reconnectWallet = useReconnectWallet();

  // 完全认证判定：profile + sessionClient
  const isAuthenticated = !!currentProfile && !!sessionClient && !loading;
  
  const checkAuthentication = (action: string = "此操作") => {
    if (loading) {
      toast.info("正在加载认证状态，请稍候...");
      return false;
    }

    if (!currentProfile || !sessionClient) {
      reconnectWallet();
      toast.info(`Please connect and select a Profile to ${action}`);
      return false;
    }
    
    return true;
  };

  return {
    isAuthenticated,
    checkAuthentication,
    currentProfile,
    sessionClient,
    loading,
  };
};
