import { Button } from "@/components/ui/button";
import Link from "next/link";
import Spline from "@splinetool/react-spline/next";

export default function Home() {
  return (
    <main className="relative flex w-full min-h-screen flex-col bg-black">
      {/* Navigation */}
      <nav className="absolute top-0 w-full z-50 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-white">
            Gov<span className="text-violet-400">Trance</span>
          </div>
          <div className="hidden md:flex space-x-8 text-white/80">
            <a href="#" className="hover:text-violet-400 transition-colors">
              Features
            </a>
            <a href="#" className="hover:text-violet-400 transition-colors">
              Security
            </a>
            <a href="#" className="hover:text-violet-400 transition-colors">
              About
            </a>
            <a href="#" className="hover:text-violet-400 transition-colors">
              Contact
            </a>
          </div>
          <Link href="/transactions">
            <Button
              variant="default"
              className="bg-violet-600 hover:bg-violet-700 cursor-pointer"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Background Gradients */}
      <div className="gradDot absolute top-1/3 left-1/2 rounded-full w-[600px] h-[600px] bg-violet-700 blur-[200px] transform -translate-x-1/2 -translate-y-1/2 z-0 opacity-70"></div>
      <div className="gradDot absolute top-1/3 left-1/2 rounded-full w-[400px] h-[400px] bg-purple-500 blur-[150px] transform -translate-x-1/2 -translate-y-1/2 z-0 opacity-50"></div>

      {/* Hero Section */}
      <section className="relative flex w-full min-h-screen items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60 z-10"></div>

        {/* 3D Model Container */}
        <div className="absolute inset-0 z-5 blur-xs">
          <Spline scene="https://prod.spline.design/iDxwtVzM607GCl-b/scene.splinecode" />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-4xl mx-auto text-center px-6 select-none">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Transparent{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-600">
              Government
            </span>
            <br />
            Accountability
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Combating{" "}
            <span className="font-semibold text-white">Sri Lanka&apos;s</span>{" "}
            Rs. 300 billion annual corruption losses through blockchain-based
            tracking of government transactions. Ensuring transparency,
            accountability, and public trust.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login/guest">
              <Button
                variant="default"
                size="lg"
                className="bg-violet-600 hover:bg-violet-700 text-white cursor-pointer"
              >
                Guest
              </Button>
            </Link>
            <Link href="/login/admin">
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white hover:border-violet-400 cursor-pointer"
              >
                Admin
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center cursor-pointer">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative bg-black/80 backdrop-blur-sm py-20 z-30">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-white mb-8">
            Combating{" "}
            <span className="text-violet-400">Government Corruption</span> in
            Sri Lanka
          </h2>
          <p className="text-xl text-white/80 text-center mb-16 max-w-4xl mx-auto">
            Sri Lanka loses an estimated{" "}
            <span className="text-violet-400 font-semibold">
              Rs. 300 billion annually
            </span>{" "}
            due to corrupt practices in government tender procurements alone.
            Our blockchain solution ensures every transaction is traceable and
            accountable.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all">
              <div className="w-12 h-12 bg-violet-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⛓️</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Blockchain Storage
              </h3>
              <p className="text-white/70">
                Immutable, public records on Cardano blockchain ensuring
                transparency and preventing data manipulation.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                AI Agent
              </h3>
              <p className="text-white/70">
                Ask questions, get transaction info, understand government
                spending patterns through intelligent data analysis.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📄</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Smart Contracts
              </h3>
              <p className="text-white/70">
                Automated, transparent procurement processes that eliminate
                human intervention and corruption opportunities.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all">
              <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔐</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Data Privacy
              </h3>
              <p className="text-white/70">
                Public vs confidential access controls with encrypted sensitive
                information protecting national security.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
