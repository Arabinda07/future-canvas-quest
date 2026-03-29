const PMShriStrip = () => (
  <div className="py-3.5 border-t border-white/[0.06] border-b border-b-white/[0.06]" style={{ background: "linear-gradient(90deg, hsl(250 30% 15%) 0%, hsl(250 20% 23%) 50%, hsl(250 30% 15%) 100%)" }}>
    <div className="max-w-[1080px] mx-auto px-6">
      <div className="flex items-center justify-center gap-2.5 flex-wrap text-center">
        <span className="inline-flex items-center gap-[7px] bg-sunshine/[0.12] border border-sunshine/25 rounded-full px-3.5 py-1 text-[0.72rem] font-extrabold tracking-[0.07em] uppercase text-sunshine">
          <span className="w-1.5 h-1.5 rounded-full bg-sunshine shrink-0" />
          PM SHRI Schools
        </span>
        <span className="text-white/20">·</span>
        <span className="text-white/60 text-sm">
          Deployed as part of <strong className="text-white/90 font-semibold">PM SHRI career readiness programs</strong> at Kendriya Vidyalayas
        </span>
        <span className="text-white/20">·</span>
        <span className="text-white/60 text-sm">
          <strong className="text-white/90 font-semibold">Government of India · NEP 2020</strong>
        </span>
      </div>
    </div>
  </div>
);

export default PMShriStrip;
