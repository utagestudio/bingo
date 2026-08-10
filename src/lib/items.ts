import type { BingoItem } from "../types/bingo";
import { createId } from "./id";

export function parseInputLines(rawInput: string): string[] {
  return rawInput
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function reconcileItems(
  rawInput: string,
  previousItems: BingoItem[],
): BingoItem[] {
  const lines = parseInputLines(rawInput);

  return lines.map((label, index) => {
    const previous = previousItems[index];

    // 行位置が同じならIDを維持し、入力修正でmarkedや配置が消えないようにする。
    if (previous) {
      return {
        ...previous,
        label,
      };
    }

    return {
      id: createId("item"),
      label,
    };
  });
}
