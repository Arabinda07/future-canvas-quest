import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AlertTriangle, ArrowRight, Loader2, ShieldCheck, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSupabaseClient } from "@/lib/backend/supabase";
import { useAuth } from "@/context/AuthContext";
import { parseCounselorAccessParams, hasValidCounselorAccessSession, loadCounselorAccessSession } from "@/features/counselor/accessSession";
import { toast } from "@/hooks/use-toast";

const CounselorLogin = () => {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const parsedParams = useMemo(() => parseCounselorAccessParams(searchParams), [searchParams]);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If the counselor accesses an invite URL, intercept it to retain the invite mode in LocalStorage temporarily.
    // If they log in successfully, we read this in the Dashboard to claim the batch!
    if (parsedParams?.batchCode && parsedParams?.adminToken) {
      window.localStorage.setItem("pending_batch_claim", JSON.stringify(parsedParams));
    }
  }, [parsedParams]);

  useEffect(() => {
    if (session && !loading) {
      navigate("/counselor/dashboard", { replace: true });
    }
  }, [session, loading, navigate]);

  const handleAuth = async (mode: "login" | "signup") => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setAuthLoading(true);
    setError(null);
    const supabase = getSupabaseClient()!;

    try {
      if (mode === "login") {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      } else {
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        toast({
          title: "Account created!",
          description: "Sign in with your new credentials.",
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  const existingLegacySession = loadCounselorAccessSession();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden px-4 py-6 sm:px-6">
      <div className="absolute inset-0 pointer-events-none">
        <div className="glow-blob w-[28rem] h-[28rem] bg-[hsl(var(--lavender-glow)/0.12)] -top-24 -left-24" />
        <div className="glow-blob w-[26rem] h-[26rem] bg-[hsl(var(--mint-glow)/0.1)] bottom-0 -right-20" style={{ animationDuration: "16s" }} />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl items-center">
        <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/65">
              <ShieldCheck size={14} />
              Counselor shell
            </div>
            <div className="space-y-4">
              <h1 className="text-[clamp(2.2rem,6vw,4.5rem)] leading-[0.95]">Counselor access for real school-issued dashboards.</h1>
              <p className="max-w-2xl text-sm sm:text-base leading-7 text-white/55">
                Sign in to your counselor account to view your school batches, student analytics, and assessment reports natively.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="rounded-full gradient-accent text-primary-foreground border-0 shadow-lg hover:opacity-95"
                onClick={() => navigate("/")}
              >
                Back to site
                <ArrowRight size={18} />
              </Button>
              {existingLegacySession && hasValidCounselorAccessSession(existingLegacySession) && !session ? (
                <Button
                  variant="ghost"
                  size="lg"
                  className="rounded-full text-white/60 hover:text-white hover:bg-white/[0.05]"
                  onClick={() => {
                    window.localStorage.setItem("pending_batch_claim", JSON.stringify({ batchCode: existingLegacySession.batchCode, adminToken: existingLegacySession.adminToken }));
                    toast({ title: "Legacy Session Found", description: "Sign in or sign up to migrate your legacy school batch." });
                  }}
                >
                  Migrate {existingLegacySession.schoolName}
                </Button>
              ) : null}
            </div>
          </section>

          <Card className="border-white/10 bg-white/[0.03] shadow-card backdrop-blur">
            <Tabs defaultValue="login" className="w-full">
              <CardHeader className="pb-3 border-b border-white/10">
                <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-white/[0.03] border border-white/5">
                  <TabsTrigger value="login" className="rounded-xl data-[state=active]:bg-white/[0.08] data-[state=active]:text-white transition-all text-white/60">
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="rounded-xl data-[state=active]:bg-white/[0.08] data-[state=active]:text-white transition-all text-white/60">
                    Sign Up
                  </TabsTrigger>
                </TabsList>
              </CardHeader>

              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-white/70">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="counselor@school.edu"
                      className="min-h-[50px] pl-10 rounded-2xl bg-white/[0.04] border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-white/70">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="min-h-[50px] pl-10 rounded-2xl bg-white/[0.04] border-white/10 text-white"
                    />
                  </div>
                </div>

                {error ? (
                  <div className="rounded-2xl border border-[hsl(var(--destructive)/0.35)] bg-[hsl(var(--destructive)/0.08)] px-4 py-3 text-sm leading-6 text-white/80">
                    <div className="flex items-start gap-3">
                      <AlertTriangle size={16} className="mt-1 shrink-0 text-[hsl(var(--destructive))]" />
                      <span>{error}</span>
                    </div>
                  </div>
                ) : null}
              </CardContent>

              <CardFooter className="flex-col gap-3">
                <TabsContent value="login" className="w-full mt-0">
                  <Button
                    className="w-full min-h-[50px] rounded-full gradient-accent text-primary-foreground border-0 hover:opacity-95"
                    onClick={() => void handleAuth("login")}
                    disabled={authLoading}
                  >
                    {authLoading ? <Loader2 size={18} className="animate-spin" /> : null}
                    Secure Sign In
                  </Button>
                </TabsContent>
                <TabsContent value="signup" className="w-full mt-0">
                  <Button
                    className="w-full min-h-[50px] rounded-full gradient-accent text-primary-foreground border-0 hover:opacity-95"
                    onClick={() => void handleAuth("signup")}
                    disabled={authLoading}
                  >
                    {authLoading ? <Loader2 size={18} className="animate-spin" /> : null}
                    Create Counselor Account
                  </Button>
                </TabsContent>
                
                <Button
                  variant="ghost"
                  className="w-full rounded-full text-white/60 hover:text-white hover:bg-white/[0.05]"
                  onClick={() => navigate("/counselor/register")}
                >
                  Need administrative school access? Register here
                </Button>
              </CardFooter>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CounselorLogin;
