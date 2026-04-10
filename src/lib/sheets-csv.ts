import type { ScheduleEvent } from "./types";

export function buildExportUrl(spreadsheetId: string, gid: string): string {
  const q = new URLSearchParams({ format: "csv", gid });
  return `https://docs.google.com/spreadsheets/d/${encodeURIComponent(spreadsheetId)}/export?${q.toString()}`;
}

/** Minimal RFC 4180-style CSV parser (quoted fields, escaped quotes). */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let i = 0;
  let inQuotes = false;

  while (i < text.length) {
    const c = text[i]!;

    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      field += c;
      i += 1;
      continue;
    }

    if (c === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }
    if (c === ",") {
      row.push(field);
      field = "";
      i += 1;
      continue;
    }
    if (c === "\r") {
      i += 1;
      continue;
    }
    if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i += 1;
      continue;
    }
    field += c;
    i += 1;
  }

  row.push(field);
  const last = row.join("").trim();
  if (row.length > 1 || last !== "") {
    rows.push(row);
  }

  return rows;
}

function normalizeHeader(h: string): string {
  return h.trim().toLowerCase().replace(/\s+/g, " ");
}

function headerMatches(header: string, keywords: string[]): boolean {
  const n = normalizeHeader(header);
  const compact = n.replace(/\s/g, "");
  for (const kw of keywords) {
    const k = kw.toLowerCase();
    if (n.includes(k) || compact.includes(k.replace(/\s/g, ""))) return true;
  }
  return false;
}

export type ColumnMap = {
  date?: number;
  timeStart?: number;
  timeEnd?: number;
  time?: number;
  title?: number;
  location?: number;
  description?: number;
};

const KW_DATE = ["date", "날짜", "일자", "시작일", "day", "일시"];
const KW_TIME_START = ["시작 시간", "시작시간", "start time", "start", "시작"];
const KW_TIME_END = ["종료 시간", "종료시간", "end time", "end", "종료"];
const KW_TIME = ["time", "시간", "when"];
const KW_TITLE = [
  "title",
  "제목",
  "일정",
  "회의",
  "subject",
  "meeting",
  "이벤트",
  "행사",
];
const KW_LOCATION = ["location", "장소", "place", "venue", "위치"];
const KW_DESCRIPTION = [
  "description",
  "내용",
  "비고",
  "detail",
  "memo",
  "notes",
  "note",
  "설명",
];

function firstMatchIndex(
  headers: string[],
  keywords: string[],
  exclude: Set<number>,
): number | undefined {
  for (let i = 0; i < headers.length; i++) {
    if (exclude.has(i)) continue;
    if (headerMatches(headers[i] ?? "", keywords)) return i;
  }
  return undefined;
}

export function mapColumns(headers: string[]): ColumnMap {
  const used = new Set<number>();
  const map: ColumnMap = {};

  const date = firstMatchIndex(headers, KW_DATE, used);
  if (date !== undefined) {
    map.date = date;
    used.add(date);
  }

  const timeStart = firstMatchIndex(headers, KW_TIME_START, used);
  const timeEnd = firstMatchIndex(headers, KW_TIME_END, used);
  if (timeStart !== undefined) {
    map.timeStart = timeStart;
    used.add(timeStart);
  }
  if (timeEnd !== undefined) {
    map.timeEnd = timeEnd;
    used.add(timeEnd);
  }

  if (timeStart === undefined && timeEnd === undefined) {
    const time = firstMatchIndex(headers, KW_TIME, used);
    if (time !== undefined) {
      map.time = time;
      used.add(time);
    }
  }

  const title = firstMatchIndex(headers, KW_TITLE, used);
  if (title !== undefined) {
    map.title = title;
    used.add(title);
  }

  const location = firstMatchIndex(headers, KW_LOCATION, used);
  if (location !== undefined) {
    map.location = location;
    used.add(location);
  }

  const description = firstMatchIndex(headers, KW_DESCRIPTION, used);
  if (description !== undefined) {
    map.description = description;
    used.add(description);
  }

  return map;
}

/**
 * Fallback when 제목 열을 찾지 못한 경우: A=날짜, B=시간, C=제목, D=장소, E=내용.
 * 제목이 이미 있으면 비어 있는 필드만 보조로 채웁니다.
 */
export function applyFallbackMap(
  headers: string[],
  map: ColumnMap,
): ColumnMap {
  const max = headers.length;
  if (max === 0) return map;
  const m = { ...map };

  if (m.title !== undefined) {
    if (m.date === undefined && m.title !== 0) m.date = 0;
    if (
      m.time === undefined &&
      m.timeStart === undefined &&
      m.timeEnd === undefined &&
      max > 1
    ) {
      const taken = new Set(
        [m.date, m.title, m.location, m.description].filter(
          (x): x is number => x !== undefined,
        ),
      );
      if (!taken.has(1)) m.time = 1;
    }
    return m;
  }

  if (max >= 3) {
    m.date = 0;
    m.time = 1;
    m.title = 2;
    if (max > 3) m.location = m.location ?? 3;
    if (max > 4) m.description = m.description ?? 4;
  } else if (max === 2) {
    m.date = 0;
    m.title = 1;
  } else {
    m.title = 0;
  }
  return m;
}

function cell(row: string[], idx: number | undefined): string {
  if (idx === undefined) return "";
  return (row[idx] ?? "").trim();
}

function formatDisplayDate(raw: string): string {
  const t = raw.trim();
  if (!t) return "";
  const parsed = Date.parse(t);
  if (!Number.isNaN(parsed)) {
    try {
      return new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "short",
      }).format(new Date(parsed));
    } catch {
      return t;
    }
  }
  return t;
}

/** 로컬 날짜 기준 `YYYY-MM-DD` (달력 그리드 매칭용) */
function parseDateRawToKey(raw: string): string | undefined {
  const t = raw.trim();
  if (!t) return undefined;
  const parsed = Date.parse(t);
  if (Number.isNaN(parsed)) return undefined;
  const d = new Date(parsed);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function combineTime(
  map: ColumnMap,
  row: string[],
): string | undefined {
  const start = cell(row, map.timeStart);
  const end = cell(row, map.timeEnd);
  const single = cell(row, map.time);
  if (start && end) return `${start} – ${end}`;
  if (start) return start;
  if (end) return end;
  if (single) return single;
  return undefined;
}

export function rowsToScheduleEvents(rows: string[][]): ScheduleEvent[] {
  if (rows.length < 2) return [];

  const headers = rows[0]!.map((h) => h.trim());
  let col = mapColumns(headers);
  col = applyFallbackMap(headers, col);

  const events: ScheduleEvent[] = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r]!;
    const title = cell(row, col.title);
    const dateRaw = cell(row, col.date);
    const time = combineTime(col, row);
    const description = cell(row, col.description);
    const location = cell(row, col.location);

    const nonEmpty = [title, dateRaw, time, description, location].some(
      (x) => (x ?? "").length > 0,
    );
    if (!nonEmpty) continue;

    const displayDate = dateRaw ? formatDisplayDate(dateRaw) : undefined;
    const dateKey = dateRaw ? parseDateRawToKey(dateRaw) : undefined;

    events.push({
      title: title || "(제목 없음)",
      date: displayDate || undefined,
      dateKey,
      time,
      description: description || undefined,
      location: location || undefined,
    });
  }

  return events;
}
