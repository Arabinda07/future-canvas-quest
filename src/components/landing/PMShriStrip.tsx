const PMShriStrip = () => (
  <div className="py-3.5 border-t border-white/10 border-b border-b-white/10" style={{ background: "rgba(255,255,255,0.03)" }}>
    <div className="max-w-[1100px] mx-auto px-7">
      <div className="flex items-center justify-center gap-3 flex-wrap text-center">
        <span className="inline-flex items-center gap-[7px] bg-[rgba(245,200,66,0.1)] border border-[rgba(245,200,66,0.25)] rounded-full px-3.5 py-1 text-[0.72rem] font-medium tracking-[0.08em] uppercase text-gold">
          <span className="w-[5px] h-[5px] rounded-full bg-gold shrink-0" />
          PM SHRI Schools
        </span>
        <span className="text-white/20">·</span>
        <span className="text-white/40 text-[0.85rem] font-light">
          Deployed as part of <strong className="text-white/70 font-medium">PM SHRI career readiness programs</strong> at Kendriya Vidyalayas — Government of India · <strong className="text-white/70 font-medium">NEP 2020</strong>
        </span>
      </div>
    </div>
  </div>
);

export default PMShriStrip;
