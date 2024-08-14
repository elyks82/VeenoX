import { useAccount as useOrderlyAccount } from "@orderly.network/hooks";
import { useEffect } from "react";
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";

export function Account() {
  const { address, connector, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });
  const { account, state } = useOrderlyAccount();

  const handleConnection = async () => {
    const provider = await connector.getProvider();
    const nextState = await account.setAddress("<address>", {
      provider, // EIP1193Provider, usually window.ethereum
      chain: {
        id: `0x${chainId.toString(16)}`,
      },
      wallet: {
        name: "TESTON?G", // Wallet app name, e.g. MetaMask
      },
    });
  };

  const statusChangeHandler = (nextState: AccountState) => {
    console.log("nextState", nextState);
  };

  useEffect(() => {
    account.on("change:status", statusChangeHandler);

    return () => {
      account.off("change:status", statusChangeHandler);
    };
  }, []);

  return (
    <div className="bg-red text-white">
      {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
      {address && <div>{ensName ? `${ensName} (${address})` : address}</div>}
      <button onClick={() => disconnect()}>Disconnect</button>
    </div>
  );
}
