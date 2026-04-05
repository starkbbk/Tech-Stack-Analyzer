import { EventEmitter } from 'events';

class ScanEventEmitter extends EventEmitter {}

export const scanEventEmitter = new ScanEventEmitter();
