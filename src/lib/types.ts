export type ScheduleEvent = {
  date?: string;
  time?: string;
  title: string;
  description?: string;
  location?: string;
};

export type ScheduleResult = {
  events: ScheduleEvent[];
  error?: string;
};
