const LandingFooter = () => (
  <footer className="bg-background border-t border-white/10 py-12 pb-8">
    <div className="max-w-[1100px] mx-auto px-7">
      <div className="flex flex-col sm:flex-row justify-between items-start flex-wrap gap-8 mb-9">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(124,107,202,0.2)", border: "1px solid rgba(124,107,202,0.3)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="9" r="4" stroke="rgba(200,185,255,0.8)" strokeWidth="2" />
                <path d="M5 20c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="rgba(200,185,255,0.8)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-heading italic text-[1.1rem] text-white/80">Future Canvas</span>
          </div>
          <p className="text-[0.82rem] font-light text-white/40 max-w-[240px] leading-[1.65]">A personal initiative giving Class 9–12 students a science-backed path to career clarity — not just a guess.</p>
        </div>

        {/* Contact */}
        <div>
          <div className="text-[0.68rem] font-semibold tracking-[0.1em] uppercase text-white/30 mb-3">Arabinda Saha</div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[0.82rem] font-light text-white/40">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <a href="mailto:arabinda.saha06.07@gmail.com" className="text-white/50 hover:text-gold transition-colors">arabinda.saha06.07@gmail.com</a>
            </div>
            <div className="flex items-center gap-2 text-[0.82rem] font-light text-white/40">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              <a href="https://wa.me/918240959567" className="text-white/50 hover:text-gold transition-colors">+91 82409 59567</a>
            </div>
            <div className="flex items-center gap-2 text-[0.82rem] font-light text-white/40">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Durgapur, West Bengal
            </div>
            <div className="flex items-center gap-2 text-[0.82rem] font-light text-white/40">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
              <a href="https://www.linkedin.com/in/robin0607saha/" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-gold transition-colors">linkedin.com/in/robin0607saha</a>
            </div>
            <div className="flex items-center gap-2 text-[0.82rem] font-light text-white/40">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
              <a href="https://arabinda07.github.io/" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-gold transition-colors">Portfolio ↗</a>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center flex-wrap gap-3 text-[0.72rem] font-light text-white/30">
        <span>© {new Date().getFullYear()} Future Canvas · Arabinda Saha · Personal Initiative</span>
        <span>Originally deployed in PM SHRI Schools · Now independent</span>
      </div>
    </div>
  </footer>
);

export default LandingFooter;
