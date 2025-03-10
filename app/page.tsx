import Header from "@/components/header";
import AlgorithmVisualizer from "@/components/algorithm-visualizer";
import Carousel from "@/components/Carousel";
import StreakTracker from "@/components/StreakTracker";
import AlgorithmCards from "@/components/AlgorithmCards";
import MarqueeLogos from "@/components/MarqueeLogos";
import MembershipCards from "@/components/MembershipCards";
import KBCCard from "@/components/KBCCard";
import Footer from "@/components/Footer";
import Roadmap from "@/components/Roadmap";
import AlgorithmRace from "@/components/AlgorithmRace";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white" id="home">
      <Header />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 py-8 mt-10">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mt-2">
          Master DSA In 100 Days And Get Certified
        </h1>
        
        {/* Subtitle */}
        <p className="text-center text-lg md:text-xl text-slate-300 mb-8">
          Explore & visualize famous graph algorithms, track your learning streak, and prepare for top companies!
        </p>

        {/* Responsive Sections */}
        <div className="space-y-10">
          <Carousel />
          <AlgorithmCards />
          <MarqueeLogos />
          <AlgorithmRace />
          <StreakTracker />
          <MembershipCards />
          <KBCCard />
        </div>
      </div>

      <Footer />
    </main>
  );
}
