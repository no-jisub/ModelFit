export function formatModelReleaseDate(value?: string): string {
  if (!value) return "출시일 확인 중";

  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month) return "출시일 확인 중";

  return day ? `${year}년 ${month}월 ${day}일 출시` : `${year}년 ${month}월 출시`;
}
