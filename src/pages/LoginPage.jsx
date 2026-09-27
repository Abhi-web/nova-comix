import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../components/navigation/Logo";
import Button from "../components/common/Button";
import Divider from "../components/common/Divider";
import { LogIn, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

/**
 * LoginPage (/login) Component for NOVA PANEL
 * Full JWT backend authentication integration.
 */
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await login(email, password);
      toast.success(`Welcome back, ${result.user.name}!`);

      // Determine redirect target
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else if (result.user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Invalid credentials. Please verify your email and password.");
      toast.error(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFillAdmin = () => {
    setEmail("admin@novapanel.local");
    setPassword("AdminPassword123!");
    setError(null);
  };

  return (
    <div className="py-12 sm:py-16 flex items-center justify-center animate-fadeIn relative">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-md p-6 sm:p-9 rounded-3xl bg-background-card/90 backdrop-blur-xl border border-border-subtle shadow-2xl relative">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-3.5">
            <Logo />
          </div>
          <h1 className="text-2xl font-extrabold text-content-primary tracking-tight">
            Welcome to the Archive
          </h1>
          <p className="text-xs sm:text-sm text-content-secondary mt-1.5 leading-relaxed">
            Access your personalized reading library and administrator console.
          </p>
        </div>

        {/* Development Quick-Fill Helper */}
        <div className="mb-6 p-3.5 rounded-xl bg-accent/10 border border-accent/25 flex items-center justify-between gap-2.5 text-xs text-accent shadow-glow-accent/5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="font-semibold">Dev Admin Credentials</span>
          </div>
          <button
            type="button"
            onClick={handleQuickFillAdmin}
            className="text-[11px] underline font-bold hover:text-white transition-colors"
          >
            Auto-fill
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-bold uppercase tracking-wider text-content-secondary mb-1.5"
            >
              Email Address / Handle
            </label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="reader@novapanel.io or admin@novapanel.local"
              required
              className="w-full px-4 py-3 rounded-xl bg-background-elevated/70 border border-border-subtle text-sm text-content-primary placeholder:text-content-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-200"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-content-secondary"
              >
                Password
              </label>
              <a
                href="#forgot"
                className="text-xs text-accent hover:underline font-semibold"
              >
                Forgot?
              </a>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full px-4 py-3 rounded-xl bg-background-elevated/70 border border-border-subtle text-sm text-content-primary placeholder:text-content-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-200"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="remember"
              defaultChecked
              className="rounded border-border-subtle bg-background-card text-accent focus:ring-accent"
            />
            <label htmlFor="remember" className="text-xs text-content-secondary select-none">
              Remember this session on this device
            </label>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={loading}
              icon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
            >
              {loading ? "Authenticating..." : "Sign In to Archive"}
            </Button>
          </div>
        </form>

        <Divider label="or continue with" />

        {/* Social / Federated Options */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-background-card hover:bg-background-cardHover border border-border-subtle text-xs font-medium text-content-secondary hover:text-content-primary transition-colors"
          >
            <span>Discord</span>
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-background-card hover:bg-background-cardHover border border-border-subtle text-xs font-medium text-content-secondary hover:text-content-primary transition-colors"
          >
            <span>Google</span>
          </button>
        </div>

        {/* Switch to Register */}
        <p className="mt-8 text-center text-xs text-content-secondary">
          Don't have an archival pass yet?{" "}
          <Link
            to="/register"
            className="font-semibold text-accent hover:underline inline-flex items-center gap-1"
          >
            Create an Account <ArrowRight className="w-3 h-3" />
          </Link>
        </p>
      </div>
    </div>
  );
}
