"use client";
import { useState } from "react";
import { Upload, Download, FileSpreadsheet } from "lucide-react";
import { adminApi } from "@/lib/api/admin.api";
import { getApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/Button";

// CSV ke columns — header isi order me hone chahiye.
const COLUMNS = [
  "name", "phone", "gender", "dob", "maritalStatus", "motherTongue",
  "religion", "caste", "gotra", "manglikStatus", "diet",
  "height", "weight", "education", "professionType", "jobTitle",
  "companyName", "annualIncome", "state", "city",
];

// Number wale columns — string se number banana hai.
const NUMERIC = new Set(["height", "weight", "annualIncome"]);

// Ek CSV line ko fields me todo (quotes ke andar comma safe).
function splitLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (const ch of line) {
    if (ch === '"') inQuotes = !inQuotes;
    else if (ch === "," && !inQuotes) { out.push(cur); cur = ""; }
    else cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

export function BulkImport() {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ added: number; failed: number; errors: string[] } | null>(null);
  const [error, setError] = useState("");

  // Sample CSV download — admin isme bharke wapas upload kare.
  const downloadTemplate = () => {
    const csv = COLUMNS.join(",") + "\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "profiles-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(""); setResult(null); setBusy(true);

    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter((l) => l.trim());
      // Pehli line header — usko chhod do.
      const rows = lines.slice(1).map((line) => {
        const cells = splitLine(line);
        const row: Record<string, string | number> = {};
        COLUMNS.forEach((col, i) => {
          const val = cells[i] ?? "";
          if (!val) return;
          row[col] = NUMERIC.has(col) ? Number(val) : val;
        });
        return row;
      }).filter((r) => r.name); // bina naam wali row skip

      if (rows.length === 0) {
        setError("CSV me koi valid row nahi mili.");
        return;
      }
      const res = await adminApi.bulkAddProfiles(rows);
      setResult(res);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };

  return (
    <div className="card p-5 mt-8">
      <div className="flex items-center gap-2 mb-1">
        <FileSpreadsheet size={18} className="text-maroon" />
        <h3 className="font-display text-maroon">Bulk Import</h3>
      </div>
      <p className="text-muted text-sm mb-4">
        Upload a CSV to add many profiles at once. Download the template, fill one row per profile, then upload.
      </p>

      <div className="flex flex-wrap gap-3">
        <Button variant="ghost" onClick={downloadTemplate}>
          <Download size={16} /> Template
        </Button>
        <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm cursor-pointer bg-gradient-to-b from-gold-light to-gold text-[#3A2A10] shadow-gold hover:shadow-lg transition-shadow press">
          {busy ? (
            <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
          ) : (
            <Upload size={16} />
          )}
          Upload CSV
          <input type="file" accept=".csv" className="hidden" onChange={handleFile} disabled={busy} />
        </label>
      </div>

      {error && <p className="text-red-600 text-sm mt-3">{error}</p>}

      {result && (
        <div className="mt-4 text-sm">
          <p className="text-green-700 font-medium">{result.added} profiles added successfully.</p>
          {result.failed > 0 && (
            <div className="mt-2">
              <p className="text-amber-600 font-medium">{result.failed} failed:</p>
              <ul className="list-disc list-inside text-muted mt-1 max-h-40 overflow-y-auto">
                {result.errors.map((er, i) => <li key={i}>{er}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
