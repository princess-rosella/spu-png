/*
 * Copyright (c) 2018 Princess Rosella. All rights reserved.
 *
 * @LICENSE_HEADER_START@
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * @LICENSE_HEADER_END@
 */

import { Chunk, ChunkHeader } from "./Chunk";
import { readLatin1String } from "./Latin1";
import { inflateSync as inflate } from "zlib";

export class ChunkICCProfile extends Chunk {
    name:        string;
    compression: number;
    profile:     ArrayBuffer;

    constructor(length: number, type: string, crc: number, view: DataView, offset: number, header: ChunkHeader) {
        super(length, type, crc, view, offset, header);
        const end = offset + length;
        [this.name, offset] = readLatin1String(view, offset, end);
        this.compression = view.getUint8(offset++);

        const buffer = inflate(view.buffer.slice(offset, end));
        this.profile = buffer.buffer.slice(buffer.byteOffset, buffer.byteLength);
    }
}
