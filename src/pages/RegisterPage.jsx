import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/navigation/Logo";
import Button from "../components/common/Button";
import Divider from "../components/common/Divider";
import { UserPlus, ArrowRight, ShieldCheck } from "lucide-react";

/**
 * RegisterPage (/register) Shell Component for NOVA PANEL
 * Prototype auth UI shell (no backend/auth logic implemented as instructed).
 */
export default function RegisterPage() {
  const [handle, setHandle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/login");
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
            Create Reader Account
          </h1>
          <p className="text-xs sm:text-sm text-content-secondary mt-1.5 leading-relaxed">
            Join the digital publishing community and track your reading milestones.
          </p>
        </div>

        {/* Form Shell */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="handle"
              className="block text-xs font-bold uppercase tracking-wider text-content-secondary mb-1.5"
            >
              Reader Handle / Username
            </label>
            <input
              id="handle"
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="e.g. AstralNomad"
              className="w-full px-4 py-3 rounded-xl bg-background-elevated/70 border border-border-subtle text-sm text-content-primary placeholder:text-content-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-200"
            />
          </div>

          <div>
            <label
              htmlFor="reg-email"
              className="block text-xs font-bold uppercase tracking-wider text-content-secondary mb-1.5"
            >
              Email Address
            </label>
            <input
              id="reg-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="w-full px-4 py-3 rounded-xl bg-background-elevated/70 border border-border-subtle text-sm text-content-primary placeholder:text-content-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-200"
            />
          </div>

          <div>
            <label
              htmlFor="reg-password"
              className="block text-xs font-bold uppercase tracking-wider text-content-secondary mb-1.5"
            >
              Master Password
            </label>
            <input
              id="reg-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full px-4 py-3 rounded-xl bg-background-elevated/70 border border-border-subtle text-sm text-content-primary placeholder:text-content-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-200"
            />
          </div>

          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              defaultChecked
              className="mt-0.5 rounded border-border-subtle bg-background-card text-accent focus:ring-accent"
            />
            <label htmlFor="terms" className="text-xs text-content-secondary leading-relaxed select-none">
              I agree to the Terms of Service and Content Guidelines of NOVA PANEL.
            </label>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              icon={<UserPlus className="w-4 h-4" />}
            >
              Complete Registration
            </Button>
          </div>
        </form>

        <Divider label="or sign up with" />

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

        {/* Switch to Login */}
        <p className="mt-8 text-center text-xs text-content-secondary">
          Already registered in the archive?{" "}
          <Link
            to="/login"
            className="font-semibold text-accent hover:underline inline-flex items-center gap-1"
          >
            Sign In Instead <ArrowRight className="w-3 h-3" />
          </Link>
        </p>
      </div>
    </div>
  );
}
