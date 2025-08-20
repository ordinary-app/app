import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Hash,
  Eye,
  Lock,
  CheckCircle,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function CHIPSSection() {
  const t = useTranslations("chips");

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-harbor-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Background Elements */}
      <div className="absolute top-20 right-10 opacity-8 float-animation">
        {/*<div className="text-6xl">🍟</div>*/}
      </div>
      <div className="absolute bottom-20 left-10 opacity-8 anchor-animation">
        <div className="text-5xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-white border border-chip-200 px-6 py-3 rounded-full mb-5 shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <div className="text-harbor-500"></div>
            <span className="text-chip-600 font-medium">{t("subtitle")}</span>
            <div className="text-harbor-500"></div>
          </div>
        </div>
        <div className="text-center mb-16">
          <div className="relative inline-block mb-6">
            <h2 className="text-4xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100">
              {t("title")}
            </h2>
            <span className="absolute -top-0 -right-11 px-1.5 py-0.5 font-light text-xs bg-chip-gradient text-white rounded-full shadow-md dark:bg-chip-500 dark:text-white">
              Beta
            </span>
          </div>
          <p className="text-xl text-neutral-700 max-w-3xl mx-auto leading-relaxed dark:text-neutral-300">
            {t("description")}
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
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2 dark:text-neutral-100">
                    {t("howItWorks.step1.title")}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed dark:text-neutral-300">
                    {t("howItWorks.step1.description")}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-warning-500 to-warning-700 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2 dark:text-neutral-100">
                    {t("howItWorks.step2.title")}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed dark:text-neutral-300">
                    {t("howItWorks.step2.description")}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-success-500 to-success-700 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2 dark:text-neutral-100">
                    {t("howItWorks.step3.title")}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed dark:text-neutral-300">
                    {t("howItWorks.step3.description")}
                  </p>
                </div>
              </div>
            </div>

            <Button
              asChild
              size="lg"
              className="chip-button text-white font-semibold"
            >
              <Link
                href="/what-is-chip"
                className="flex items-center space-x-2"
              >
                <div>{t("learnMore")}</div>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>

          {/* Certificate Preview */}
          <div className="relative">
            <Card className="bg-white border-2 border-harbor-200 shadow-2xl transform rotate-0 hover:rotate-1 transition-transform duration-300 dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="bg-gradient-to-r from-chip-500 to-chip-300 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {/*<div className="text-2xl">🍟</div>*/}
                    <CardTitle className="text-xl">{t("subtitle")}</CardTitle>
                  </div>
                  <Badge className="bg-white/20 text-white border-white/30">
                    {t("certificate.verified")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600 dark:text-neutral-100">
                      {t("certificate.certificateId")}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Hash className="w-4 h-4 text-harbor-500" />
                      <span className="font-mono text-sm text-harbor-700 dark:text-harbor-400">
                        Storage-ID
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600 dark:text-neutral-100">
                      {t("certificate.creator")}
                    </span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">
                      @artist
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600 dark:text-neutral-100">
                      {t("certificate.created")}
                    </span>
                    <span className="text-sm text-neutral-700 dark:text-neutral-300">
                      2025-08-08 09:30 UTC
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600 dark:text-neutral-100">
                      {t("certificate.blockchain")}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Lock className="w-4 h-4 text-success-500" />
                      <span className="text-sm text-success-600 dark:text-success-400">
                        {t("certificate.immutable")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600 dark:text-neutral-100">
                      {t("certificate.status")}
                    </span>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-success-500" />
                      <span className="text-sm text-success-600 font-medium dark:text-success-400">
                        {t("certificate.dataVerified")}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-harbor-200 text-harbor-700 hover:bg-harbor-50 bg-transparent dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {t("certificate.viewOnBlockchain")}
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
          <Card className="group border border-harbor-200 bg-white hover:shadow-lg transition-all duration-300 hover:scale-105 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-harbor-500 to-harbor-700 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2 dark:text-neutral-100">
                {t("benefits.antiCounterfeit.title")}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                {t("benefits.antiCounterfeit.description")}
              </p>
            </CardContent>
          </Card>

          <Card className="group border border-success-200 bg-white hover:shadow-lg transition-all duration-300 hover:scale-105 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-warning-500 to-warning-700 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Hash className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2 dark:text-neutral-100">
                {t("benefits.uniqueId.title")}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                {t("benefits.uniqueId.description")}
              </p>
            </CardContent>
          </Card>

          <Card className="group border border-warning-200 bg-white hover:shadow-lg transition-all duration-300 hover:scale-105 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-success-700 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2 dark:text-neutral-100">
                {t("benefits.transparency.title")}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                {t("benefits.transparency.description")}
              </p>
            </CardContent>
          </Card>

          <Card className="group border border-seagull-200 bg-white hover:shadow-lg transition-all duration-300 hover:scale-105 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-seagull-500 to-seagull-700 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2 dark:text-neutral-100">
                {t("benefits.permanentStorage.title")}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                {t("benefits.permanentStorage.description")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
