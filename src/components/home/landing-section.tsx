"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Span } from "next/dist/trace"
import { useWalletCheck } from "@/hooks/wallet/use-wallet-check"
import { ConnectKitButton } from "connectkit"
import React, { useState } from "react"

export function LandingSection() {
  const { isConnected } = useWalletCheck();
  const [rotate, setRotate] = useState(false);

  return (
    <section className="relative sm:py-20 py-10 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white max-auto mx-auto">
      {/* Harbor Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-harbor-50/30 via-white to-harbor-50/30" />

      {/* Animated Harbor Elements */}
      <div className="absolute top-10 right-10 opacity-15 float-animation ">
        <div className="text-6xl">⚓</div>
      </div>
      <div className="absolute bottom-20 left-10 opacity-15 anchor-animation">
        <div className="text-4xl"></div>
      </div>
      <div className="absolute top-32 left-20 opacity-10 wave-animation">
        <div className="text-5xl"></div>
      </div>
      <div className="absolute bottom-32 right-20 opacity-10 anchor-animation" style={{ animationDelay: "2s" }}>
        <div className="text-3xl"></div>
      </div>

      
      <div className="relative w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-8 items-center">

          {/* Content */}
          <div className="col-1 lg:col-1 w-full max-w-full sm:max-w-2xl sm:mx-auto space-y-8 mb-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-normal text-left">
                <span className="font-sans bg-gradient-to-r from-harbor-600 via-harbor-500 to-harbor-400 bg-clip-text text-transparent">
                  Ordinary
                </span>
                <br />
                <span className="text-4xl text-harbor-600 leading-tight">
                  薯条码头:<br className="block sm:hidden" />为爱发电的自由创作港
                </span>
                <br />
                <span className="text-2xl text-neutral-600">
                  A SAFE HARBOR FOR FANDOMS
                </span>
              </h1>

              <p className="text-lg text-neutral-600 w-full max-w-full sm:max-w-xl text-left hidden sm:inline">
                Ordinary is a nonprofit decentralized social platform for fanworks powered by open-source
                blockchain protocol. Protecting freedom of creativity and publishing rights for fanart creators.
              </p>
            </div>

            {/* Core Principles */}
            <div className="grid grid-cols-2 gap-4 max-w-full w-full overflow-x-auto sm:gap-7 sm:max-w-xl sm:w-full mt-8 mb-8">
              <Card className="border-harbor-200 bg-white hover:bg-harbor-50/50 transition-colors min-w-[160px] max-w-xs w-full mx-auto">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono text-harbor-600">(001)</span>
                    <span className="text-sm font-medium text-neutral-700">抗审查 Anti-Censorship</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-success-200 bg-white hover:bg-success-50/50 transition-colors min-w-[160px] max-w-xs w-full mx-auto">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono text-success-600">(010)</span>
                    <span className="text-sm font-medium text-neutral-700">尊重原创 Respect Originality</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-warning-200 bg-white hover:bg-warning-50/50 transition-colors min-w-[160px] max-w-xs w-full mx-auto">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono text-warning-500">(011)</span>
                    <span className="text-sm font-medium text-neutral-700">去中心化 Decentralized</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-warning-200 bg-white hover:bg-warning-50/50 transition-colors min-w-[160px] max-w-xs w-full mx-auto">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono text-warning-600">(100)</span>
                    <span className="text-sm font-medium text-neutral-700">为爱发电 Create with Love</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 w-full mt-8">
              {isConnected ? (
                <Button asChild size="lg" className="harbor-button text-white font-semibold w-full sm:w-auto">
                  <Link href="/feed">Start Here</Link>
                </Button>
              ) : (
                <ConnectKitButton.Custom>
                  {({ show }) => (
                    <Button size="lg" className="harbor-button text-white font-semibold w-full sm:w-auto" onClick={show}>
                      Start Here
                    </Button>
                  )}
                </ConnectKitButton.Custom>
              )}

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-harbor-300 text-harbor-700 hover:bg-harbor-50 bg-white w-full sm:w-auto"
              >
                <Link href="/feed">Explore 🕊️</Link>
              </Button>
            </div>
          </div>
          {/* Meme Image with Harbor Theme */}
          <div className="relative col-1 lg:col-1 w-full max-w-full sm:max-w-xl sm:mx-auto mb-8">
            <div
              className={`relative flex justify-center bg-white rounded-2xl shadow-xl p-4 max-w-full w-full transform transition-transform duration-300 border border-harbor-200${rotate ? ' rotate-1' : ''}`}
            >
              <Image
                src="/meme-en.png"
                alt="Seagulls at the dock - meme"
                width={800}
                height={800}
                className="rounded-lg w-full h-auto max-w-full"
                priority
              />
              <Link href="/feed">
              <div
                className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-chip-300 via-chip-400 to-chip-500 text-white px-3 py-2 rounded-full text-s font-medium shadow-lg cursor-pointer"
                onMouseEnter={() => setRotate(true)}
                onMouseLeave={() => setRotate(false)}
              >
                去码头整点薯条! 》》
              </div>
              </Link>
            </div>
          </div>
          
          
          
        </div>
      </div>
    </section>
  )
}
