import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import WhatItTests from "@/components/landing/WhatItTests";
import HowItWorks from "@/components/landing/HowItWorks";
import ReportSections from "@/components/landing/ReportSections";
import SocialProof from "@/components/landing/SocialProof";
import AboutSection from "@/components/landing/AboutSection";
import ForSchools from "@/components/landing/ForSchools";
import LandingFooter from "@/components/landing/LandingFooter";

const Landing = () => (
  <div className="min-h-screen flex flex-col overflow-hidden">
    <LandingNavbar />
    <HeroSection />
    <WhatItTests />
    <HowItWorks />
    <ReportSections />
    <SocialProof />
    <AboutSection />
    <ForSchools />
    <LandingFooter />
  </div>
);

export default Landing;
