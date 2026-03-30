import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import PMShriStrip from "@/components/landing/PMShriStrip";
import WhySection from "@/components/landing/WhySection";
import WhatItTests from "@/components/landing/WhatItTests";
import ReportSections from "@/components/landing/ReportSections";
import AboutSection from "@/components/landing/AboutSection";
import SocialProof from "@/components/landing/SocialProof";
import ForSchools from "@/components/landing/ForSchools";
import LandingFooter from "@/components/landing/LandingFooter";

const Landing = () => (
  <div className="min-h-screen flex flex-col overflow-hidden bg-background">
    <LandingNavbar />
    <HeroSection />
    <PMShriStrip />
    <WhySection />
    <WhatItTests />
    <ReportSections />
    <AboutSection />
    <SocialProof />
    <ForSchools />
    <LandingFooter />
  </div>
);

export default Landing;
