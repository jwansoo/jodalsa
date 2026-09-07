export const PASS_MIN_SUBJECT_SCORE = 40
export const PASS_MIN_AVERAGE_SCORE = 60

export const isExamPassed = (subjectScores: number[], average: number) =>
  subjectScores.every((score) => score >= PASS_MIN_SUBJECT_SCORE) &&
  average >= PASS_MIN_AVERAGE_SCORE
