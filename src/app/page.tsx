import { getSchedule } from "@/lib/schedule";

export const revalidate = 120;

export default async function Home() {
  const { events, error } = await getSchedule();

  return (
    <div className="flex flex-1 flex-col bg-[var(--col-bg13)]">
      <header className="sticky top-0 z-10 border-b border-[var(--border-light)] bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <span className="text-sm font-medium text-[var(--button-text)]">
            회사 일정
          </span>
          <nav className="hidden sm:block" aria-label="보조">
            <span className="rounded-full bg-black/[0.05] px-4 py-2 text-sm font-medium text-[var(--button-text)]">
              일정 보기
            </span>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <section className="mb-12 sm:mb-16 lg:mb-20">
          <h1 className="font-display max-w-3xl text-4xl font-medium leading-[1.1] tracking-tight text-[var(--col-text00)] sm:text-5xl lg:text-[3.5rem]">
            함께하는 일정
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-[1.5] text-[var(--col-text04)] sm:text-lg">
            공개 스프레드시트와 동기화된 회사 일정입니다. 변경 사항은 잠시 후
            자동으로 반영됩니다.
          </p>
        </section>

        {error ? (
          <div
            className="rounded-2xl border border-[var(--border-gray)] bg-[var(--secondary-btn-bg)] px-6 py-8 text-[var(--col-text04)] shadow-[var(--shadow-card)]"
            role="alert"
          >
            <p className="font-mid text-lg font-medium text-[var(--col-text00)]">
              일정을 불러올 수 없습니다
            </p>
            <p className="font-data mt-2 text-sm leading-relaxed">{error}</p>
            <p className="font-data mt-4 text-sm text-[var(--col-text-muted)]">
              스프레드시트가 &quot;링크가 있는 모든 사용자&quot; 또는
              &quot;웹에 공개&quot;로 읽기 가능한지,{" "}
              <code className="rounded bg-white/80 px-1.5 py-0.5 text-[var(--col-text00)]">
                SCHEDULE_SPREADSHEET_ID
              </code>{" "}
              가 올바른지 확인해 주세요.
            </p>
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border-gray)] px-6 py-16 text-center">
            <p className="font-display text-xl font-medium text-[var(--col-text00)]">
              표시할 일정이 없습니다
            </p>
            <p className="font-data mt-2 text-sm text-[var(--col-text04)]">
              스프레드시트에 데이터 행이 있고, 첫 행은 열 이름(헤더)으로
              두었는지 확인해 주세요.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {events.map((ev, i) => {
              const featured = i === 0;
              return (
                <li key={`${ev.title}-${i}-${ev.date ?? ""}-${ev.time ?? ""}`}>
                  <article
                    className={`flex h-full flex-col rounded-[20px] border border-[var(--border-light)] bg-white p-6 transition-shadow duration-200 hover:shadow-[var(--shadow-elevated)] ${
                      featured
                        ? "shadow-[var(--shadow-brand-glow)]"
                        : "shadow-[var(--shadow-card)]"
                    }`}
                  >
                    <div className="font-data text-xs font-medium uppercase tracking-wide text-[var(--color-primary-600)]">
                      {ev.date ?? "날짜 미정"}
                    </div>
                    {ev.time ? (
                      <div className="font-data mt-1 text-sm text-[var(--col-text04)]">
                        {ev.time}
                      </div>
                    ) : null}
                    <h2 className="font-display mt-4 text-xl font-semibold leading-snug text-[var(--col-text00)] sm:text-2xl">
                      {ev.title}
                    </h2>
                    {ev.location ? (
                      <p className="font-data mt-3 text-sm text-[var(--col-text04)]">
                        <span className="text-[var(--col-text-muted)]">
                          장소{" "}
                        </span>
                        {ev.location}
                      </p>
                    ) : null}
                    {ev.description ? (
                      <p className="font-data mt-3 flex-1 text-sm leading-relaxed text-[var(--col-text04)]">
                        {ev.description}
                      </p>
                    ) : null}
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </main>

      <footer className="mt-auto bg-[var(--charcoal)] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="font-display text-lg font-medium text-white/90">
                회사 일정
              </p>
              <p className="font-data mt-2 max-w-md text-sm leading-relaxed text-white/80">
                데이터는 Google 스프레드시트 CSV 내보내기로 불러오며, 캐시되어
                주기적으로 갱신됩니다.
              </p>
            </div>
            <div className="sm:text-right">
              <p className="font-data text-sm text-white/80">
                © {new Date().getFullYear()} 회사 일정 뷰어
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
