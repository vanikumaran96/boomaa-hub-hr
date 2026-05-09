import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, SkipForward, SkipBack, X, Sparkles } from "lucide-react";

type Step = {
  title: string;
  narration: string;
  route: string;
  duration: number; // seconds
  highlight?: string; // selector to softly highlight
};

const STEPS: Step[] = [
  {
    title: "Welcome — HR Hub for Boomaa Consultants",
    narration:
      "In the next 3 minutes I'll show you how HR Hub turns 4 hours of recruiter work into 30 seconds — without ever letting AI touch payroll math.",
    route: "/dashboard",
    duration: 20,
  },
  {
    title: "The Pipeline — Recruitment Kanban",
    narration:
      "Recruiters manage every candidate across Sourced → Interview → Placed. Drag-and-drop auto-creates a placement record with the client's billing fee.",
    route: "/recruitment",
    duration: 25,
    highlight: "[data-demo='kanban']",
  },
  {
    title: "AI Resume Screener — the leverage point",
    narration:
      "Paste a JD, upload a PDF or DOCX resume. Lovable AI returns a match score, matched skills, gaps, and a hiring recommendation in under 30 seconds.",
    route: "/recruitment",
    duration: 45,
    highlight: "[data-demo='screener']",
  },
  {
    title: "Payroll — deterministic, not AI",
    narration:
      "Money math stays in code. Attendance flows into payable days, salary breakdowns follow fixed ratios — auditable, reproducible, zero hallucination.",
    route: "/payroll",
    duration: 30,
    highlight: "[data-demo='payroll-table']",
  },
  {
    title: "One-click DOCX payslips",
    narration:
      "Generate a Word payslip per employee with our docx engine. Branch managers email these out — no formatting, no copy-paste errors.",
    route: "/payroll",
    duration: 25,
  },
  {
    title: "Analytics — the executive view",
    narration:
      "Live counts of employees, branches, open roles, placements, and recent candidates. The data layer all three modules write into one source of truth.",
    route: "/dashboard",
    duration: 30,
  },
  {
    title: "That's HR Hub — questions?",
    narration:
      "AI for judgment and language. Code for money and truth. Built end-to-end on Lovable Cloud + Lovable AI Gateway. Thank you!",
    route: "/dashboard",
    duration: 5,
  },
];

const TOTAL = STEPS.reduce((s, x) => s + x.duration, 0);

export function DemoMode() {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0); // within current step
  const [playing, setPlaying] = useState(false);
  const navigate = useNavigate();
  const lastRoute = useRef<string>("");

  const step = STEPS[idx];

  // Tick
  useEffect(() => {
    if (!open || !playing) return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [open, playing]);

  // Advance step when elapsed exceeds duration
  useEffect(() => {
    if (elapsed >= step.duration) {
      if (idx < STEPS.length - 1) {
        setIdx(idx + 1);
        setElapsed(0);
      } else {
        setPlaying(false);
      }
    }
  }, [elapsed, idx, step.duration]);

  // Navigate when step changes
  useEffect(() => {
    if (!open) return;
    if (lastRoute.current !== step.route) {
      navigate(step.route);
      lastRoute.current = step.route;
    }
  }, [open, step.route, navigate]);

  // Highlight pulse
  useEffect(() => {
    if (!open || !step.highlight) return;
    const el = document.querySelector(step.highlight) as HTMLElement | null;
    if (!el) return;
    el.classList.add("ring-4", "ring-primary", "ring-offset-2", "rounded-lg", "transition-all");
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    return () => {
      el.classList.remove("ring-4", "ring-primary", "ring-offset-2");
    };
  }, [open, idx, step.highlight]);

  const start = () => {
    setOpen(true);
    setIdx(0);
    setElapsed(0);
    setPlaying(true);
    lastRoute.current = "";
  };

  const stop = () => {
    setOpen(false);
    setPlaying(false);
  };

  const next = () => {
    if (idx < STEPS.length - 1) {
      setIdx(idx + 1);
      setElapsed(0);
    }
  };
  const prev = () => {
    if (idx > 0) {
      setIdx(idx - 1);
      setElapsed(0);
    }
  };

  // Total elapsed for global progress
  const globalElapsed =
    STEPS.slice(0, idx).reduce((s, x) => s + x.duration, 0) + elapsed;
  const globalPct = Math.min(100, (globalElapsed / TOTAL) * 100);

  if (!open) {
    return (
      <Button
        onClick={start}
        size="sm"
        className="fixed bottom-6 right-6 z-50 shadow-lg gap-2"
      >
        <Sparkles className="h-4 w-4" />
        Start 3-min Demo
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)]">
      <Card className="shadow-2xl border-primary/20">
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">
                Step {idx + 1} of {STEPS.length} · {Math.floor(globalElapsed / 60)}:
                {String(globalElapsed % 60).padStart(2, "0")} / {Math.floor(TOTAL / 60)}:
                {String(TOTAL % 60).padStart(2, "0")}
              </span>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={stop}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Progress value={globalPct} className="h-1" />

          <div>
            <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {step.narration}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <Button variant="ghost" size="sm" onClick={prev} disabled={idx === 0}>
              <SkipBack className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setPlaying((p) => !p)}
              className="flex-1 gap-2"
            >
              {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {playing ? "Pause" : "Resume"}
            </Button>
            <Button variant="ghost" size="sm" onClick={next} disabled={idx === STEPS.length - 1}>
              <SkipForward className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
