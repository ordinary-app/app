"use client"

import { Button } from "@/components/ui/button"
import { Search, Edit, Users, Shield, Heart, Coins, UserCheck } from "lucide-react"
import { ConnectKitButton } from "connectkit"
import { useAccount } from "wagmi"
import { useEffect } from "react"
import { useUIStore } from "@/stores/ui-store"
import { useCurrentProfileStorage } from "@/stores/profile-store"
import { Header } from "@/components/header"
import { Feed } from "@/components/feed"


export default function HomePage() {
  const { isConnected, address, isConnecting: loading, status } = useAccount();
  const setProfileSelectModalOpen = useUIStore((state) => state.setProfileSelectModalOpen);
  const currentProfile = useCurrentProfileStorage(state => state.currentProfile)

  useEffect(() => {
    if (isConnected && !currentProfile) {
      setProfileSelectModalOpen(true);
    }
  }, [isConnected, currentProfile]);

  console.log('xxxx connect status------', isConnected, loading, currentProfile)
  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-50">
  //       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  //     </div>
  //   )
  // }

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-6 h-6 bg-black rounded-sm flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <ConnectKitButton.Custom>
                  {({ show }) => {
                      return (
                        <Button onClick={show} className="bg-black text-white rounded-full hover:bg-gray-800">
                          Login
                        </Button>
                      );
                    // }
                  }}
                </ConnectKitButton.Custom>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-serif mb-6 leading-tight">
              <span className="bg-blue-100 px-2 py-1 rounded">Create</span>,{" "}
              <span className="bg-green-100 px-2 py-1 rounded">share</span> &{" "}
              <span className="bg-yellow-100 px-2 py-1 rounded">celebrate</span>
              <br />
              <span className="text-gray-700">fanworks together</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              A noncommercial and nonprofit decentralized hosting place for fanworks and a Non-commercial Cryptological
              Fanart Community
            </p>
            <p className="text-lg text-gray-500 mt-4 max-w-2xl mx-auto">使用户免于过度审查、抄袭担忧和web2算法污染</p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Anti-Censorship */}
            <div className="flex items-start space-x-6">
              <div className="w-24 h-24 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">抗审查 Anti-Censorship</h3>
                <p className="text-gray-600 leading-relaxed">
                  Built on decentralized infrastructure secured by blockchain technology. We believe in{" "}
                  <strong>open-source</strong> and letting creators stay in control of their works and audience.
                </p>
              </div>
            </div>

            {/* Respect Originality */}
            <div className="flex items-start space-x-6">
              <div className="w-24 h-24 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Edit className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">尊重原创 Respect Originality</h3>
                <p className="text-gray-600 leading-relaxed">
                  In the new kind of internet there's no attention-maximizing and squeezing ad revenue out of creators.
                  Our platform is beautifully crafted from the ground up to be <strong>fully distraction-free</strong>.
                </p>
              </div>
            </div>

            {/* Decentralized Governance */}
            <div className="flex items-start space-x-6">
              <div className="w-24 h-24 bg-yellow-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Users className="w-8 h-8 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">分散自治 Decentralized Governance</h3>
                <p className="text-gray-600 leading-relaxed">
                  Community has <strong>multiplayer built in</strong>. Beyond that, we make it super easy to{" "}
                  <strong>split revenue</strong> with collaborators and build together.
                </p>
              </div>
            </div>

            {/* For Love, Not Profit */}
            <div className="flex items-start space-x-6">
              <div className="w-24 h-24 bg-pink-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Heart className="w-8 h-8 text-pink-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">为爱发电 For Love, Not Profit</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our powerful editor is designed to be <strong>the world typewriter</strong> - with features that{" "}
                  <strong>help you grow</strong> as a writer. Create music, videos, demos - <strong>over 1900+</strong>{" "}
                  platforms are supported.
                </p>
              </div>
            </div>
          </div>

          {/* Community Principles */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-center mb-8">建设由同人女构成的加密文化社区的核心原则</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
                  <Coins className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-mono text-sm mb-2">(101) 有偿交换原则</h3>
                <p className="text-gray-600 text-sm">Fair compensation for creative work</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-4">
                  <UserCheck className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-mono text-sm mb-2">(110) 更多的女性参与</h3>
                <p className="text-gray-600 text-sm">Encouraging female participation</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-100 rounded-full mb-4">
                  <Users className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="font-mono text-sm mb-2">(011) 分散自治</h3>
                <p className="text-gray-600 text-sm">Decentralized autonomous community</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <ConnectKitButton.Custom>
              {({ show }) => {
                  return (
                    <Button
                      onClick={show}
                      size="lg"
                      className="bg-black text-white rounded-full hover:bg-gray-800 px-8 py-3 text-lg"
                    >
                      Join the Community
                    </Button>
                  );
                // }
              }}
            </ConnectKitButton.Custom>

            <p className="text-gray-500 mt-4">Connect your wallet to start creating and sharing fanworks</p>
          </div>
        </main>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Feed />
      </main>
    </div>
  )
}
