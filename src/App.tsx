import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AssessmentProvider } from "@/context/AssessmentContext";
import { AnimatePresence, motion } from "framer-motion";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Assessment from "./pages/Assessment";
import StudentReport from "./pages/StudentReport";
import CounselorLogin from "./pages/CounselorLogin";
import CounselorDashboard from "./pages/CounselorDashboard";
import CounselorStudentReport from "./pages/CounselorStudentReport";
import CounselorRegister from "./pages/CounselorRegister";
import AdminCounselorRequests from "./pages/AdminCounselorRequests";
import CounselorRouteGuard from "./components/counselor/CounselorRouteGuard";
import Success from "./pages/Success";
import PaymentSuccess from "./pages/PaymentSuccess";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2, ease: "easeIn" as const } },
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen"
      >
          <Routes location={location}>
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/report/:reportId" element={<StudentReport />} />
            <Route path="/counselor" element={<CounselorLogin />} />
            <Route path="/counselor/login" element={<CounselorLogin />} />
            <Route path="/counselor/register" element={<CounselorRegister />} />
            <Route path="/counselor/dashboard" element={<CounselorRouteGuard><CounselorDashboard /></CounselorRouteGuard>} />
            <Route path="/counselor/reports/:reportId" element={<CounselorRouteGuard><CounselorStudentReport /></CounselorRouteGuard>} />
            <Route path="/admin/counselor-requests" element={<AdminCounselorRequests />} />
            <Route path="/success" element={<Success />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <AssessmentProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AnimatedRoutes />
        </BrowserRouter>
      </AssessmentProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
