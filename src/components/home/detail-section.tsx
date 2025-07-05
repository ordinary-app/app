"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Users, Zap, Globe, Heart, Coins, ArrowRight } from "lucide-react"
import Link from "next/link"
import { ChipsSection } from "@/components/home/chips-section"
import { useWalletCheck } from "@/hooks/use-wallet-check"
import { ConnectKitButton } from "connectkit"

export function DetailSection() {
  const { isConnected } = useWalletCheck();

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white">
      {/* Harbor Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-harbor-50/50 via-white to-harbor-50/30" />

      {/* Floating Harbor Elements */}
      <div className="absolute top-20 left-10 opacity-8 float-animation">
        <div className="text-8xl"></div>
      </div>
      <div className="absolute top-40 right-20 opacity-8 anchor-animation">
        <div className="text-6xl"></div>
      </div>
      <div className="absolute bottom-40 left-20 opacity-8 wave-animation" style={{ animationDelay: "1s" }}>
        <div className="text-7xl">⚓</div>
      </div>
      <div className="absolute bottom-20 right-10 opacity-8 anchor-animation" style={{ animationDelay: "2s" }}>
        <div className="text-5xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Project Vision */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-white border border-harbor-200 px-6 py-3 rounded-full mb-8 shadow-sm">
            <div className="text-harbor-500">🚢</div>
            <span className="text-harbor-700 font-medium">Building the Future</span>
            <div className="text-harbor-500">🚢</div>
          </div>

          <h2 className="text-5xl sm:text-6xl font-bold text-neutral-900 mb-8 leading-tight">
            <p className="mb-4">上传与分享作品的</p>
            <span className="bg-gradient-to-r from-harbor-600 via-harbor-500 to-harbor-400 bg-clip-text text-transparent">
              安全港湾
            </span>
          </h2>

          <div className="max-w-4xl mx-auto space-y-4">
            <p className="text-2xl text-neutral-700 leading-relaxed">
              A noncommercial and nonprofit decentralized social platform for fanworks
            </p>
            <p className="text-lg text-neutral-600 leading-relaxed">
              Powered by open-source blockchain protocol, protecting creative freedom and publishing rights for fan art
              creators 🌊
            </p>
          </div>

          {/* Animated Harbor Divider */}
          <div className="flex items-center justify-center mt-12 mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-harbor-300 to-transparent w-32"></div>
            <div className="mx-4 text-2xl animate-wave">⚓</div>
            <div className="h-px bg-gradient-to-r from-transparent via-harbor-300 to-transparent w-32"></div>
          </div>
        </div>

        {/* Core Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          <Card className="group border border-harbor-200 bg-white hover:shadow-xl hover:scale-105 transition-all duration-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-harbor-50/50 to-harbor-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-harbor-500 to-harbor-700 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <CardTitle className="text-neutral-900 text-xl">抗审查保护</CardTitle>
                  <Badge variant="outline" className="text-harbor-600 border-harbor-300 mt-2">
                    (001) Censorship Resistant
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-neutral-700 leading-relaxed">
                基于区块链技术的去中心化存储，确保您的创作内容不会被任意删除或审查，让创作自由得到真正保障。
              </p>
            </CardContent>
          </Card>

          <Card className="group border border-harbor-200 bg-white hover:shadow-xl hover:scale-105 transition-all duration-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-harbor-50/50 to-harbor-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-harbor-500 to-harbor-700 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Heart className="w-7 h-7 text-white" />
                </div>
                <div>
                  <CardTitle className="text-neutral-900 text-xl">原创声明系统</CardTitle>
                  <Badge variant="outline" className="text-harbor-600 border-harbor-300 mt-2">
                    (010) Original Attribution
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-neutral-700 leading-relaxed mb-4">
                用户可以在上传发布帖子时声明作品为原创，该帖子就会绑定一个薯条证明，每个薯条证明具有唯一ID记录在区块链上不可篡改，可供他人查看。
              </p>
            </CardContent>
          </Card>

          <Card className="group border border-harbor-200 bg-white hover:shadow-xl hover:scale-105 transition-all duration-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-harbor-50/50 to-harbor-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-harbor-500 to-harbor-700 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div>
                  <CardTitle className="text-neutral-900 text-xl">分散自治</CardTitle>
                  <Badge variant="outline" className="text-harbor-600 border-harbor-300 mt-2">
                    (011) Decentralized
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-neutral-700 leading-relaxed">
                由创作者和用户共同治理的去中心化社区，每个人都有发言权，共同决定社区的发展方向。
              </p>
            </CardContent>
          </Card>

          <Card className="group border border-success-200 bg-white hover:shadow-xl hover:scale-105 transition-all duration-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-success-50/50 to-success-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-warning-500 to-warning-700 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <div>
                  <CardTitle className="text-neutral-900 text-xl">为爱发电</CardTitle>
                  <Badge variant="outline" className="text-warning-600 border-warning-300 mt-2">
                    (100) Create with Love
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-neutral-700 leading-relaxed">
                支持纯粹的创作热情，让创作者能够专注于自己热爱的内容创作，不被商业化束缚。
              </p>
            </CardContent>
          </Card>

          <Card className="group border border-warning-200 bg-white hover:shadow-xl hover:scale-105 transition-all duration-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-warning-50/50 to-warning-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-warning-500 to-warning-700 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Coins className="w-7 h-7 text-white" />
                </div>
                <div>
                  <CardTitle className="text-neutral-900 text-xl">有偿交换</CardTitle>
                  <Badge variant="outline" className="text-warning-600 border-neutral-300 mt-2">
                    (101) Fair Exchange
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-neutral-700 leading-relaxed">
                公平的稳定代币匿名交换机制，让优质创作获得应有的回报和认可，建立可持续的创作生态。
              </p>
            </CardContent>
          </Card>

          <Card className="group border border-seagull-200 bg-white hover:shadow-xl hover:scale-105 transition-all duration-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-seagull-50/50 to-seagull-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-warning-500 to-warning-700 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Globe className="w-7 h-7 text-white" />
                </div>
                <div>
                  <CardTitle className="text-neutral-900 text-xl">全球连接</CardTitle>
                  <Badge variant="outline" className="text-warning-600 border-seagull-300 mt-2">
                    Global Community
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-neutral-700 leading-relaxed">
                轻松连接全球的同人创作者，打破地域限制，构建无国界的创作社区，让文化交流更加自由。
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Technology Stack */}
        <div className="relative bg-white border border-harbor-200 rounded-3xl shadow-xl p-12 mb-20">
          <div className="absolute inset-0 bg-gradient-to-br from-white-50/30 to-white-100/30 rounded-3xl"></div>
          <div className="relative z-10">
          <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-white border border-harbor-200 px-6 py-3 rounded-full mb-8 shadow-sm">
            <div className="text-lg">🗺️</div>
            <span className="text-harbor-700 font-medium">Dapp Architecture</span>
          </div>
          <h2 className="text-4xl sm:text-4xl font-bold text-neutral-900 mb-6">技术架构</h2>
              <p className="text-lg text-neutral-600">基于最新Web3技术栈构建的现代化平台</p>
              <div className="flex items-center justify-center mt-6">
                <div className="h-px bg-gradient-to-r from-transparent via-harbor-300 to-transparent w-24"></div>
                <div className="mx-4 text-3xl animate-wave"></div>
                <div className="h-px bg-gradient-to-r from-transparent via-harbor-300 to-transparent w-24"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="group text-center p-8 bg-white border border-harbor-200 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">🔗</div>
                <h4 className="font-bold text-neutral-900 mb-3 text-lg">Lens Protocol</h4>
                <p className="text-sm text-neutral-600 leading-relaxed">去中心化社交协议，构建开放的社交图谱</p>
              </div>

              <div className="group text-center p-8 bg-white border border-success-200 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">🌳</div>
                <h4 className="font-bold text-neutral-900 mb-3 text-lg">Grove Storage</h4>
                <p className="text-sm text-neutral-600 leading-relaxed">分布式内容存储，确保数据长期保存</p>
              </div>

              <div className="group text-center p-8 bg-white border border-warning-200 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">🏠</div>
                <h4 className="font-bold text-neutral-900 mb-3 text-lg">Family Wallet</h4>
                <p className="text-sm text-neutral-600 leading-relaxed">安全便捷的钱包连接体验</p>
              </div>

              <div className="group text-center p-8 bg-white border border-seagull-200 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">⚡</div>
                <h4 className="font-bold text-neutral-900 mb-3 text-lg">Next.js</h4>
                <p className="text-sm text-neutral-600 leading-relaxed">现代化Web框架，极致用户体验</p>
              </div>
            </div>
          </div>
        </div>

        {/* ChipsSection */}
        <ChipsSection />

        {/* Roadmap */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-white border border-harbor-200 px-6 py-3 rounded-full mb-8 shadow-sm">
            <div className="text-lg">🗺️</div>
            <span className="text-harbor-700 font-medium">Development Roadmap</span>
          </div>

          <h3 className="text-4xl font-bold text-neutral-900 mb-4">发展路线图</h3>
          <p className="text-lg text-neutral-600 mb-12">分阶段构建完整的去中心化创作生态</p>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="group relative overflow-hidden border border-harbor-200 bg-white hover:shadow-xl transition-all duration-500 hover:scale-105">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-harbor-500 to-harbor-700"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-harbor-50/30 to-harbor-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-harbor-500 text-white px-4 py-2 text-sm font-medium">Phase 1</Badge>
                    <div className="text-2xl">🚀</div>
                  </div>
                  <CardTitle className="text-2xl text-neutral-900">基础平台</CardTitle>
                  <p className="text-neutral-600">构建核心功能模块</p>
                </CardHeader>
                <CardContent className="relative z-10">
                  <ul className="space-y-3 text-left">
                    <li className="flex items-center space-x-3 text-neutral-700">
                      <div className="w-2 h-2 bg-harbor-500 rounded-full"></div>
                      <span>用户认证系统</span>
                    </li>
                    <li className="flex items-center space-x-3 text-neutral-700">
                      <div className="w-2 h-2 bg-harbor-500 rounded-full"></div>
                      <span>内容创作工具</span>
                    </li>
                    <li className="flex items-center space-x-3 text-neutral-700">
                      <div className="w-2 h-2 bg-harbor-500 rounded-full"></div>
                      <span>原创声明功能</span>
                    </li>
                    <li className="flex items-center space-x-3 text-neutral-700">
                      <div className="w-2 h-2 bg-harbor-500 rounded-full"></div>
                      <span>社区动态展示</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border border-success-200 bg-white hover:shadow-xl transition-all duration-500 hover:scale-105">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-success-500 to-success-700"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-success-50/30 to-success-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-success-500 text-white px-4 py-2 text-sm font-medium">Phase 2</Badge>
                    <div className="text-2xl">💬</div>
                  </div>
                  <CardTitle className="text-2xl text-neutral-900">通讯层建设</CardTitle>
                  <p className="text-neutral-600">构建社交互动功能</p>
                </CardHeader>
                <CardContent className="relative z-10">
                  <ul className="space-y-3 text-left">
                    <li className="flex items-center space-x-3 text-neutral-700">
                      <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                      <span>互动功能机制</span>
                    </li>
                    <li className="flex items-center space-x-3 text-neutral-700">
                      <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                      <span>实时通知推送</span>
                    </li>
                    <li className="flex items-center space-x-3 text-neutral-700">
                      <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                      <span>标签管理探索</span>
                    </li>
                    <li className="flex items-center space-x-3 text-neutral-700">
                      <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                      <span>热度排序功能</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border border-warning-200 bg-white hover:shadow-xl transition-all duration-500 hover:scale-105">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-warning-500 to-warning-700"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-warning-50/30 to-warning-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-warning-500 text-white px-4 py-2 text-sm font-medium">Phase 3</Badge>
                    <div className="text-2xl">🌟</div>
                  </div>
                  <CardTitle className="text-2xl text-neutral-900">生态完善</CardTitle>
                  <p className="text-neutral-600">打造完整创作生态</p>
                </CardHeader>
                <CardContent className="relative z-10">
                  <ul className="space-y-3 text-left">
                    <li className="flex items-center space-x-3 text-neutral-700">
                      <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                      <span>代币打赏系统</span>
                    </li>
                    <li className="flex items-center space-x-3 text-neutral-700">
                      <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                      <span>数据保护机制</span>
                    </li>
                    <li className="flex items-center space-x-3 text-neutral-700">
                      <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                      <span>社区自治功能</span>
                    </li>
                    <li className="flex items-center space-x-3 text-neutral-700">
                      <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                      <span>移动端应用</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="relative text-center bg-harbor-gradient rounded-3xl p-16 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-10 left-10 opacity-20 float-animation">
            <div className="text-8xl">🌊</div>
          </div>
          <div className="absolute bottom-10 right-10 opacity-20 anchor-animation">
            <div className="text-6xl">⚓</div>
          </div>

          <div className="relative z-10">
            <h3 className="text-4xl sm:text-5xl font-bold mb-6">加入 CHIPDOCK 社区</h3>
            <p className="text-xl sm:text-2xl mb-4 opacity-90">与全球创作者一起，在去中心化的港口自由创作</p>
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
                    <Button size="lg" 
                    className="bg-white text-harbor-600 hover:bg-harbor-50 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                    onClick={show}>
                      <span>立即加入</span>
                      <div className="text-xl">🍟</div>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
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
                  <span>探索社区</span>
                  <div className="text-xl">🌊</div>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
