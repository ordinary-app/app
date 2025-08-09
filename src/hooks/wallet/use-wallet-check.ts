import { useAccount } from "wagmi";
import { toast } from "sonner";
import { useReconnectWallet } from "./use-reconnect-wallet";

export const useWalletCheck = () => {
  const { isConnected } = useAccount();
  const reconnectWallet = useReconnectWallet();

  const checkWalletConnection = (action: string = "此操作") => {
    if (!isConnected) {
      reconnectWallet();
      toast.info(`请连接地址进行 ${action} 操作`);
      return false;
    }
    return true;
  };

  return {
    isConnected,
    checkWalletConnection,
  };
}; 