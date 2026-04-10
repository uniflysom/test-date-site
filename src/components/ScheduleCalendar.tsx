"use client";

import { useMemo, useState } from "react";
import type { ScheduleEvent } from "@/lib/types";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

const focusCls =
  "focus-apple focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--apple-blue)] focus-visible:outline-offset-2";

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
    <div className="flex flex-col gap-8 lg:gap-10">
      <div className="rounded-lg bg-[var(--apple-white)] p-4 shadow-[var(--apple-card-shadow)] sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={prevMonth}
              className={`font-body rounded-[11px] border-[3px] border-[var(--apple-filter-border)] bg-[var(--apple-btn-light)] px-3.5 py-2 text-[15px] font-normal text-[var(--apple-text-secondary)] transition hover:bg-[var(--apple-btn-active)] ${focusCls}`}
            >
              이전
            </button>
            <h2 className="text-hero min-w-[10rem] text-center text-[clamp(1.25rem,3.5vw,1.75rem)] text-[var(--apple-near-black)] sm:min-w-[12rem]">
              {monthTitle}
            </h2>
            <button
              type="button"
              onClick={nextMonth}
              className={`font-body rounded-[11px] border-[3px] border-[var(--apple-filter-border)] bg-[var(--apple-btn-light)] px-3.5 py-2 text-[15px] font-normal text-[var(--apple-text-secondary)] transition hover:bg-[var(--apple-btn-active)] ${focusCls}`}
            >
              다음
            </button>
          </div>
          <button
            type="button"
            onClick={goToday}
            className={`font-body self-start rounded-lg bg-[var(--apple-blue)] px-[15px] py-2 text-[17px] font-normal text-[var(--apple-white)] transition hover:brightness-110 active:brightness-95 sm:self-auto ${focusCls}`}
          >
            {"\uC774\uBC88 \uB2EC\uB85C"}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg bg-[var(--apple-white)] shadow-[var(--apple-card-shadow)]">
        <div className="min-w-[min(100%,880px)]">
          <div className="grid grid-cols-7 bg-[var(--apple-near-black)] px-1 py-3">
            {WEEKDAYS.map((w) => (
              <div
                key={w}
                className="font-body text-center text-[11px] font-normal text-[var(--apple-white)]/[0.64] sm:text-[12px]"
              >
                {w}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-px bg-[var(--apple-light-gray)] p-px">
            {cells.map(({ date, inMonth }) => {
              const key = formatLocalDateKey(date);
              const dayEvents = byKey.get(key) ?? [];
              const isToday = key === todayKey;
              const dow = date.getDay();
              const isWeekend = dow === 0 || dow === 6;
              return (
                <div
                  key={key}
                  className={`flex min-h-[96px] flex-col bg-[var(--apple-white)] p-1.5 sm:min-h-[118px] sm:p-2 ${
                    isWeekend && inMonth ? "bg-[var(--apple-btn-light)]" : ""
                  } ${inMonth ? "" : "opacity-40"} ${
                    isToday
                      ? "ring-2 ring-inset ring-[var(--apple-blue)]"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-body text-[10px] font-normal uppercase tracking-wide text-[var(--apple-text-tertiary)] sm:text-[11px]">
                      {isToday ? "\uC624\uB298" : ""}
                    </span>
                    <span
                      className={`font-body text-[12px] font-semibold sm:text-[13px] ${
                        inMonth
                          ? "text-[var(--apple-near-black)]"
                          : "text-[var(--apple-text-tertiary)]"
                      }`}
                    >
                      {date.getDate()}
                    </span>
                  </div>
                  <ul className="mt-1 space-y-0.5">
                    {dayEvents.slice(0, 4).map((ev, i) => (
                      <li key={`${key}-${ev.title}-${i}-${ev.time ?? ""}`}>
                        <span
                          className="font-body line-clamp-2 rounded-[5px] bg-[var(--apple-light-gray)] px-1.5 py-1 text-[10px] leading-snug text-[var(--apple-near-black)] sm:text-[11px]"
                          title={`${ev.title}${ev.time ? ` · ${ev.time}` : ""}${ev.location ? ` · ${ev.location}` : ""}`}
                        >
                          {ev.time ? (
                            <span className="text-[var(--apple-text-secondary)]">
                              {ev.time}{" "}
                            </span>
                          ) : null}
                          {ev.title}
                        </span>
                      </li>
                    ))}
                    {dayEvents.length > 4 ? (
                      <li className="font-body px-0.5 text-[10px] text-[var(--apple-text-tertiary)] sm:text-[11px]">
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
        <section className="rounded-lg bg-[var(--apple-white)] px-5 py-6 shadow-[var(--apple-card-shadow)] sm:px-8">
          <h3 className="text-hero text-[21px] text-[var(--apple-near-black)]">
            {"\uB0A0\uC9DC\uB97C \uC54C \uC218 \uC5C6\uB294 \uC77C\uC815"}
          </h3>
          <p className="font-body mt-2 text-[14px] leading-[1.43] text-[var(--apple-text-secondary)]">
            {
              "\uB0A0\uC9DC \uC5F4\uC744 \uC77D\uC9C0 \uBABB\uD55C \uD589\uC740 \uB2EC\uB825 \uCE78\uC5D0 \uB123\uC9C0 \uC54A\uACE0 \uC5EC\uAE30\uB9CC \uD45C\uC2DC\uD569\uB2C8\uB2E4."
            }
          </p>
          <ul className="mt-5 space-y-3">
            {undated.map((ev, i) => (
              <li
                key={`undated-${ev.title}-${i}-${ev.time ?? ""}`}
                className="rounded-lg bg-[var(--apple-light-gray)] p-5"
              >
                <p className="text-hero text-[17px] text-[var(--apple-near-black)]">
                  {ev.title}
                </p>
                {ev.date ? (
                  <p className="font-body mt-2 text-[14px] text-[var(--apple-text-secondary)]">
                    {ev.date}
                  </p>
                ) : null}
                {ev.time ? (
                  <p className="font-body text-[14px] text-[var(--apple-text-secondary)]">
                    {ev.time}
                  </p>
                ) : null}
                {ev.location ? (
                  <p className="font-body text-[14px] text-[var(--apple-text-secondary)]">
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
