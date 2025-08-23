import { useReadContract } from 'wagmi';
import { abi } from '@/lib/abi';
import { useAppConfigStore } from '@/stores/app-config-store';
import { sepolia } from 'wagmi/chains';

export const useTokenId = (uri: string | undefined) => {
  const { contractAddress } = useAppConfigStore();

  const { data: tokenId, isLoading, error } = useReadContract({
    address: contractAddress,
    abi,
    functionName: 'TokenId',
    args: uri ? [uri] : undefined,
    chainId: sepolia.id, // sepolia!
    query: {
      enabled: !!uri,
    },
  });

  return {
    tokenId: tokenId ? Number(tokenId) : undefined,
    isLoading,
    error,
  };
}; 