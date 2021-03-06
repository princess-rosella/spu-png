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

export function readLatin1String(view: DataView, offset: number, end: number): [string, number] {
    let str = "";

    while (offset < end) {
        const code = view.getUint8(offset++);
        if (code == 0)
            break;

        str += String.fromCharCode(code);
    }

    return [str, offset];
}

export function writeLatin1String(view: DataView, offset: number, str: string, terminate: boolean = true): number {
    for (let i = 0; i < str.length; i++) {
        view.setUint8(offset++, str.charCodeAt(i));
    }

    if (terminate)
        view.setUint8(offset++, 0)

    return offset;
}

export function isLatin1(str: string): boolean {
    for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 127)
            return false;
    }

    return true;
}
