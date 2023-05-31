// socketHandler.js
import socket from './trip';

export function registerSocketEvents(shipmentId: string, handleStatusChange: any, handleIgnored: any) {
    socket.connect();
    socket.emit('register', { roomId: shipmentId, token: localStorage.getItem('didjwt') });

    socket.on('go', () => handleStatusChange('ready'));
    socket.on('ignored', reason => handleIgnored(reason));

    return () => {
        socket.emit('shipment-closed', shipmentId);
        socket.disconnect();
    };
}