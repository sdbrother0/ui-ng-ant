import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { WsMessage } from './form.schema';

@Injectable()
export class FormWsService implements OnDestroy {
  private ws: WebSocket | null = null;
  private messages$ = new Subject<WsMessage>();
  private reconnectTimer: any = null;
  private wsUrl = '';

  readonly messages: Observable<WsMessage> = this.messages$.asObservable();
  isConnected = false;
  connectionError = '';

  constructor(private zone: NgZone) {}

  connect(url: string): void {
    this.wsUrl = url;
    this.connectionError = '';
    this._open();
  }

  private _open(): void {
    if (this.ws) {
      this.ws.onclose = null;
      this.ws.onerror = null;
      this.ws.close();
    }
    try {
      this.ws = new WebSocket(this.wsUrl);
    } catch (e) {
      this.zone.run(() => {
        this.connectionError = String(e);
        this.isConnected = false;
      });
      return;
    }
    this.ws.onopen = () => this.zone.run(() => {
      this.isConnected = true;
      this.connectionError = '';
    });
    this.ws.onclose = () => this.zone.run(() => {
      this.isConnected = false;
      this.reconnectTimer = setTimeout(() => this._open(), 3000);
    });
    this.ws.onerror = (e) => this.zone.run(() => {
      this.connectionError = 'WebSocket error';
    });
    this.ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data) as WsMessage;
        this.zone.run(() => this.messages$.next(msg));
      } catch {}
    };
  }

  send(msg: WsMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    }
  }

  disconnect(): void {
    clearTimeout(this.reconnectTimer);
    if (this.ws) {
      this.ws.onclose = null;
      this.ws.onerror = null;
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }

  ngOnDestroy(): void {
    this.disconnect();
    this.messages$.complete();
  }
}
