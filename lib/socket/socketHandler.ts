// socketHandler.js
import socket from './trip';

export function registerSocketEvents(packageId: string, handleStatusChange: any, handleIgnored: any) {
    socket.connect();
    socket.emit('register', { roomId: packageId, token: localStorage.getItem('didjwt') });

    socket.on('go', () => handleStatusChange('Service is on the way....'));
    socket.on('ignored', reason => handleIgnored(reason));

    return () => {
        socket.emit('package-closed', packageId);
        socket.disconnect();
    };
}