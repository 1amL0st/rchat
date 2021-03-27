import { Socket } from './Socket';
import { msgHandler } from './msgHandler';

export const Api = {};

export const InitApi = () => {
  Socket.socket.addEventListener('message', msgHandler);
};
