import { useState } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import CandidateProfile from "@/components/CandidateProfile";
import PolicyCards from "@/components/PolicyCards";
import DistrictPolicies from "@/components/DistrictPolicies";
import AIChat from "@/components/AIChat";
import DocumentSection from "@/components/DocumentSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <Hero 
        onPolicyClick={() => scrollToSection('policies')}
        onChatClick={() => setIsChatOpen(true)}
      />
      <CandidateProfile />
      <PolicyCards />
      <DistrictPolicies />
      <AIChat 
        isOpen={isChatOpen}
        onOpenChange={setIsChatOpen}
      />
      <DocumentSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
