import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, FileText } from "lucide-react";

interface AdminStatsProps {
  total: number;
  paid: number;
  reports: number;
}

const AdminStats = ({ total, paid, reports }: AdminStatsProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Users className="h-4 w-4" /> Total Submissions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{total}</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <CreditCard className="h-4 w-4" /> Paid
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-secondary">{paid}</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <FileText className="h-4 w-4" /> Reports Generated
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-primary">{reports}</p>
      </CardContent>
    </Card>
  </div>
);

export default AdminStats;
