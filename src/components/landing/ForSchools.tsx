import { useState } from "react";
import { Check, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

const ForSchools = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim()) return;
    setSubmitted(true);
  };

  const points = [
    "Works on any device — phone, tablet, or computer",
    "Generates instant personalised reports per student",
    "Aligned with NEP 2020's holistic development framework",
    "I personally support every school that uses it — no handoff",
    "Already tested with 480+ students at KV-2 Kharagpur",
  ];

  return (
    <section id="schools" className="py-20 lg:py-24 relative overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(260 45% 35%) 0%, hsl(260 40% 30%) 50%, hsl(250 30% 15%) 100%)" }}>
      <div className="absolute -top-20 -right-16 w-[350px] h-[350px] rounded-full bg-sunshine/15 blur-[60px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-10 w-[280px] h-[280px] rounded-full bg-secondary/12 blur-[60px] pointer-events-none" />

      <div className="max-w-[1080px] mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <motion.div initial={{ y: 28, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.1em] text-sunshine bg-white/[0.12] border border-white/20 px-3.5 py-1.5 rounded-full mb-5">
              <Mail size={12} />
              For teachers & principals
            </div>
            <h2 className="font-heading text-[clamp(1.8rem,3vw,2.6rem)] font-bold text-white mb-3.5">
              Want to bring this
              <br />
              to <em className="italic text-sunshine">your school?</em>
            </h2>
            <p className="text-white/65 text-base leading-relaxed mb-7">
              I'm currently working with schools one at a time. If you're a teacher or principal interested in running this assessment for your Class 9–12 students, I'd love to speak with you directly.
            </p>
            <div className="space-y-2.5 mb-8">
              {points.map((p) => (
                <div key={p} className="flex items-start gap-3 text-white/80 text-sm">
                  <div className="w-6 h-6 rounded-full bg-sunshine/20 border border-sunshine/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} className="text-sunshine" />
                  </div>
                  {p}
                </div>
              ))}
            </div>
            <div className="flex gap-3 flex-wrap">
              <a href="mailto:arabinda.saha06.07@gmail.com" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm text-white" style={{ background: "linear-gradient(135deg, hsl(160 40% 55%), hsl(160 45% 40%))" }}>
                Email me directly
              </a>
              <a href="https://wa.me/918240959567" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm text-white border-2 border-white/35 hover:bg-white/10 transition-colors">
                WhatsApp me
              </a>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div initial={{ y: 28, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <div className="bg-card rounded-3xl p-7 shadow-card-hover">
              {!submitted ? (
                <>
                  <h3 className="font-heading text-xl font-bold text-foreground mb-1">Let's talk</h3>
                  <p className="text-muted-foreground text-sm mb-6">Fill this in and I'll reach out within 24 hours.</p>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-extrabold">Your Name</Label>
                      <Input placeholder="e.g. Sunita Verma" value={name} onChange={(e) => setName(e.target.value)} className="rounded-[10px] border-border bg-background" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-extrabold">Your Role</Label>
                      <Select>
                        <SelectTrigger className="rounded-[10px] border-border bg-background">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {["Principal", "Vice Principal", "School Counsellor", "Teacher", "Parent", "Education Officer", "Other"].map((r) => (
                            <SelectItem key={r} value={r}>{r}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1.5 mb-3">
                    <Label className="text-xs font-extrabold">School Name & City</Label>
                    <Input placeholder="e.g. KV No. 1, Siliguri" className="rounded-[10px] border-border bg-background" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-extrabold">WhatsApp Number</Label>
                      <Input type="tel" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-[10px] border-border bg-background" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-extrabold">No. of Students</Label>
                      <Select>
                        <SelectTrigger className="rounded-[10px] border-border bg-background">
                          <SelectValue placeholder="Approx. count" />
                        </SelectTrigger>
                        <SelectContent>
                          {["Under 40", "40–80", "80–150", "150–300", "300+"].map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1.5 mb-4">
                    <Label className="text-xs font-extrabold">Anything you'd like to discuss? <span className="text-muted-foreground font-normal">(optional)</span></Label>
                    <Textarea placeholder="e.g. We want to run this before stream selection for Class 10…" className="rounded-[10px] border-border bg-background min-h-[80px]" />
                  </div>
                  <Button className="w-full gradient-accent text-primary-foreground font-bold rounded-full min-h-[48px]" onClick={handleSubmit}>
                    Send message →
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-2.5">I respond personally, usually within a few hours.</p>
                </>
              ) : (
                <div className="text-center py-7">
                  <div className="text-5xl mb-3">🎉</div>
                  <h3 className="font-heading text-xl font-bold text-foreground mb-2">Thanks! I'll be in touch soon.</h3>
                  <p className="text-muted-foreground text-sm">I personally read every message and will reply within 24 hours — usually much sooner on WhatsApp.</p>
                  <div className="flex gap-2.5 justify-center mt-5 flex-wrap">
                    <a href="mailto:arabinda.saha06.07@gmail.com" className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold border-2 border-lavender-light text-primary hover:bg-lavender-light transition-colors">Email me directly</a>
                    <a href="https://wa.me/918240959567" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold text-primary-foreground" style={{ background: "linear-gradient(135deg, hsl(160 40% 55%), hsl(160 45% 40%))" }}>WhatsApp instead</a>
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
