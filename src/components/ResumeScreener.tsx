import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Upload, Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ScreeningResult {
  matchScore: number;
  recommendation: "strong_match" | "good_match" | "partial_match" | "weak_match";
  summary: string;
  matchedSkills: string[];
  missingSkills: string[];
  strengths: string[];
  concerns: string[];
  yearsOfExperience: number;
}

const recommendationLabel: Record<ScreeningResult["recommendation"], string> = {
  strong_match: "Strong Match",
  good_match: "Good Match",
  partial_match: "Partial Match",
  weak_match: "Weak Match",
};

export const ResumeScreener = () => {
  const { toast } = useToast();
  const [candidateName, setCandidateName] = useState("");
  const [position, setPosition] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScreeningResult | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const extractPdfText = async (file: File): Promise<string> => {
    const pdfjs: any = await import("pdfjs-dist");
    // Use bundled worker via Vite ?url import
    const workerSrc = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
    pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
    const buf = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: buf }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((it: any) => it.str).join(" ") + "\n\n";
    }
    return text.trim();
  };

  const extractDocxText = async (file: File): Promise<string> => {
    const mammoth: any = await import("mammoth/mammoth.browser");
    const buf = await file.arrayBuffer();
    const { value } = await mammoth.extractRawText({ arrayBuffer: buf });
    return (value || "").trim();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setLoading(true);
    try {
      const lower = file.name.toLowerCase();
      let text = "";
      if (lower.endsWith(".pdf")) {
        text = await extractPdfText(file);
      } else if (lower.endsWith(".docx")) {
        text = await extractDocxText(file);
      } else if (lower.endsWith(".doc")) {
        toast({ title: "Legacy .doc not supported", description: "Please save as .docx or .pdf and re-upload.", variant: "destructive" });
        return;
      } else {
        text = await file.text();
      }
      if (!text || text.length < 20) {
        toast({ title: "Couldn't extract text", description: "The file appears to be empty or image-based. Try another file or paste text.", variant: "destructive" });
        return;
      }
      setResumeText(text);
      toast({ title: "Resume loaded", description: `${file.name} • ${text.length.toLocaleString()} chars extracted` });
    } catch (err: any) {
      toast({ title: "Could not read file", description: err?.message ?? "Try .pdf, .docx, or .txt.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleScreen = async () => {
    if (resumeText.trim().length < 30 || jobDescription.trim().length < 20) {
      toast({ title: "Missing input", description: "Provide both a resume and a job description.", variant: "destructive" });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("screen-resume", {
        body: { resumeText, jobDescription, candidateName, position },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setResult(data as ScreeningResult);
    } catch (err: any) {
      toast({ title: "Screening failed", description: err.message ?? "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = result
    ? result.matchScore >= 80
      ? "text-success"
      : result.matchScore >= 60
        ? "text-warning"
        : "text-destructive"
    : "";

  return (
    <Card className="shadow-card border-primary/20">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          AI Resume Screener
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Candidate Name (optional)</Label>
            <Input value={candidateName} onChange={(e) => setCandidateName(e.target.value)} placeholder="Jane Doe" />
          </div>
          <div>
            <Label className="text-xs">Position (optional)</Label>
            <Input value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Senior Frontend Engineer" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-xs">Resume</Label>
            <div className="flex items-center gap-2">
              <Input
                id="resume-file"
                type="file"
                accept=".txt,.md,.text"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button asChild variant="outline" size="sm">
                <label htmlFor="resume-file" className="cursor-pointer">
                  <Upload className="h-3 w-3 mr-1" /> Upload .txt
                </label>
              </Button>
              {fileName && <span className="text-xs text-muted-foreground truncate">{fileName}</span>}
            </div>
            <Textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Or paste the resume text here..."
              className="min-h-[180px] font-mono text-xs"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Job Description</Label>
            <Textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description, required skills, and responsibilities..."
              className="min-h-[220px] text-xs"
            />
          </div>
        </div>

        <Button onClick={handleScreen} disabled={loading} className="w-full sm:w-auto">
          {loading ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analyzing...</>
          ) : (
            <><Sparkles className="h-4 w-4 mr-2" /> Screen Resume</>
          )}
        </Button>

        {result && (
          <div className="space-y-4 rounded-lg border bg-muted/20 p-4 mt-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="text-xs text-muted-foreground">Match Score</p>
                <p className={`text-3xl font-bold ${scoreColor}`}>{result.matchScore}<span className="text-base text-muted-foreground">/100</span></p>
              </div>
              <Badge variant={result.matchScore >= 70 ? "default" : "secondary"} className="text-xs">
                {recommendationLabel[result.recommendation]}
              </Badge>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Est. Experience</p>
                <p className="text-lg font-semibold">{result.yearsOfExperience} yrs</p>
              </div>
            </div>
            <Progress value={result.matchScore} className="h-2" />

            <p className="text-sm text-foreground">{result.summary}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold flex items-center gap-1 mb-2 text-success">
                  <CheckCircle2 className="h-3 w-3" /> Matched Skills
                </p>
                <div className="flex flex-wrap gap-1">
                  {result.matchedSkills.length > 0 ? result.matchedSkills.map((s) => (
                    <Badge key={s} variant="outline" className="text-[10px] border-success/30 text-success">{s}</Badge>
                  )) : <span className="text-xs text-muted-foreground">None</span>}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold flex items-center gap-1 mb-2 text-destructive">
                  <XCircle className="h-3 w-3" /> Missing Skills
                </p>
                <div className="flex flex-wrap gap-1">
                  {result.missingSkills.length > 0 ? result.missingSkills.map((s) => (
                    <Badge key={s} variant="outline" className="text-[10px] border-destructive/30 text-destructive">{s}</Badge>
                  )) : <span className="text-xs text-muted-foreground">None</span>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold mb-2">Strengths</p>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                  {result.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              {result.concerns.length > 0 && (
                <div>
                  <p className="text-xs font-semibold flex items-center gap-1 mb-2 text-warning">
                    <AlertCircle className="h-3 w-3" /> Concerns
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                    {result.concerns.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
