export type ScheduleEvent = {
  /** 표시용 (예: 2026년 4월 11일 (토)) */
  date?: string;
  /** 달력 배치용 `YYYY-MM-DD` (날짜 셀 파싱 가능할 때만) */
  dateKey?: string;
  time?: string;
  title: string;
  description?: string;
  location?: string;
};

export type ScheduleResult = {
  events: ScheduleEvent[];
  error?: string;
};
