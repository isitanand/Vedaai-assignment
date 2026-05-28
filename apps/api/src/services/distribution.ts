import type { Difficulty, DifficultyDistribution } from "@vedaai/shared";


export function difficultyCounts(
  total: number,
  dist: DifficultyDistribution
): Record<Lowercase<Difficulty>, number> {
  const raw = {
    easy: (dist.easy / 100) * total,
    medium: (dist.medium / 100) * total,
    hard: (dist.hard / 100) * total,
  };
  const floored = {
    easy: Math.floor(raw.easy),
    medium: Math.floor(raw.medium),
    hard: Math.floor(raw.hard),
  };
  let remainder = total - (floored.easy + floored.medium + floored.hard);
  const order = (Object.keys(raw) as Array<keyof typeof raw>).sort(
    (a, b) => raw[b] - Math.floor(raw[b]) - (raw[a] - Math.floor(raw[a]))
  );
  for (const key of order) {
    if (remainder <= 0) break;
    floored[key] += 1;
    remainder -= 1;
  }
  return floored;
}

const LABEL: Record<Lowercase<Difficulty>, Difficulty> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};


export function difficultySequence(
  total: number,
  dist: DifficultyDistribution
): Difficulty[] {
  const counts = difficultyCounts(total, dist);
  const seq: Difficulty[] = [];
  (Object.keys(counts) as Array<Lowercase<Difficulty>>).forEach((k) => {
    for (let i = 0; i < counts[k]; i++) seq.push(LABEL[k]);
  });
  return seq;
}
