import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AlertTriangle, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  clearCounselorAccessSession,
  hasValidCounselorAccessSession,
  loadCounselorAccessSession,
  parseCounselorAccessParams,
  saveCounselorAccessSession,
} from "@/features/counselor/accessSession";
import { validateCounselorAccess } from "@/lib/backend/counselorGateway";

const CounselorLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const parsedParams = useMemo(() => parseCounselorAccessParams(searchParams), [searchParams]);
  const nextPath = searchParams.get("next") || "/counselor/dashboard";
  const [batchCode, setBatchCode] = useState(parsedParams?.batchCode ?? "");
  const [adminToken, setAdminToken] = useState(parsedParams?.adminToken ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const existingSession = loadCounselorAccessSession();

  useEffect(() => {
    if (parsedParams) {
      setBatchCode(parsedParams.batchCode);
      setAdminToken(parsedParams.adminToken);
    }
  }, [parsedParams]);

  useEffect(() => {
    if (!parsedParams || isLoading) return;

    void handleValidate(parsedParams.batchCode, parsedParams.adminToken);
  }, [parsedParams]);

  const handleValidate = async (providedBatchCode?: string, providedAdminToken?: string) => {
    const resolvedBatchCode = (providedBatchCode ?? batchCode).trim().toUpperCase();
    const resolvedAdminToken = (providedAdminToken ?? adminToken).trim();

    if (!resolvedBatchCode || !resolvedAdminToken) {
      setError("Enter both the school batch code and access token.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await validateCounselorAccess(resolvedBatchCode, resolvedAdminToken);

      if (!result.valid || !result.schoolName) {
        clearCounselorAccessSession();
        setError(result.error ?? "This invite link is invalid or expired.");
        return;
      }

      saveCounselorAccessSession({
        batchCode: result.batchCode ?? resolvedBatchCode,
        adminToken: resolvedAdminToken,
        schoolName: result.schoolName,
        validUntil: result.validUntil,
      });

      navigate(nextPath, { replace: true });
    } catch (validationError) {
      clearCounselorAccessSession();
      setError(validationError instanceof Error ? validationError.message : "We couldn't validate this counselor access link.");
    } finally {
      setIsLoading(false);
    }
  };

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
                Open the school invite link or paste the batch code and access token below. We validate the link before opening the dashboard.
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
              {existingSession && hasValidCounselorAccessSession(existingSession) ? (
                <Button
                  variant="ghost"
                  size="lg"
                  className="rounded-full text-white/60 hover:text-white hover:bg-white/[0.05]"
                  onClick={() => navigate("/counselor/dashboard")}
                >
                  Continue as {existingSession.schoolName}
                </Button>
              ) : null}
            </div>
          </section>

          <Card className="border-white/10 bg-white/[0.03] shadow-card backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl">Counselor sign-in</CardTitle>
              <CardDescription className="text-white/55">
                Sign in with the school batch code and the private dashboard token from your invite link.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="batch-code" className="text-sm font-medium text-white/70">
                  School batch code
                </label>
                <Input
                  id="batch-code"
                  value={batchCode}
                  onChange={(event) => setBatchCode(event.target.value.toUpperCase())}
                  placeholder="e.g. KVKGP2025"
                  className="min-h-[50px] rounded-2xl bg-white/[0.04] border-white/10 text-white placeholder:text-white/30"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="access-token" className="text-sm font-medium text-white/70">
                  Access token
                </label>
                <Input
                  id="access-token"
                  value={adminToken}
                  onChange={(event) => setAdminToken(event.target.value)}
                  placeholder="Paste the token from your invite link"
                  className="min-h-[50px] rounded-2xl bg-white/[0.04] border-white/10 text-white placeholder:text-white/30"
                />
              </div>

              <Button
                className="w-full min-h-[50px] rounded-full gradient-accent text-primary-foreground border-0 hover:opacity-95"
                onClick={() => void handleValidate()}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : null}
                Continue to dashboard
              </Button>

              {error ? (
                <div className="rounded-2xl border border-[hsl(var(--destructive)/0.35)] bg-[hsl(var(--destructive)/0.08)] px-4 py-3 text-sm leading-6 text-white/80">
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={16} className="mt-1 shrink-0 text-[hsl(var(--destructive))]" />
                    <span>{error}</span>
                  </div>
                </div>
              ) : null}

              <p className="text-xs leading-6 text-white/40">
                Invite-link access is batch-scoped. The dashboard only loads reports owned by the validated school batch.
              </p>

              <Button
                variant="ghost"
                className="w-full rounded-full text-white/60 hover:text-white hover:bg-white/[0.05]"
                onClick={() => navigate("/counselor/register")}
              >
                Need school access? Counselor registration
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CounselorLogin;
