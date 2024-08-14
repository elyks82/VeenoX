import { useAccount as useOrderlyAccount } from "@orderly.network/hooks";
import React, { useEffect } from "react";
import {
  Connector,
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from "wagmi";

export function WalletOptions() {
  const { connectors, connect } = useConnect();
  const { address, connector, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });
  const { account, state } = useOrderlyAccount();

  const statusChangeHandler = (nextState: any) => {
    console.log("nextState", nextState);
    console.log("nextState", account);
    console.log("nextState", state);
  };

  useEffect(() => {
    account.on("change:status", statusChangeHandler);

    return () => {
      account.off("change:status", statusChangeHandler);
    };
  }, []);

  return (
    <>
      {connectors.map((connector) => (
        <WalletOption
          key={connector.uid}
          connector={connector}
          onClick={() => {
            connect({ connector });
          }}
        />
      ))}
    </>
  );
}

function WalletOption({
  connector,
  onClick,
}: {
  connector: Connector;
  onClick: () => void;
}) {
  const [ready, setReady] = React.useState(false);
  const { address, chainId } = useAccount();
  const { account, state, createOrderlyKey, createAccount } =
    useOrderlyAccount();
  const handleConnection = async () => {
    try {
      // Vous devez vous assurer que le client de portefeuille est initialisé

      // Passer le walletClient au SDK Orderly
      const res = await createAccount();
      console.log("res", res);

      const orderCreateKey = await createOrderlyKey(false);
      console.log("orderCreateKey", orderCreateKey);
    } catch (e) {
      console.log("I got error: ", e);
    }
  };

  React.useEffect(() => {
    (async () => {
      const provider = await connector.getProvider();
      console.log("state", state);
      setReady(!!provider);
    })();
  }, [connector]);

  return (
    <button
      className="text-white bg-blue-700 px-4"
      disabled={!ready}
      onClick={async () => {
        onClick();
        await handleConnection();
      }}
    >
      {connector.name}
    </button>
  );
}
