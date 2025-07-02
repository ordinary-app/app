import { PublicClient, testnet } from "@lens-protocol/client";
import { fragments } from "@/fragments";
// Create client without passing any custom fragments to avoid duplicate fragment errors
export const client = PublicClient.create({
  environment: testnet,
  fragments: [],
});



export const getPublicClient = () => {
  return client;
};

export const getLensClient = async () => {
  const resumed = await client.resumeSession();
  if (resumed.isErr()) {
    return client;
  }

  return resumed.value;
};
