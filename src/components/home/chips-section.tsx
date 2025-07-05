import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Hash, Eye, Lock, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

export function ChipsSection() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-harbor-50/30">
      {/* Background Elements */}
      <div className="absolute top-20 right-10 opacity-8 float-animation">
        <div className="text-6xl">🍟</div>
      </div>
      <div className="absolute bottom-20 left-10 opacity-8 anchor-animation">
        <div className="text-5xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white border border-harbor-200 px-6 py-3 rounded-full mb-8 shadow-sm">
            <div className="text-harbor-500">🔒</div>
            <span className="text-chip-600 font-bold">Chip Certificate</span>
            <div className="text-harbor-500">🔒</div>
          </div>

          <h2 className="text-4xl sm:text-4xl font-bold text-neutral-900 mb-6">薯条证明系统</h2>
          <p className="text-xl text-neutral-700 max-w-3xl mx-auto leading-relaxed">
            基于区块链技术的原创作品认证系统，为每一份原创内容提供不可篡改的所有权证明
          </p>
        </div>

        {/* How It Works */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-harbor-500 to-harbor-700 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">声明原创</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    用户在发布帖子时可以选择声明作品为原创，系统将为该作品生成独特的薯条证明
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-warning-500 to-warning-700 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">区块链记录</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    薯条证明的唯一ID和相关信息被永久记录在区块链上，确保数据不可篡改
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-success-500 to-success-700 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">公开验证</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    任何人都可以查看和验证薯条证明，确保原创作品的透明度和可信度
                  </p>
                </div>
              </div>
            </div>

            <Button asChild size="lg" className="chip-button text-white font-semibold">
              <Link href="/create" className="flex items-center space-x-2">
                <span>发布作品并获得证明</span>
                <div className="text-lg">🍟</div>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>

          {/* Certificate Preview */}
          <div className="relative">
            <Card className="bg-white border-2 border-harbor-200 shadow-2xl transform rotate-0 hover:rotate-1 transition-transform duration-300">
              <CardHeader className="bg-gradient-to-r from-chip-500 to-chip-300 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="text-2xl">🍟</div>
                    <CardTitle className="text-xl">Chip Certificate</CardTitle>
                  </div>
                  <Badge className="bg-white/20 text-white border-white/30">Verified</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Certificate ID</span>
                    <div className="flex items-center space-x-2">
                      <Hash className="w-4 h-4 text-harbor-500" />
                      <span className="font-mono text-sm text-harbor-700">CHIPS-TOKEN-ID</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Creator</span>
                    <span className="font-medium text-neutral-900">@seagull_artist</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Created</span>
                    <span className="text-sm text-neutral-700">2024-01-15 14:30 UTC</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Blockchain</span>
                    <div className="flex items-center space-x-2">
                      <Lock className="w-4 h-4 text-success-500" />
                      <span className="text-sm text-success-600">Immutable</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Status</span>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-success-500" />
                      <span className="text-sm text-success-600 font-medium">Verified Original</span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-harbor-200 text-harbor-700 hover:bg-harbor-50 bg-transparent"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View on Blockchain
                </Button>
              </CardContent>
            </Card>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 text-3xl opacity-60 float-animation"></div>
            <div className="absolute -bottom-4 -left-4 text-2xl opacity-60 anchor-animation"></div>
          </div>
        </div>

        {/* Benefits Grid */}
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
              <div className="w-12 h-12 bg-gradient-to-br from-warning-500 to-warning-700 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Hash className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">唯一标识</h3>
              <p className="text-sm text-neutral-600">每个证明都有独特的ID，便于追踪和验证</p>
            </CardContent>
          </Card>

          <Card className="group border border-warning-200 bg-white hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-success-700 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
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
    </section>
  )
}
