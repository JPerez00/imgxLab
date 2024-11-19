// types/exiftool-vendored.d.ts

import 'exiftool-vendored';

declare module 'exiftool-vendored' {
  interface Tags {
    'Sony:ShutterCount'?: number;
    'MakerNotes:ShutterCount'?: number;
    'MakerNotes:ImageCount'?: number;
  }
}
