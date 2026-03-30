const LandingFooter = () => (
  <footer className="border-t border-white/10 bg-background py-10">
    <div className="mx-auto flex max-w-[1100px] flex-col gap-6 px-7 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-2 flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: "rgba(124,107,202,0.2)", border: "1px solid rgba(124,107,202,0.3)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="9" r="4" stroke="rgba(200,185,255,0.8)" strokeWidth="2" />
              <path d="M5 20c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="rgba(200,185,255,0.8)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-heading italic text-[1.1rem] text-white/85">Future Canvas</span>
        </div>
        <p className="max-w-[380px] text-sm leading-[1.65] text-white/50">
          Career guidance for Class 9–12 students, built from real school deployments and founder-led research.
        </p>
      </div>

      <nav aria-label="Footer links" className="flex flex-wrap items-center gap-2 text-sm">
        <a
          href="https://arabinda07.github.io/"
          target="_blank"
          rel="noopener noreferrer"
          className="glass rounded-full px-4 py-2 text-white/70 transition-colors hover:text-white"
        >
          Portfolio ↗
        </a>
        <a
          href="https://www.linkedin.com/in/robin0607saha/"
          target="_blank"
          rel="noopener noreferrer"
          className="glass rounded-full px-4 py-2 text-white/70 transition-colors hover:text-white"
        >
          LinkedIn
        </a>
        <a
          href="mailto:arabinda.saha06.07@gmail.com"
          className="glass rounded-full px-4 py-2 text-white/70 transition-colors hover:text-white"
        >
          Email
        </a>
      </nav>
    </div>

    <div className="mx-auto mt-6 max-w-[1100px] border-t border-white/10 px-7 pt-5 text-xs text-white/35">
      © {new Date().getFullYear()} Future Canvas · Arabinda Saha
    </div>
  </footer>
);

export default LandingFooter;
