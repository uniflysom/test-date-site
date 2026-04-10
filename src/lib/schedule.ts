import { buildExportUrl, parseCsv, rowsToScheduleEvents } from "./sheets-csv";
import type { ScheduleResult } from "./types";

const REVALIDATE_SECONDS = 120;

/** 배포 시 환경 변수가 없을 때 사용. 다른 시트는 `SCHEDULE_SPREADSHEET_ID`로 덮어씁니다. */
const DEFAULT_SPREADSHEET_ID =
  "1P--wtuvsTjwTc4ry_fk7GSQmgqqXL9QSUF0ZHNBtw24";

function getSpreadsheetId(): string {
  return (
    process.env.SCHEDULE_SPREADSHEET_ID?.trim() || DEFAULT_SPREADSHEET_ID
  );
}

function getSheetGid(): string {
  return process.env.SCHEDULE_SHEET_GID?.trim() || "0";
}

export async function getSchedule(): Promise<ScheduleResult> {
  const id = getSpreadsheetId();
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
