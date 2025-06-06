import { io } from "socket.io-client";
import { socketUrl } from "./utils/data/urls";

// "undefined" means the URL will be computed from the `window.location` object
const URL = socketUrl;

export const getSocket = (userId: string, token: string) => {
  return io(URL, {
    query: { userId: userId ? userId : "" }, // Pass user ID as query parameter
    // path: '/socket.io',
    reconnectionAttempts: 5,     // Attempt to reconnect 5 times
    reconnectionDelay: 2000,
    extraHeaders: {
      authorization: token
    }
  });
};
