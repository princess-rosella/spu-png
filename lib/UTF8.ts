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

import { readLatin1String } from "./Latin1";

export function readUtf8String(view: DataView, offset: number, end: number): [string, number] {
    let str = "";

    while (offset < end) {
        const code1 = view.getUint8(offset++);
        if (code1 == 0)
            break;

        switch (code1 >> 4) {
        case 0x00:
        case 0x01:
        case 0x02:
        case 0x03:
        case 0x04:
        case 0x05:
        case 0x06:
        case 0x07:
            str += String.fromCharCode(code1);
            break;
        case 0x0c:
        case 0x0d:
            {
                const code2 = view.getUint8(offset++);

                str += String.fromCharCode(((code1 & 0x1F) << 6) |
                                            (code2 & 0x3F));
            }
            break;
        case 0x0e:
            {
                const code2 = view.getUint8(offset++);
                const code3 = view.getUint8(offset++);

                str += String.fromCharCode(((code1 & 0x0F) << 12) |
                                           ((code2 & 0x3F) << 6)  |
                                            (code3 & 0x3F));
            }
            break;
        case 0x0f:
            {
                const code2 = view.getUint8(offset++);
                const code3 = view.getUint8(offset++);
                const code4 = view.getUint8(offset++);

                str += String.fromCharCode(((code1 & 0x07) << 20) |
                                           ((code2 & 0x3F) << 12) |
                                           ((code3 & 0x3F) << 6)  |
                                            (code4 & 0x3F));
            }
            break;
        }
    }

    return [str, offset];
}

export function isValidUtf8(view: DataView, offset: number, end: number) {
    while (offset < end) {
        const code1 = view.getUint8(offset++);
        if (code1 == 0)
            break;

        if ((code1 & 0x80) === 0x00) {
            // It's an ASCII character.
            continue;
        }

        // 2 (or more) bytes.
        if (offset >= end)
            return false;

        const code2 = view.getUint8(offset++);
        if ((code2 & 0xc0) !== 0x80)
            return false;

        if ((code1 & 0xe0) === 0xc0)
            continue;

        // 3 (or more) bytes
        if (offset >= end)
            return false;

        const code3 = view.getUint8(offset++);
        if ((code3 & 0xc0) !== 0x80)
            return false;

        if ((code1 & 0xf0) === 0xe0)
            continue;

        // 4 bytes
        if (offset >= end)
            return false;

        const code4 = view.getUint8(offset++);
        if ((code4 & 0xc0) !== 0x80)
            return false;
    }

    return true;
}

export function readLatin1OrUtf8String(view: DataView, offset: number, end: number): [string, number] {
    if (isValidUtf8(view, offset, end))
        return readUtf8String(view, offset, end);
    else
        return readLatin1String(view, offset, end);
}
