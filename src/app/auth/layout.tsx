"use client";

import { appName } from "@/lib/utils";
import { CreditCard, Globe, ShieldCheck, Zap } from "lucide-react";
import { PropsWithChildren } from "react";

const AuthLayout = ({ children }: PropsWithChildren) => {
  const features = [
    {
      icon: <Zap className="w-6 h-6 text-primary" />,
      title: "Lightning Fast Payments",
      description: "Process transactions instantly with our optimized payment flow"
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-primary" />,
      title: "Bank-Grade Security",
      description: "Enterprise-level encryption and fraud protection systems"
    },
    {
      icon: <CreditCard className="w-6 h-6 text-primary" />,
      title: "Multiple Payment Methods",
      description: "Accept credit cards, digital   wallets, and direct bank transfers"
    },
    {
      icon: <Globe className="w-6 h-6 text-primary" />,
      title: "Global Coverage",
      description: "Process payments in multiple currencies worldwide"
    }
  ];

  return (
    <section className="grid md:grid-cols-2 px-4 min-h-screen bg-[url('/images/sidebar.jpg')] bg-cover bg-center">
      <main className=" flex items-center justify-center">
        {children}
      </main>

      <aside className="relative bg-background  hidden md:flex flex-col overflow-hidden">
        <video src="/auth.mp4" autoPlay muted loop className="w-full h-full object-cover absolute top-0 left-0" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/20" />
        <div className="relative z-10 h-full flex flex-col backdrop-blur-sm bg-white/10">
          <header className="space-y-6 mb-12 p-12">
            <div className="space-y-2.5">
              <h1 className="text-3xl text-white font-bold">
                Seamless Payments Made Simple
              </h1>
              <p className="text-white/80 text-lg max-w-md">
                Join thousands of businesses using {appName} to process transactions securely and efficiently. Experience the future of payment processing today.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <p className="text-sm text-white/80">
                Trusted by 50,000+ businesses worldwide
              </p>
            </div>
          </header>

          <div className="grid grid-cols-2 gap-8 mb-12 px-12">
            {features.map((feature, index) => (
              <div key={index} className="space-y-2">
                <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-white/80">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <footer className="mt-auto pb-12 px-12">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                <p className="text-sm font-medium text-white">
                  PCI DSS Level 1
                </p>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                <p className="text-sm font-medium text-white">
                  256-bit Encryption
                </p>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                <p className="text-sm font-medium text-white">
                  99.99% Uptime
                </p>
              </div>
            </div>
          </footer>
        </div>
      </aside>
    </section>
  );
};

export default AuthLayout;