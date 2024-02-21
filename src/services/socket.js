import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const socket = new SockJS(import.meta.env.VITE_APP_API_URL + '/ws');
const stompClient = Stomp.over(socket);

export default { socket, stompClient };
