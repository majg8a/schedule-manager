import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService extends Socket {
  constructor() {
    super({ url: environment.apiUrl });
    this.ioSocket.on('schedule', (res: any) => res);
  }

  sendMessage(body: any) {
    return this.emit('schedule', body);
  }
}
