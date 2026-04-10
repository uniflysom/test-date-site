import { ScheduleCalendar } from "@/components/ScheduleCalendar";
import { getSchedule } from "@/lib/schedule";

export const revalidate = 120;

export default async function Home() {
  const { events, error } = await getSchedule();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[var(--apple-light-gray)]">
      <header
        className="sticky top-0 z-20 h-12 border-b border-white/10 text-[12px] text-[var(--apple-white)] backdrop-blur-[20px] backdrop-saturate-180"
        style={{ backgroundColor: "var(--apple-nav-glass)" }}
      >
        <div className="mx-auto flex h-full max-w-[980px] items-center justify-between px-4 sm:px-6">
          <span className="font-body font-normal tracking-tight">
            {"\uD68C\uC0AC \uC77C\uC815"}
          </span>
          <span className="font-body hidden text-[var(--apple-white)]/80 sm:inline">
            {"\uC2A4\uD504\uB808\uB4DC\uC2DC\uD2B8 \uC5F0\uB3D9"}
          </span>
        </div>
      </header>

      <section className="bg-[var(--apple-black)] px-4 py-16 text-[var(--apple-white)] sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[980px]">
          <h1 className="text-hero max-w-3xl text-[clamp(2rem,6vw,3.5rem)]">
            {"\uD568\uAED8\uD558\uB294 \uC77C\uC815"}
          </h1>
          <p className="font-body mt-5 max-w-2xl text-[17px] font-normal leading-[1.47] text-[var(--apple-white)]/[0.8] sm:text-[19px]">
            {
              "\uACF5\uAC1C \uC2A4\uD504\uB808\uB4DC\uC2DC\uD2B8\uC640 \uB3D9\uAE30\uD654\uB41C \uD68C\uC0AC \uC77C\uC815\uC785\uB2C8\uB2E4. \uBCC0\uACBD \uC0AC\uD56D\uC740 \uC7A0\uC2DC \uD6C4 \uC790\uB3D9\uC73C\uB85C \uBC18\uC601\uB429\uB2C8\uB2E4."
            }
          </p>
          {!error && events.length > 0 ? (
            <p className="font-body mt-6 text-[14px] leading-[1.43] text-[var(--apple-link-bright)]">
              {"\uB4F1\uB85D \uC77C\uC815 "}
              <span className="font-semibold text-[var(--apple-white)]">
                {events.length}
                {"\uAC74"}
              </span>
            </p>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#calendar"
              className="font-body focus-apple inline-flex items-center rounded-[980px] border border-[var(--apple-link-bright)] bg-transparent px-5 py-2 text-[14px] font-normal text-[var(--apple-link-bright)] transition hover:underline"
            >
              {"\uC77C\uC815 \uBCF4\uAE30"}
            </a>
            <a
              href="#calendar"
              className="font-body focus-apple inline-flex items-center rounded-lg bg-[var(--apple-blue)] px-[15px] py-2 text-[17px] font-normal text-[var(--apple-white)] transition hover:brightness-110"
            >
              {"\uB2EC\uB825\uC73C\uB85C"}
            </a>
          </div>
        </div>
      </section>

      <main
        id="calendar"
        className="mx-auto w-full max-w-[980px] flex-1 px-4 py-14 sm:px-6 sm:py-16 lg:py-20"
      >
        {!error && events.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-hero text-[28px] text-[var(--apple-near-black)] sm:text-[32px]">
              {"\uC6D4\uAC04 \uC77C\uC815"}
            </h2>
            <p className="font-body mt-2 text-[14px] leading-[1.29] text-[var(--apple-text-tertiary)]">
              {
                "\uD55C \uB2EC \uB2E8\uC704\uB85C \uC77C\uC815\uC744 \uBAA8\uC544 \uBCF4\uC5EC \uC90D\uB2C8\uB2E4."
              }
            </p>
          </div>
        ) : null}

        {error ? (
          <div
            className="rounded-lg bg-[var(--apple-white)] px-6 py-8 shadow-[var(--apple-card-shadow)]"
            role="alert"
          >
            <p className="text-hero text-[21px] text-[var(--apple-near-black)]">
              {"\uC77C\uC815\uC744 \uBD88\uB7EC\uC62C \uC218 \uC5C6\uC2B5\uB2C8\uB2E4"}
            </p>
            <p className="font-body mt-3 text-[14px] leading-[1.43] text-[var(--apple-text-secondary)]">
              {error}
            </p>
            <p className="font-body mt-4 text-[14px] text-[var(--apple-text-tertiary)]">
              {
                "\uC2A4\uD504\uB808\uB4DC\uC2DC\uD2B8\uAC00 \u201C\uB9C1\uD06C\uAC00 \uC788\uB294 \uBAA8\uB4E0 \uC0AC\uC6A9\uC790\u201D \uB610\uB294 \u201C\uC6F9\uC5D0 \uACF5\uAC1C\u201D\uB85C \uC77D\uAE30 \uAC00\uB2A5\uD55C\uC9C0, "
              }
              <code className="font-mono-code rounded-[5px] bg-[var(--apple-light-gray)] px-1.5 py-0.5 text-[var(--apple-near-black)]">
                SCHEDULE_SPREADSHEET_ID
              </code>
              {" \uAC00 \uC62C\uBC14\uB978\uC9C0 \uD655\uC778\uD574 \uC8FC\uC138\uC694."}
            </p>
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-lg bg-[var(--apple-white)] px-6 py-16 text-center shadow-[var(--apple-card-shadow)]">
            <p className="text-hero text-[28px] text-[var(--apple-near-black)]">
              {"\uD45C\uC2DC\uD560 \uC77C\uC815\uC774 \uC5C6\uC2B5\uB2C8\uB2E4"}
            </p>
            <p className="font-body mt-3 text-[17px] leading-[1.47] text-[var(--apple-text-secondary)]">
              {
                "\uC2A4\uD504\uB808\uB4DC\uC2DC\uD2B8\uC5D0 \uB370\uC774\uD130 \uD589\uC774 \uC788\uACE0, \uCCAB \uD589\uC740 \uC5F4 \uC774\uB984(\uD5E4\uB354)\uB85C \uB450\uC5C8\uB294\uC9C0 \uD655\uC778\uD574 \uC8FC\uC138\uC694."
              }
            </p>
          </div>
        ) : (
          <ScheduleCalendar events={events} />
        )}
      </main>

      <footer className="mt-auto bg-[var(--apple-black)] px-4 py-14 text-[var(--apple-white)] sm:px-6">
        <div className="mx-auto max-w-[980px]">
          <div className="grid gap-10 sm:grid-cols-2 sm:gap-12">
            <div>
              <p className="text-hero text-[21px] text-[var(--apple-white)]">
                {"\uD68C\uC0AC \uC77C\uC815"}
              </p>
              <p className="font-body mt-3 max-w-md text-[14px] leading-[1.43] text-[var(--apple-white)]/[0.64]">
                {
                  "\uB370\uC774\uD130\uB294 Google \uC2A4\uD504\uB808\uB4DC\uC2DC\uD2B8 CSV \uB0B4\uBCF4\uB0B4\uAE30\uB85C \uBD88\uB7EC\uC624\uBA70, \uCE90\uC2DC\uB418\uC5B4 \uC8FC\uAE30\uC801\uC73C\uB85C \uAC31\uC2E0\uB429\uB2C8\uB2E4."
                }
              </p>
            </div>
            <div className="sm:flex sm:items-end sm:justify-end">
              <p className="font-body text-[12px] text-[var(--apple-white)]/[0.48]">
                {"\u00A9 "}
                {new Date().getFullYear()}
                {" \uD68C\uC0AC \uC77C\uC815 \uBDF0\uC5B4"}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
