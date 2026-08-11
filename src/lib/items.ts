import type { BingoItem } from "../types/bingo";
import { createId } from "./id";

export function parseInputLines(rawInput: string): string[] {
  return rawInput
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function parseItemLine(line: string): Pick<BingoItem, "label" | "targetCount"> {
  const match = line.match(/^(.*?)\s+[x×](\d+)$/i);

  if (!match) {
    return { label: line };
  }

  const label = match[1].trim();
  const targetCount = Number(match[2]);

  if (!label || !Number.isInteger(targetCount) || targetCount <= 1) {
    return { label: line };
  }

  return { label, targetCount };
}

export function reconcileItems(
  rawInput: string,
  previousItems: BingoItem[],
): BingoItem[] {
  const lines = parseInputLines(rawInput);

  return lines.map((line, index) => {
    const previous = previousItems[index];
    const parsed = parseItemLine(line);

    // 行位置が同じならIDを維持し、入力修正でmarkedや配置が消えないようにする。
    if (previous) {
      return {
        id: previous.id,
        ...parsed,
      };
    }

    return {
      id: createId("item"),
      ...parsed,
    };
  });
}
