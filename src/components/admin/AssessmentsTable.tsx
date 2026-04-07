import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Search, ChevronDown, ChevronRight } from "lucide-react";

interface Assessment {
  id: string;
  student_name: string;
  student_email: string | null;
  student_class: string | null;
  counselor_code: string | null;
  payment_status: string;
  payment_id: string | null;
  generated_report: unknown;
  scores: unknown;
  created_at: string;
  answers: unknown;
}

interface AssessmentsTableProps {
  assessments: Assessment[];
  loading: boolean;
}

const AssessmentsTable = ({ assessments, loading }: AssessmentsTableProps) => {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = assessments.filter((a) => {
    const q = search.toLowerCase();
    return (
      a.student_name.toLowerCase().includes(q) ||
      (a.counselor_code || "").toLowerCase().includes(q) ||
      (a.student_email || "").toLowerCase().includes(q)
    );
  });

  return (
    <>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or counselor code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <p className="text-muted-foreground text-center py-12">Loading…</p>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8" />
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Counselor</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Report</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    No assessments found.
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((a) => (
                <>
                  <TableRow
                    key={a.id}
                    className="cursor-pointer"
                    onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
                  >
                    <TableCell>
                      {expandedId === a.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </TableCell>
                    <TableCell className="font-medium">{a.student_name}</TableCell>
                    <TableCell>{a.student_class || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{a.student_email || "—"}</TableCell>
                    <TableCell>{a.counselor_code || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={a.payment_status === "paid" ? "default" : "secondary"}>
                        {a.payment_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={a.generated_report ? "default" : "outline"}>
                        {a.generated_report ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {new Date(a.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                  {expandedId === a.id && (
                    <TableRow key={`${a.id}-detail`}>
                      <TableCell colSpan={8}>
                        <div className="p-4 space-y-3">
                          <p className="text-xs text-muted-foreground">Assessment ID: {a.id}</p>
                          {a.scores && (
                            <div>
                              <p className="text-sm font-semibold mb-1">Scores</p>
                              <pre className="text-xs bg-muted rounded p-3 overflow-auto max-h-48">
                                {JSON.stringify(a.scores, null, 2)}
                              </pre>
                            </div>
                          )}
                          {a.generated_report && (
                            <div>
                              <p className="text-sm font-semibold mb-1">Generated Report</p>
                              <pre className="text-xs bg-muted rounded p-3 overflow-auto max-h-64">
                                {JSON.stringify(a.generated_report, null, 2)}
                              </pre>
                            </div>
                          )}
                          {!a.generated_report && !a.scores && (
                            <p className="text-sm text-muted-foreground">No report or scores available yet.</p>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
};

export default AssessmentsTable;
