import { useAccount } from "wagmi";
import { toast } from "sonner";
import { useReconnectWallet } from "./use-reconnect-wallet";

export const useWalletCheck = () => {
  const { isConnected } = useAccount();
  const reconnectWallet = useReconnectWallet();

  const checkWalletConnection = (action: string = "此操作") => {
    if (!isConnected) {
      reconnectWallet();
      // toast.error(`重新登录以${action}，请继续操作`);
      return false;
    }
    return true;
  };

  const redirectToConnect = () => {
    toast.error("请先登录");
    // 可以在这里添加重定向逻辑
  };

  return {
    isConnected,
    checkWalletConnection,
    redirectToConnect,
  };
}; 