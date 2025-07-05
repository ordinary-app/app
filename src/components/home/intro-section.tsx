"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Span } from "next/dist/trace"
import { useWalletCheck } from "@/hooks/use-wallet-check"
import { ConnectKitButton } from "connectkit"

export function IntroSection() {
  const { isConnected } = useWalletCheck();

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white">
      {/* Harbor Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-harbor-50/50 via-white to-harbor-100/30" />

      {/* Animated Harbor Elements */}
      <div className="absolute top-10 right-10 opacity-15 float-animation">
        <div className="text-6xl">⚓</div>
      </div>
      <div className="absolute bottom-20 left-10 opacity-15 anchor-animation">
        <div className="text-4xl"></div>
      </div>
      <div className="absolute top-32 left-20 opacity-10 wave-animation">
        <div className="text-5xl">⚓</div>
      </div>
      <div className="absolute bottom-32 right-20 opacity-10 anchor-animation" style={{ animationDelay: "2s" }}>
        <div className="text-3xl"></div>
      </div>

      
      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">

         {/* Meme Image with Harbor Theme */}
          <div className="relative">
            <div className="relative flex justify-center bg-white rounded-2xl shadow-xl p-6 transform rotate-0 hover:rotate-1 transition-transform duration-300 border border-harbor-200">
              <Image
                src="/meme.png"
                alt="Seagulls at the dock - ChipDock meme"
                width={560}
                height={560}
                className="rounded-lg"
                priority
              />
              <div className="absolute -bottom-7 left-1/4 transform -translate-x-1/2 bg-gradient-to-r from-chip-300 via-chip-400 to-chip-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                去码头整点薯条! 》》
              </div>
            </div>

            {/* Floating Harbor Elements */}
            {/* <div className="absolute -top-6 -left-6 text-4xl opacity-40 float-animation">⚓</div> */}
            {/* <div className="absolute -bottom-6 -right-6 text-3xl opacity-40 anchor-animation">⚓</div> */}
          </div>

          {/* Content */} 
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-loose">
                <span className="font-sans bg-gradient-to-r from-harbor-600 via-harbor-500 to-harbor-400 bg-clip-text text-transparent">
                  CHIPDOCK
                </span>
                <br />              
                <span className="text-4xl text-harbor-600 leading-[2.5] whitespace-nowrap">薯条码头：为爱发电的去中心化创作港口</span>
                <br />
                <span className="text-2xl text-neutral-600">A SAFE HARBOR FOR FANDOM</span>
              </h1>

              <p className="text-lg text-neutral-600 max-w-2xl">
                Chipdock is a nonprofit decentralized social platform for fanworks powered by open-source
                blockchain protocol. Protecting freedom of creativity and publishing rights for fan art creators.
              </p>
            </div>

            {/* Core Principles */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-harbor-200 bg-white hover:bg-harbor-50/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono text-harbor-600">(001)</span>
                    <span className="text-sm font-medium text-neutral-700">抗审查 Anti-Censorship</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-success-200 bg-white hover:bg-success-50/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono text-success-600">(010)</span>
                    <span className="text-sm font-medium text-neutral-700">尊重原创 Respect Originality</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-warning-200 bg-white hover:bg-warning-50/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono text-warning-600">(011)</span>
                    <span className="text-sm font-medium text-neutral-700">分散自治 Decentralized</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-seagull-200 bg-white hover:bg-seagull-50/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono text-warning-600">(100)</span>
                    <span className="text-sm font-medium text-neutral-700">为爱发电 Create with Love</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-8">
              {isConnected ? (
                <Button asChild size="lg" className="harbor-button text-white font-semibold">
                  <Link href="/feed">Start Here</Link>
                </Button>
              ) : (
                <ConnectKitButton.Custom>
                  {({ show }) => (
                    <Button size="lg" className="harbor-button text-white font-semibold" onClick={show}>
                      Start Here
                    </Button>
                  )}
                </ConnectKitButton.Custom>
              )}

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-harbor-300 text-harbor-700 hover:bg-harbor-50 bg-white"
              >
                <Link href="/feed">Explore 🕊️</Link>
              </Button>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  )
}
