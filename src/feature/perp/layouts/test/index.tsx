import { useWS } from "@orderly.network/hooks";

const TestComponent = () => {
  const ws = useWS();

  return (
    <div>
      {ws ? <p>WebSocket is available!</p> : <p>WebSocket is not available.</p>}
    </div>
  );
};

export default TestComponent;
