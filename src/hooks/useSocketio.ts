import { socket } from "@/func/socket";
import { useEffect, useState } from "react";

const useSocketIo = ({ topic }: { topic: string }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  const [lastMessage, setLastMessage] = useState<{
    command: string;
    value: number;
  }>();

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onMessageEvent(value: string) {
      try {
        const parsed = JSON.parse(value);

        if (parsed.message) {
          const [command, value] = parsed.message.split(",");
          const valueParsed = parseInt(value);
          if (!isNaN(valueParsed)) {
            setLastMessage({ command, value: valueParsed });
          }
        }
      } catch (e) {
        console.log("parsing error", e);
      }
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on(topic, onMessageEvent);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off(topic, onMessageEvent);
    };
  }, []);

  return { isConnected, lastMessage };
};

export default useSocketIo;
