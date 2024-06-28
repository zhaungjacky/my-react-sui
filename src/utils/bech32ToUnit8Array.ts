import { bech32 } from "bech32";

export default function bech32ToUnit8Array(key: string): number[] {

    const arr = bech32.decode(key).words;

    const data = bech32.fromWords(arr)
    data.shift();
    return data;
}


