import * as JSLZString from 'lz-string';

import {SaveData} from '../models/saves';

new class ZipUnzipWorker {

  constructor() {
    this.addEventListener();
  }

  addEventListener(): void {
    addEventListener('message', message => this.onMessage(message));
  }

  onMessage(message: MessageEvent): void {
    const saveData: SaveData = message.data;
    const zippedSaveData = this.zip(saveData);
    // @ts-ignore
    postMessage(zippedSaveData);
  }

  zip(data: any): string {
    return JSLZString.compressToUTF16(JSON.stringify(data));
  }

}
