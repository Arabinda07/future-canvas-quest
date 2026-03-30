import { useState } from "react";
import { motion } from "framer-motion";

const ForSchools = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [nameErr, setNameErr] = useState(false);
  const [phoneErr, setPhoneErr] = useState(false);

  const handleSubmit = () => {
    setNameErr(!name.trim());
    setPhoneErr(!phone.trim());
    if (!name.trim() || !phone.trim()) return;
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 lg:py-28 relative overflow-hidden border-t border-white/10" style={{ background: "linear-gradient(160deg, #0d0b18 0%, #000 60%)" }}>
      <div className="glow-blob w-[600px] h-[600px] -top-[150px] -left-[100px]" style={{ background: "rgba(124,107,202,0.18)", animationDuration: "11s" }} />

      <div className="max-w-[1100px] mx-auto px-7">
        <div className="grid lg:grid-cols-2 gap-[72px] items-start relative z-[1]">
          {/* Left text */}
          <motion.div initial={{ y: 28, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}>
            <div className="glass inline-flex items-center gap-2 text-[0.72rem] font-medium tracking-[0.08em] uppercase px-4 py-1.5 rounded-full mb-5" style={{ color: "rgba(245,200,66,0.8)" }}>
              <span className="w-[5px] h-[5px] rounded-full bg-gold shrink-0" />
              For teachers & principals
            </div>
            <h2 className="font-heading italic text-[clamp(2.4rem,4.5vw,3.8rem)] text-white mb-5">
              Bring Future Canvas<br /><em>to your school</em>
            </h2>
            <p className="text-white/60 text-[0.97rem] font-light leading-[1.85] mb-7">
              I'm working with schools one at a time — personally supporting every deployment, from setup to counsellor debrief. If you're a teacher or principal interested in running this for your Class 9–12 students, I'd like to speak with you directly.
            </p>
            <div className="grid gap-2.5 mb-8">
              {[
                "Works on any device — no installation needed",
                "Instant personalised reports for every student",
                "I personally support every school — no handoff to a team",
                "Completely free for students, always",
              ].map((p) => (
                <div key={p} className="flex items-start gap-3 text-white/60 text-[0.9rem] font-light">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[0.6rem]" style={{ background: "rgba(124,107,202,0.15)", border: "1px solid rgba(124,107,202,0.3)", color: "rgba(180,165,255,0.9)" }}>✓</div>
                  {p}
                </div>
              ))}
            </div>
            <div className="flex gap-2.5 flex-wrap">
              <a href="mailto:arabinda.saha06.07@gmail.com" className="inline-flex items-center gap-2 bg-white text-black font-medium text-[0.9rem] px-7 py-3 rounded-full hover:bg-white/90 hover:-translate-y-0.5 transition-all">Email directly</a>
              <a href="https://wa.me/918240959567" target="_blank" rel="noopener noreferrer" className="glass-strong inline-flex items-center gap-2 text-white font-medium text-[0.9rem] px-7 py-3 rounded-full hover:-translate-y-0.5 transition-transform">WhatsApp</a>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div initial={{ y: 28, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.15 }}>
            <div className="glass-strong rounded-[20px] p-9">
              {!submitted ? (
                <>
                  <h3 className="font-heading italic text-[2rem] text-white mb-1.5">Let's talk</h3>
                  <p className="text-white/50 text-[0.88rem] font-light leading-[1.65] mb-7">Leave your details and I'll reach back personally — usually the same day on WhatsApp.</p>

                  <div className="grid grid-cols-2 gap-3.5 mb-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[0.68rem] font-medium text-white/40 tracking-[0.07em] uppercase">Your name</label>
                      <input
                        type="text" placeholder="e.g. Sunita Verma" value={name} onChange={(e) => { setName(e.target.value); setNameErr(false); }}
                        className={`px-3.5 py-3 rounded-[10px] border bg-white/5 text-white/90 text-[0.92rem] font-light placeholder:text-white/30 outline-none transition-all focus:border-primary/60 focus:shadow-[0_0_0_3px_rgba(124,107,202,0.12)] focus:bg-white/[0.06] ${nameErr ? "border-[rgba(240,124,90,0.7)]" : "border-white/20"}`}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[0.68rem] font-medium text-white/40 tracking-[0.07em] uppercase">Your role</label>
                      <select className="px-3.5 py-3 rounded-[10px] border border-white/20 bg-white/5 text-white/90 text-[0.92rem] font-light outline-none focus:border-primary/60 appearance-none cursor-pointer">
                        <option value="">Select role</option>
                        {["Principal", "Vice Principal", "School Counsellor", "Teacher", "Parent", "Education Officer", "Other"].map((r) => (
                          <option key={r} value={r} className="bg-[#1a1a2e] text-white">{r}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 mb-4">
                    <label className="text-[0.68rem] font-medium text-white/40 tracking-[0.07em] uppercase">
                      WhatsApp number <span className="text-[rgba(240,124,90,0.8)] font-light">*</span>
                    </label>
                    <input
                      type="tel" placeholder="+91 98765 43210" value={phone} onChange={(e) => { setPhone(e.target.value); setPhoneErr(false); }}
                      className={`px-3.5 py-3 rounded-[10px] border bg-white/5 text-white/90 text-[0.92rem] font-light placeholder:text-white/30 outline-none transition-all focus:border-primary/60 focus:shadow-[0_0_0_3px_rgba(124,107,202,0.12)] focus:bg-white/[0.06] ${phoneErr ? "border-[rgba(240,124,90,0.7)]" : "border-white/20"}`}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 mb-4">
                    <label className="text-[0.68rem] font-medium text-white/40 tracking-[0.07em] uppercase">School & city <span className="text-white/30 font-light text-[0.68rem] normal-case tracking-normal">(optional)</span></label>
                    <input type="text" placeholder="e.g. KV No. 1, Durgapur" className="px-3.5 py-3 rounded-[10px] border border-white/20 bg-white/5 text-white/90 text-[0.92rem] font-light placeholder:text-white/30 outline-none transition-all focus:border-primary/60" />
                  </div>
                  <div className="flex flex-col gap-1.5 mb-4">
                    <label className="text-[0.68rem] font-medium text-white/40 tracking-[0.07em] uppercase">What's on your mind? <span className="text-white/30 font-light text-[0.68rem] normal-case tracking-normal">(optional)</span></label>
                    <textarea placeholder="e.g. We want to run this before stream selection for Class 10…" className="px-3.5 py-3 rounded-[10px] border border-white/20 bg-white/5 text-white/90 text-[0.92rem] font-light placeholder:text-white/30 outline-none resize-y min-h-[90px] leading-[1.6] transition-all focus:border-primary/60" />
                  </div>
                  <button onClick={handleSubmit} className="w-full glass-strong text-white font-medium text-[0.9rem] py-3.5 rounded-full hover:-translate-y-0.5 transition-transform">
                    Send →
                  </button>
                  <p className="text-[0.72rem] font-light text-white/30 text-center mt-2.5 leading-[1.55]">Only your name and WhatsApp are required. I read every message personally.</p>
                </>
              ) : (
                <div className="text-center py-9">
                  <div className="text-5xl mb-3.5">🙌</div>
                  <h3 className="font-heading italic text-[2rem] text-white mb-2">Message received.</h3>
                  <p className="text-white/50 text-[0.9rem] font-light leading-[1.7] mb-6">I personally read everything that comes in. I'll reply on WhatsApp, usually within a few hours. Looking forward to connecting.</p>
                  <div className="flex gap-2.5 justify-center flex-wrap">
                    <a href="mailto:arabinda.saha06.07@gmail.com" className="glass inline-flex items-center gap-2 text-white font-medium text-[0.82rem] px-5 py-2.5 rounded-full">Email instead</a>
                    <a href="https://wa.me/918240959567" target="_blank" rel="noopener noreferrer" className="bg-white text-black font-medium text-[0.82rem] px-5 py-2.5 rounded-full">Ping on WhatsApp</a>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ForSchools;
