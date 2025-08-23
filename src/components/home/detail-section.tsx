"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Users,
  Zap,
  Globe,
  Heart,
  Coins,
  ArrowRight,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { CHIPSSection } from "@/components/home/chips-section";
import { useAuthCheck } from "@/hooks/auth/use-auth-check";
import { ConnectKitButton } from "connectkit";
import { useTranslations } from "next-intl";

export function DetailSection() {
  const t = useTranslations("detail");
  const { isAuthenticated } = useAuthCheck();

  return (
    <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white">
      {/* Harbor Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-harbor-50/30 via-white to-harbor-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800" />

      {/* Floating Harbor Elements */}
      <div className="absolute top-20 left-10 opacity-8 float-animation">
        <div className="text-8xl"></div>
      </div>
      <div className="absolute top-40 right-20 opacity-8 anchor-animation">
        <div className="text-6xl"></div>
      </div>
      <div
        className="absolute bottom-40 left-20 opacity-8 wave-animation"
        style={{ animationDelay: "1s" }}
      >
        <div className="text-7xl"></div>
      </div>
      <div
        className="absolute bottom-20 right-10 opacity-8 anchor-animation"
        style={{ animationDelay: "2s" }}
      >
        <div className="text-5xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Project Vision */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-white border border-harbor-200 px-6 py-3 rounded-full mb-8 shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            {/*<div className="text-harbor-500">🚢</div>*/}
            <span className="text-harbor-700 font-medium dark:text-harbor-500">
              {t("sectionTitle")}
            </span>
            {/*<div className="text-harbor-500">🚢</div>*/}
          </div>

          <h2 className="text-5xl sm:text-6xl font-bold text-neutral-900 mb-8 leading-tight dark:text-neutral-100">
            <p className="mb-4">{t("mainTitle")}</p>
            <span className="bg-gradient-to-r from-harbor-600 via-harbor-500 to-harbor-400 bg-clip-text text-transparent">
              {t("mainTitleHighlight")}
            </span>
          </h2>

          <div className="max-w-4xl mx-auto space-y-4">
            <p className="text-2xl text-neutral-700 leading-relaxed dark:text-neutral-300">
              {t("platformDescription")}
            </p>
            <p className="text-lg text-neutral-600 leading-relaxed dark:text-neutral-400">
              {t("protocolDescription")}
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
          <Card className="group border border-harbor-200 bg-white hover:shadow-xl hover:scale-105 transition-all duration-500 relative overflow-hidden dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <div className="absolute inset-0 bg-gradient-to-br from-harbor-50/50 to-harbor-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 "></div>
            <CardHeader className="relative z-10">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-harbor-500 to-harbor-700 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <CardTitle className="text-neutral-900 text-xl dark:text-neutral-100">
                    {t("features.antiCensorship.title")}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-neutral-700 leading-relaxed dark:text-neutral-300 dark:border-neutral-300">
                {t("features.antiCensorship.description")}
              </p>
            </CardContent>
          </Card>

          <Card className="group border border-harbor-200 bg-white hover:shadow-xl hover:scale-105 transition-all duration-500 relative overflow-hidden dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <div className="absolute inset-0 bg-gradient-to-br from-harbor-50/50 to-harbor-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-harbor-500 to-harbor-700 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Heart className="w-7 h-7 text-white" />
                </div>
                <div>
                  <CardTitle className="text-neutral-900 text-xl dark:text-neutral-100">
                    {t("features.dataProof.title")}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-neutral-700 leading-relaxed mb-4 dark:text-neutral-300 dark:border-neutral-300">
                {t("features.dataProof.description")}
              </p>
            </CardContent>
          </Card>

          <Card className="group border border-harbor-200 bg-white hover:shadow-xl hover:scale-105 transition-all duration-500 relative overflow-hidden dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <div className="absolute inset-0 bg-gradient-to-br from-harbor-50/50 to-harbor-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-harbor-500 to-harbor-700 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div>
                  <CardTitle className="text-neutral-900 text-xl dark:text-neutral-100">
                    {t("features.decentralized.title")}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-neutral-700 leading-relaxed dark:text-neutral-300 dark:border-neutral-300">
                {t("features.decentralized.description")}
              </p>
            </CardContent>
          </Card>

          <Card className="group border border-harbor-200 bg-white hover:shadow-xl hover:scale-105 transition-all duration-500 relative overflow-hidden dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <div className="absolute inset-0 bg-gradient-to-br from-harbor-50/50 to-harbor-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-harbor-500 to-harbor-700 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <div>
                  <CardTitle className="text-neutral-900 text-xl dark:text-neutral-100">
                    {t("features.poweredByLove.title")}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-neutral-700 leading-relaxed dark:text-neutral-300 dark:border-neutral-300">
                {t("features.poweredByLove.description")}
              </p>
            </CardContent>
          </Card>

          <Card className="group border border-harbor-200 bg-white hover:shadow-xl hover:scale-105 transition-all duration-500 relative overflow-hidden dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <div className="absolute inset-0 bg-gradient-to-br from-harbor-50/50 to-harbor-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-harbor-500 to-harbor-700 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Coins className="w-7 h-7 text-white" />
                </div>
                <div>
                  <CardTitle className="text-neutral-900 text-xl dark:text-neutral-100">
                    {t("features.coinExchange.title")}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-neutral-700 leading-relaxed dark:text-neutral-300 dark:border-neutral-300">
                {t("features.coinExchange.description")}
              </p>
            </CardContent>
          </Card>

          <Card className="group border border-harbor-200 bg-white hover:shadow-xl hover:scale-105 transition-all duration-500 relative overflow-hidden dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <div className="absolute inset-0 bg-gradient-to-br from-harbor-50/50 to-harbor-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-harbor-500 to-harbor-700 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Globe className="w-7 h-7 text-white" />
                </div>
                <div>
                  <CardTitle className="text-neutral-900 text-xl dark:text-neutral-100">
                    {t("features.anonymousCommunity.title")}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-neutral-700 leading-relaxed dark:text-neutral-300 dark:border-neutral-300">
                {t("features.anonymousCommunity.description")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Technology Stack */}
        {/*<div className="relative bg-white border border-harbor-200 rounded-3xl shadow-xl p-12 mb-20">
          <div className="absolute inset-0 bg-gradient-to-br from-white-50/30 to-white-100/30 rounded-3xl"></div>
          <div className="relative z-10">
          <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-white border border-harbor-200 px-6 py-3 rounded-full mb-8 shadow-sm">
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
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  🔗
                </div>
                <h4 className="font-bold text-neutral-900 mb-3 text-lg">
                  {t("techStack.lens.title")}
                </h4>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {t("techStack.lens.description")}
                </p>
              </div>

              <div className="group text-center p-8 bg-white border border-success-200 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  🌳
                </div>
                <h4 className="font-bold text-neutral-900 mb-3 text-lg">
                  {t("techStack.grove.title")}
                </h4>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {t("techStack.grove.description")}
                </p>
              </div>

              <div className="group text-center p-8 bg-white border border-warning-200 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">🏠</div>
                <h4 className="font-bold text-neutral-900 mb-3 text-lg">Family Wallet</h4>
                <p className="text-sm text-neutral-600 leading-relaxed">安全便捷的地址连接体验</p>
              </div>

              <div className="group text-center p-8 bg-white border border-seagull-200 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  ⚡
                </div>
                <h4 className="font-bold text-neutral-900 mb-3 text-lg">
                  {t("techStack.nextjs.title")}
                </h4>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {t("techStack.nextjs.description")}
                </p>
              </div>
            </div>
          </div>
        </div>*/}

        {/* CHIPSSection */}
        <CHIPSSection />

        {/* Roadmap */}
        <div className="text-center mb-32 mt-24">
          <div className="inline-flex items-center space-x-2 bg-white border border-harbor-200 px-6 py-3 rounded-full mb-8 shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            {/*<div className="text-lg">🗺️</div>*/}
            <span className="text-harbor-700 font-medium dark:text-harbor-500">
              {t("roadmap.title")}
            </span>
          </div>

          <h3 className="text-4xl font-bold text-neutral-900 mb-4 dark:text-neutral-100">
            {t("roadmap.title")}
          </h3>
          <p className="text-lg text-neutral-600 mb-12 dark:text-neutral-400">
            {t("roadmap.subtitle")}
          </p>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="group relative overflow-hidden border border-harbor-200 bg-white hover:shadow-xl transition-all duration-500 hover:scale-105 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-harbor-500 to-harbor-700"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-harbor-50/30 to-harbor-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-harbor-500 text-white px-4 py-2 text-sm font-medium">
                      Phase 1
                    </Badge>
                    <div className="text-2xl">🚀</div>
                  </div>
                  <CardTitle className="text-2xl text-neutral-900 dark:text-neutral-100">
                    {t("roadmap.phase1.title")}
                  </CardTitle>
                  <p className="text-neutral-600 dark:text-neutral-200">
                    {t("roadmap.phase1.subtitle")}
                  </p>
                </CardHeader>
                <CardContent className="relative z-10 dark:text-neutral-300">
                  <ul className="space-y-3 text-left">
                    {t
                      .raw("roadmap.phase1.features")
                      .map((feature: string, index: number) => (
                        <li
                          key={index}
                          className="flex items-center space-x-3 text-neutral-700 dark:text-neutral-300"
                        >
                          <div className="w-2 h-2 bg-harbor-500 rounded-full"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border border-success-200 bg-white hover:shadow-xl transition-all duration-500 hover:scale-105 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-success-500 to-success-700"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-success-50/30 to-success-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-success-500 text-white px-4 py-2 text-sm font-medium">
                      Phase 2
                    </Badge>
                    <div className="text-2xl">💬</div>
                  </div>
                  <CardTitle className="text-2xl text-neutral-900 dark:text-neutral-100">
                    {t("roadmap.phase2.title")}
                  </CardTitle>
                  <p className="text-neutral-600 dark:text-neutral-200">
                    {t("roadmap.phase2.subtitle")}
                  </p>
                </CardHeader>
                <CardContent className="relative z-10 dark:text-neutral-300">
                  <ul className="space-y-3 text-left">
                    {t
                      .raw("roadmap.phase2.features")
                      .map((feature: string, index: number) => (
                        <li
                          key={index}
                          className="flex items-center space-x-3 text-neutral-700 dark:text-neutral-300"
                        >
                          <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border border-warning-200 bg-white hover:shadow-xl transition-all duration-500 hover:scale-105 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-warning-500 to-warning-700"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-warning-50/30 to-warning-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-warning-500 text-white px-4 py-2 text-sm font-medium">
                      Phase 3
                    </Badge>
                    <div className="text-2xl">🌟</div>
                  </div>
                  <CardTitle className="text-2xl text-neutral-900 dark:text-neutral-100">
                    {t("roadmap.phase3.title")}
                  </CardTitle>
                  <p className="text-neutral-600 dark:text-neutral-200">
                    {t("roadmap.phase3.subtitle")}
                  </p>
                </CardHeader>
                <CardContent className="relative z-10 dark:text-neutral-300">
                  <ul className="space-y-3 text-left">
                    {t
                      .raw("roadmap.phase3.features")
                      .map((feature: string, index: number) => (
                        <li
                          key={index}
                          className="flex items-center space-x-3 text-neutral-700 dark:text-neutral-300"
                        >
                          <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
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
            <div className="text-8xl"></div>
          </div>
          <div className="absolute bottom-10 right-10 opacity-20 anchor-animation">
            <div className="text-6xl"></div>
          </div>

          <div className="relative z-10">
            <h3 className="text-4xl sm:text-5xl font-bold mb-6">
              {t("cta.sectionTitle")}
            </h3>
            <p className="text-xl sm:text-2xl mb-4 opacity-90">
              {t("cta.sectionSubtitle")}
            </p>
            <p className="text-lg mb-12 opacity-80">
              {t("cta.description1")}
              <br />
              {t("cta.description2")}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
              {isAuthenticated ? (
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-harbor-600 hover:bg-harbor-50 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <Link href="/feed" className="flex items-center space-x-2">
                    <span>{t("cta.joinNow")}</span>
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
                      <span>{t("cta.joinNow")}</span>
                      {/*<div className="text-xl">🍟</div>*/}
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
                  <span>{t("cta.exploreCommunity")}</span>
                  {/*<div className="text-xl">🌊</div>*/}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
