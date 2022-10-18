/**
 * A->1
 * AA->27
 */
export function charToNum(_chars: string): number {
    const chars = _chars.split("");
    var n = 0;
    for (const char of chars) n = n * 26 + (char.charCodeAt(0) - 64);
    return n;
}
/**
 * 1->A
 * 27->AA
 */
export function numToChar(_num: number): string {
    var s = "";
    while (_num > 0) {
        var m = (_num % 26) || 26;
        s = String.fromCharCode(m + 64) + s;
        _num = (_num - m) / 26;
    }
    return s;
}