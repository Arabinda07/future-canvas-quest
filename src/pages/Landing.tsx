import { useNavigate } from "react-router-dom";
import { Brain, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Brain, title: "70 Questions", desc: "Aptitude, RIASEC & Personality in one sitting." },
  { icon: Zap, title: "Instant AI Career Report", desc: "Personalized career paths generated in seconds." },
  { icon: ShieldCheck, title: "100% Privacy Focused", desc: "Your data is never shared with third parties." },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-5 py-4 flex items-center justify-between">
        <span className="font-heading text-lg font-bold text-primary">NextStep</span>
        <Button variant="outline" size="sm" onClick={() => navigate("/register")}>
          Get Started
        </Button>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-5 text-center max-w-lg mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full bg-teal-light px-4 py-1.5 text-sm font-medium text-accent mb-6">
          <Brain size={16} /> Career Assessment
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-primary leading-tight mb-4">
          Discover Your True Potential.
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg mb-8 leading-relaxed">
          A scientifically backed career assessment combining Aptitude, RIASEC, and Personality traits — designed for high school students.
        </p>
        <Button size="lg" className="w-full sm:w-auto min-h-[52px] text-base font-semibold px-10" onClick={() => navigate("/register")}>
          Start Free Assessment
        </Button>
      </main>

      {/* Value Props */}
      <section className="px-5 pb-12 pt-4 max-w-lg mx-auto w-full">
        <div className="grid gap-4">
          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-4 rounded-lg bg-card p-4 shadow-sm border">
              <div className="rounded-lg bg-teal-light p-2.5 shrink-0">
                <f.icon size={22} className="text-accent" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-primary text-sm">{f.title}</h3>
                <p className="text-muted-foreground text-sm mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;
