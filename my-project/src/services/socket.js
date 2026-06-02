import { io } from "socket.io-client";

const SOCKET_URL =
  process.env.REACT_APP_SOCKET_URL ||
  (process.env.REACT_APP_API_URL || "http://localhost:5000/api").replace(
    /\/api\/?$/,
    ""
  );

let socket = null;

export function getSocket() {
  const token = localStorage.getItem("nunap_token");
  if (!token) return null;

  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
    });
  }

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
