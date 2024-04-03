import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const socket = new SockJS('https://api.ko-meet-back.com:443' + '/ws');
const stompClient = Stomp.over(socket);

export default { socket, stompClient };
