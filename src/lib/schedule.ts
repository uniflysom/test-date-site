import { buildExportUrl, parseCsv, rowsToScheduleEvents } from "./sheets-csv";
import type { ScheduleResult } from "./types";

const REVALIDATE_SECONDS = 120;

function getSpreadsheetId(): string | undefined {
  return process.env.SCHEDULE_SPREADSHEET_ID?.trim() || undefined;
}

function getSheetGid(): string {
  return process.env.SCHEDULE_SHEET_GID?.trim() || "0";
}

export async function getSchedule(): Promise<ScheduleResult> {
  const id = getSpreadsheetId();
  if (!id) {
    return {
      events: [],
      error:
        "환경 변수 SCHEDULE_SPREADSHEET_ID가 설정되지 않았습니다. .env.local을 확인하세요.",
    };
  }

  const gid = getSheetGid();
  const url = buildExportUrl(id, gid);

  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS },
      headers: { Accept: "text/csv" },
    });

    if (!res.ok) {
      return {
        events: [],
        error: `스프레드시트를 불러오지 못했습니다 (HTTP ${res.status}). 링크 공개 설정과 ID·gid를 확인하세요.`,
      };
    }

    const text = await res.text();
    const rows = parseCsv(text);
    const events = rowsToScheduleEvents(rows);

    return { events };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return {
      events: [],
      error: `네트워크 오류: ${message}`,
    };
  }
}
