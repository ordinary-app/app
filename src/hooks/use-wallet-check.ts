import { useAccount } from "wagmi";
import { toast } from "sonner";

export const useWalletCheck = () => {
  const { isConnected } = useAccount();

  const checkWalletConnection = (action: string = "此操作") => {
    if (!isConnected) {
      toast.error(`请先登录以${action}`);
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