import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";
import AdminStats from "@/components/admin/AdminStats";
import AssessmentsTable from "@/components/admin/AssessmentsTable";
import CampaignsTab from "@/components/admin/CampaignsTab";

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

const Admin = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("assessments")
        .select("*")
        .order("created_at", { ascending: false });
      setAssessments((data as Assessment[]) || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const totalPaid = assessments.filter((a) => a.payment_status === "paid").length;
  const totalReports = assessments.filter((a) => a.generated_report).length;

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold font-serif">Admin Dashboard</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/counselor-login";
            }}
          >
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </Button>
        </div>

        <AdminStats total={assessments.length} paid={totalPaid} reports={totalReports} />

        <Tabs defaultValue="assessments" className="space-y-4">
          <TabsList>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          </TabsList>
          <TabsContent value="assessments" className="space-y-4">
            <AssessmentsTable assessments={assessments} loading={loading} />
          </TabsContent>
          <TabsContent value="campaigns">
            <CampaignsTab />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Admin;
