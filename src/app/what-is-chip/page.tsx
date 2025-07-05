"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Hash, Eye, Lock, CheckCircle, ArrowRight, Users, Globe, Zap, Heart } from "lucide-react"
import Link from "next/link"
import { useWalletCheck } from "@/hooks/use-wallet-check"
import { ConnectKitButton } from "connectkit"

export default function WhatIsChipPage() {
  const { isConnected } = useWalletCheck();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-harbor-50/30">
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-white border border-harbor-200 px-6 py-3 rounded-full mb-8 shadow-sm">
              <div className="text-2xl"></div>
              <span className="text-chip-700 font-medium text-lg">Chip Certificate</span>
              <div className="text-2xl"></div>
            </div>

           
            <h1 className="text-5xl sm:text-6xl font-bold text-neutral-900 mb-8 whitespace-nowrap">
              <span className="align-middle">什么是</span>
              <span className="bg-gradient-to-r from-chip-600 via-chip-500 to-chip-400 bg-clip-text text-transparent align-middle">
                薯条证明？
              </span>
            </h1>

            <p className="text-xl text-neutral-700 max-w-4xl mx-auto leading-relaxed mb-8">
              Chip Certificate (薯条证明)
              是基于区块链技术的原创作品认证系统，为每一份原创内容提供不可篡改的所有权证明，保护创作者的知识产权和创作权益。
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isConnected ? (
                <Button asChild size="lg" className="chip-button text-white font-semibold">
                  <Link href="/create">发布作品并获得证明</Link>
                </Button>
              ) : (
                <ConnectKitButton.Custom>
                  {({ show }) => (
                    <Button size="lg" className="chip-button text-white font-semibold" onClick={show}>
                      连接钱包发布作品
                    </Button>
                  )}
                </ConnectKitButton.Custom>
              )}
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-harbor-300 text-harbor-700 hover:bg-harbor-50 bg-transparent"
              >
                <Link href="/feed">探索作品 🌊</Link>
              </Button>
            </div>
          </div>

          {/* What is Chip Certificate */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-neutral-900 mb-6">薯条证明是什么？</h2>
                <div className="space-y-4 text-lg text-neutral-700 leading-relaxed">
                  <p>
                    薯条证明（Chip Certificate）是 CHIPDOCK
                    平台独有的原创作品认证系统。当创作者发布原创内容时，可以选择为作品申请薯条证明。
                  </p>
                  <p>
                    每个薯条证明都拥有独一无二的证明ID，这个ID连同作品信息、创作者信息、创作时间等关键数据一起被永久记录在区块链上，形成不可篡改的数字证书。
                  </p>
                  <p>这不仅保护了创作者的原创权益，也为整个社区提供了透明、可信的原创作品验证机制。</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-harbor-50 to-harbor-100 border border-harbor-200 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="text-3xl">💡</div>
                  <h3 className="text-xl font-semibold text-harbor-800">核心理念</h3>
                </div>
                <p className="text-harbor-700 leading-relaxed">
                  "让每一份原创都有迹可循，让每一次创作都受到保护" ——
                  薯条证明致力于在去中心化的世界中建立可信的原创认证体系。
                </p>
              </div>
            </div>

            {/* Certificate Visual */}
            <div className="relative">
              <Card className="bg-white border-2 border-harbor-200 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <CardHeader className="bg-gradient-to-r from-chip-500 to-chip-300 text-white rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">🍟</div>
                      <div>
                        <CardTitle className="text-2xl">薯条证明</CardTitle>
                        <p className="text-harbor-100 text-sm">Chip Certificate</p>
                      </div>
                    </div>
                    <Badge className="bg-white/20 text-white border-white/30 text-sm px-3 py-1">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      已验证
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-harbor-100">
                      <span className="text-neutral-600 font-medium">证明编号</span>
                      <div className="flex items-center space-x-2">
                        <Hash className="w-4 h-4 text-harbor-500" />
                        <span className="font-mono text-harbor-700 font-semibold">CD-2024-001337</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-harbor-100">
                      <span className="text-neutral-600 font-medium">创作者</span>
                      <span className="font-semibold text-neutral-900">@seagull_artist</span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-harbor-100">
                      <span className="text-neutral-600 font-medium">认证时间</span>
                      <span className="text-neutral-700">2024-01-15 14:30 UTC</span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-harbor-100">
                      <span className="text-neutral-600 font-medium">区块链状态</span>
                      <div className="flex items-center space-x-2">
                        <Lock className="w-4 h-4 text-success-500" />
                        <span className="text-success-600 font-medium">不可篡改</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <span className="text-neutral-600 font-medium">验证状态</span>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-success-500" />
                        <span className="text-success-600 font-semibold">原创已验证</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full border-harbor-200 text-harbor-700 hover:bg-harbor-50 bg-transparent font-medium"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    在区块链上查看
                  </Button>
                </CardContent>
              </Card>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 text-4xl opacity-40 float-animation">🔒</div>
              <div className="absolute -bottom-6 -left-6 text-3xl opacity-40 anchor-animation">⚓</div>
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-neutral-900 mb-4">薯条证明如何工作？</h2>
              <p className="text-lg text-neutral-600">简单三步，为您的原创作品获得区块链认证</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="group border border-harbor-200 bg-white hover:shadow-xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-harbor-50/50 to-harbor-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="p-8 text-center relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-harbor-500 to-harbor-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-2xl">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-4">创作并声明</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    在发布您的原创作品时，勾选"声明为原创"选项，系统将为您的作品准备薯条证明申请。
                  </p>
                </CardContent>
              </Card>

              <Card className="group border border-success-200 bg-white hover:shadow-xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-success-50/50 to-success-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="p-8 text-center relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-success-500 to-success-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-2xl">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-4">区块链记录</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    系统自动生成唯一的证明ID，并将作品信息、创作者信息、时间戳等数据记录到区块链上。
                  </p>
                </CardContent>
              </Card>

              <Card className="group border border-warning-200 bg-white hover:shadow-xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-warning-50/50 to-warning-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="p-8 text-center relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-warning-500 to-warning-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-2xl">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-4">获得认证</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    您的作品获得薯条证明，任何人都可以通过证明ID验证作品的原创性和所有权。
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-neutral-900 mb-4">薯条证明的优势</h2>
              <p className="text-lg text-neutral-600">为什么选择薯条证明来保护您的原创作品？</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="group border border-harbor-200 bg-white hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-harbor-500 to-harbor-700 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-2">防伪保护</h3>
                  <p className="text-sm text-neutral-600">区块链技术确保证明无法被伪造或篡改</p>
                </CardContent>
              </Card>

              <Card className="group border border-success-200 bg-white hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-success-700 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Hash className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-2">唯一标识</h3>
                  <p className="text-sm text-neutral-600">每个证明都有独特的ID，便于追踪和验证</p>
                </CardContent>
              </Card>

              <Card className="group border border-warning-200 bg-white hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-warning-500 to-warning-700 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-2">公开透明</h3>
                  <p className="text-sm text-neutral-600">所有人都可以查看和验证证明的真实性</p>
                </CardContent>
              </Card>

              <Card className="group border border-seagull-200 bg-white hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-seagull-500 to-seagull-700 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-2">永久保存</h3>
                  <p className="text-sm text-neutral-600">证明信息永久存储，不会丢失或损坏</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Why ChipDock */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-neutral-900 mb-4">为什么选择 CHIPDOCK？</h2>
              <p className="text-lg text-neutral-600">我们致力于为创作者社区提供最佳的创作与社交体验</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="group border border-harbor-200 bg-white hover:shadow-xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-harbor-50/50 to-harbor-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-harbor-500 to-harbor-700 rounded-xl shadow-lg">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-neutral-900 text-xl">社区驱动</CardTitle>
                      <p className="text-neutral-600">由创作者社区共同治理和发展</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-neutral-700 leading-relaxed">
                    CHIPDOCK
                    未来将是一个完全由创作者社区驱动的平台，所有重要决策都由社区成员共同参与制定，确保平台始终服务于创作者的真实需求。
                  </p>
                </CardContent>
              </Card>

              <Card className="group border border-success-200 bg-white hover:shadow-xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-success-50/50 to-success-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-success-500 to-success-700 rounded-xl shadow-lg">
                      <Globe className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-neutral-900 text-xl">开源透明</CardTitle>
                      <p className="text-neutral-600">基于开源区块链协议构建</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-neutral-700 leading-relaxed">
                    我们的技术栈完全开源，任何人都可以审查代码、提出改进建议。透明的技术架构确保了平台的可信度和安全性。
                  </p>
                </CardContent>
              </Card>

              <Card className="group border border-warning-200 bg-white hover:shadow-xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-warning-50/50 to-warning-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-warning-500 to-warning-700 rounded-xl shadow-lg">
                      <Heart className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-neutral-900 text-xl">非营利性质</CardTitle>
                      <p className="text-neutral-600">专注于服务创作者，不以盈利为目的</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-neutral-700 leading-relaxed">
                    作为非营利平台，我们的唯一目标是为创作者提供更好的服务。所有收入都将用于平台的维护和发展，绝不会为了商业利益而牺牲用户体验。
                  </p>
                </CardContent>
              </Card>

              <Card className="group border border-seagull-200 bg-white hover:shadow-xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-seagull-50/50 to-seagull-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-seagull-500 to-seagull-700 rounded-xl shadow-lg">
                      <Zap className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-neutral-900 text-xl">技术先进</CardTitle>
                      <p className="text-neutral-600">采用最新的Web3技术栈</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-neutral-700 leading-relaxed">
                    基于 Lens Protocol、Grove Storage 等先进的Web3技术构建，确保平台具有最佳的性能、安全性和用户体验。
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Call to Action */}
          <div className="relative text-center bg-harbor-gradient rounded-3xl p-16 text-white overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-10 left-10 opacity-20 float-animation">
              <div className="text-8xl">🍟</div>
            </div>
            <div className="absolute bottom-10 right-10 opacity-20 anchor-animation">
              <div className="text-6xl">⚓</div>
            </div>

            <div className="relative z-10">
              <h3 className="text-4xl sm:text-5xl font-bold mb-6">开始使用薯条证明</h3>
              <p className="text-xl sm:text-2xl mb-4 opacity-90">保护您的原创作品，加入去中心化创作社区</p>
              <p className="text-lg mb-12 opacity-80">让每一份创作都能在这片海域自由航行 🚢✨</p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                {isConnected ? (
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-harbor-600 hover:bg-harbor-50 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <Link href="/feed" className="flex items-center space-x-2">
                      <span>立即加入</span>
                      <div className="text-xl">🍟</div>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </Button>
                ) : (
                  <ConnectKitButton.Custom>
                    {({ show }) => (
                      <Button
                        size="lg"
                        className="bg-white text-harbor-600 hover:bg-harbor-50 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                        onClick={show}
                      >
                        <span className="flex items-center space-x-2">
                          <span>连接钱包加入</span>
                          <div className="text-xl">🍟</div>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </span>
                      </Button>
                    )}
                  </ConnectKitButton.Custom>
                )}

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-harbor-600 bg-transparent px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <Link href="/feed" className="flex items-center space-x-2">
                    <span>浏览社区</span>
                    <div className="text-xl">🌊</div>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
