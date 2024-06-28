import { SuiClient } from "@mysten/sui.js/dist/cjs/client";
import { balance } from "../pages/HomePage";

export default function requeryAccount(
  client: SuiClient,
  senderAddress: string,
  setSuiNumber: (value: React.SetStateAction<number>) => void,
  receiverAddress?: string,
  setReceiverNumber?: (value: React.SetStateAction<number>) => void
) {
  const timeout = setTimeout(async () => {
    const suiSenderAfterAgain = await client.getBalance({
      owner: senderAddress,
    });
    setSuiNumber(balance(suiSenderAfterAgain));
    if (
      receiverAddress !== null &&
      receiverAddress !== undefined &&
      setReceiverNumber !== undefined
    ) {
      const suiReceiverAfterAgain = await client.getBalance({
        owner: receiverAddress,
      });
      setReceiverNumber(balance(suiReceiverAfterAgain));
    }
  }, 200);
  return () => clearTimeout(timeout);
}
