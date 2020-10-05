import {Injectable} from '@angular/core';
import * as JSLZString from 'lz-string';

@Injectable({providedIn: 'root'})
export class ZipService {

  // NOTE: LocalStorage can only contain JavaScript strings, and strings in JavaScript are stored internally in UTF-16.
  public zip(data: any): string {
    return JSLZString.compressToUTF16(JSON.stringify(data));
  }

  // NOTE: LocalStorage can only contain JavaScript strings, and strings in JavaScript are stored internally in UTF-16.
  public unzip(archive: string): any {
    return JSON.parse(JSLZString.decompressFromUTF16(archive));
  }

}
