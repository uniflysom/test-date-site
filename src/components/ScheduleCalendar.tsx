"use client";

import { useMemo, useState } from "react";
import type { ScheduleEvent } from "@/lib/types";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function formatLocalDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getCalendarCells(
  year: number,
  month: number,
): { date: Date; inMonth: boolean }[] {
  const first = new Date(year, month, 1);
  const startPad = first.getDay();
  const gridStart = new Date(year, month, 1 - startPad);
  const cells: { date: Date; inMonth: boolean }[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(
      gridStart.getFullYear(),
      gridStart.getMonth(),
      gridStart.getDate() + i,
    );
    cells.push({
      date: d,
      inMonth: d.getMonth() === month,
    });
  }
  return cells;
}

function initialMonthFromEvents(events: ScheduleEvent[]): Date {
  const withKey = events.find((e) => e.dateKey);
  if (withKey?.dateKey) {
    const parts = withKey.dateKey.split("-").map(Number);
    const y = parts[0];
    const m = parts[1];
    if (y !== undefined && m !== undefined) {
      return new Date(y, m - 1, 1);
    }
  }
  return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
}

export function ScheduleCalendar({ events }: { events: ScheduleEvent[] }) {
  const [cursor, setCursor] = useState(() => initialMonthFromEvents(events));

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const byKey = useMemo(() => {
    const map = new Map<string, ScheduleEvent[]>();
    for (const ev of events) {
      if (!ev.dateKey) continue;
      const arr = map.get(ev.dateKey) ?? [];
      arr.push(ev);
      map.set(ev.dateKey, arr);
    }
    return map;
  }, [events]);

  const undated = useMemo(
    () => events.filter((e) => !e.dateKey),
    [events],
  );

  const cells = useMemo(() => getCalendarCells(year, month), [year, month]);
  const todayKey = formatLocalDateKey(new Date());

  const monthTitle = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
  }).format(new Date(year, month, 1));

  function prevMonth() {
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1));
  }

  function nextMonth() {
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1));
  }

  function goToday() {
    const n = new Date();
    setCursor(new Date(n.getFullYear(), n.getMonth(), 1));
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={prevMonth}
            className="rounded-full bg-black/[0.05] px-4 py-2.5 text-sm font-medium text-[var(--button-text)] transition hover:bg-black/[0.08]"
          >
            이전
          </button>
          <h2 className="font-display min-w-[10rem] text-center text-2xl font-semibold text-[var(--col-text00)] sm:text-[1.94rem]">
            {monthTitle}
          </h2>
          <button
            type="button"
            onClick={nextMonth}
            className="rounded-full bg-black/[0.05] px-4 py-2.5 text-sm font-medium text-[var(--button-text)] transition hover:bg-black/[0.08]"
          >
            다음
          </button>
        </div>
        <button
          type="button"
          onClick={goToday}
          className="self-start rounded-lg bg-[var(--charcoal)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 sm:self-auto"
        >
          이번 달로
        </button>
      </div>

      <div className="overflow-x-auto rounded-[20px] border border-[var(--border-light)] bg-white shadow-[var(--shadow-card)]">
        <div className="min-w-[min(100%,880px)]">
          <div className="grid grid-cols-7 border-b border-[var(--border-light)] bg-[#f8fafc] px-1 py-3">
            {WEEKDAYS.map((w) => (
              <div
                key={w}
                className="font-data text-center text-xs font-medium tracking-wide text-[var(--col-text-muted)] sm:text-sm"
              >
                {w}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-px bg-[var(--border-light)] p-px">
            {cells.map(({ date, inMonth }) => {
              const key = formatLocalDateKey(date);
              const dayEvents = byKey.get(key) ?? [];
              const isToday = key === todayKey;
              return (
                <div
                  key={key}
                  className={`flex min-h-[92px] flex-col bg-white p-1.5 sm:min-h-[112px] sm:p-2 ${
                    inMonth ? "" : "opacity-45"
                  } ${isToday ? "shadow-[0_0_0_2px_var(--brand-6)]" : ""}`}
                >
                  <div
                    className={`font-data text-right text-xs font-medium sm:text-sm ${
                      inMonth
                        ? "text-[var(--col-text00)]"
                        : "text-[var(--col-text-muted)]"
                    }`}
                  >
                    {date.getDate()}
                  </div>
                  <ul className="mt-1 flex min-h-0 flex-1 flex-col gap-0.5 overflow-hidden">
                    {dayEvents.slice(0, 4).map((ev, i) => (
                      <li key={`${key}-${ev.title}-${i}-${ev.time ?? ""}`}>
                        <span
                          className="font-data line-clamp-2 rounded-[11px] bg-[var(--color-primary-200)]/50 px-1.5 py-1 text-[10px] leading-snug text-[var(--brand-3)] shadow-[var(--shadow-card)] sm:text-xs"
                          title={`${ev.title}${ev.time ? ` · ${ev.time}` : ""}${ev.location ? ` · ${ev.location}` : ""}`}
                        >
                          {ev.time ? (
                            <span className="text-[var(--color-primary-600)]">
                              {ev.time}{" "}
                            </span>
                          ) : null}
                          {ev.title}
                        </span>
                      </li>
                    ))}
                    {dayEvents.length > 4 ? (
                      <li className="font-data px-0.5 text-[10px] text-[var(--col-text-muted)] sm:text-xs">
                        +{dayEvents.length - 4}건
                      </li>
                    ) : null}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {undated.length > 0 ? (
        <section className="rounded-2xl border border-dashed border-[var(--border-gray)] bg-white/60 px-5 py-6 sm:px-8">
          <h3 className="font-display text-lg font-semibold text-[var(--col-text00)]">
            날짜를 알 수 없는 일정
          </h3>
          <p className="font-data mt-1 text-sm text-[var(--col-text04)]">
            날짜 열을 읽지 못한 행은 달력 칸에 넣지 않고 여기만 표시합니다.
          </p>
          <ul className="mt-4 space-y-3">
            {undated.map((ev, i) => (
              <li
                key={`undated-${ev.title}-${i}-${ev.time ?? ""}`}
                className="rounded-2xl border border-[var(--border-light)] bg-white p-4 shadow-[var(--shadow-card)]"
              >
                <p className="font-display text-base font-medium text-[var(--col-text00)]">
                  {ev.title}
                </p>
                {ev.date ? (
                  <p className="font-data mt-1 text-sm text-[var(--col-text04)]">
                    {ev.date}
                  </p>
                ) : null}
                {ev.time ? (
                  <p className="font-data text-sm text-[var(--col-text04)]">
                    {ev.time}
                  </p>
                ) : null}
                {ev.location ? (
                  <p className="font-data text-sm text-[var(--col-text04)]">
                    {ev.location}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
