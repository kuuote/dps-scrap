import { assertEquals } from "https://deno.land/std@0.87.0/testing/asserts.ts";
import { byteIndexToChar, getLink } from "./util.ts";

const str = "日本語yayほげ";
assertEquals(byteIndexToChar(str, 0), 0); // 日
assertEquals(byteIndexToChar(str, 1), 0); // 日
assertEquals(byteIndexToChar(str, 2), 0); // 日
assertEquals(byteIndexToChar(str, 3), 1); // 本
assertEquals(byteIndexToChar(str, 4), 1); // 本
assertEquals(byteIndexToChar(str, 5), 1); // 本
assertEquals(byteIndexToChar(str, 6), 2); // 語
assertEquals(byteIndexToChar(str, 7), 2); // 語
assertEquals(byteIndexToChar(str, 8), 2); // 語
assertEquals(byteIndexToChar(str, 9), 3); // y
assertEquals(byteIndexToChar(str, 10), 4); // a
assertEquals(byteIndexToChar(str, 11), 5); // y
assertEquals(byteIndexToChar(str, 12), 6); // ほ
assertEquals(byteIndexToChar(str, 13), 6); // ほ
assertEquals(byteIndexToChar(str, 14), 6); // ほ
assertEquals(byteIndexToChar(str, 15), 7); // げ
assertEquals(byteIndexToChar(str, 16), 7); // げ
assertEquals(byteIndexToChar(str, 17), 7); // げ

const line = "あ[い][う]え[お]";
assertEquals(getLink(line, 0), "");
assertEquals(getLink(line, 1), "い");
assertEquals(getLink(line, 2), "い");
assertEquals(getLink(line, 3), "い");
assertEquals(getLink(line, 4), "う");
assertEquals(getLink(line, 5), "う");
assertEquals(getLink(line, 6), "う");
assertEquals(getLink(line, 7), "");
assertEquals(getLink(line, 8), "お");
assertEquals(getLink(line, 9), "お");
assertEquals(getLink(line, 10), "お");

console.log("test end");
