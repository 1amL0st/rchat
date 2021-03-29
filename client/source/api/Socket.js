function SocketF() {
  this.socket = null;

  this.connect = async () =>
    new Promise((resolve, reject) => {
      const wsURI = `${
        (window.location.protocol === 'https:' ? 'wss://' : 'ws://') +
        window.location.host
      }/ws/`;
      this.socket = new WebSocket(wsURI);

      this.socket.onopen = () => {
        console.log('Socket opened!');
        resolve();
      };

      this.socket.onclose = () => {
        console.error('Socket was closed!');
      };

      this.socket.onerror = () => {
        reject(new Error('Some error happened!'));
      };
    });
}

export const Socket = new SocketF();
