import Link from "next/link";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  const homeT = useTranslations("home");
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">⚓</div>
              <span className="font-bold text-xl">Ordinary</span>
            </div>
            <p className="text-gray-400 text-sm">{t("brand.description")}</p>
            <div className="flex space-x-4 text-2xl">
              <span>🕊️</span>
              <span>🍟</span>
              <span>🌊</span>
            </div>
          </div>

          {/* Core Principles */}
          <div>
            <h3 className="font-semibold mb-4">{t("corePrinciples.title")}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>(1) {homeT("principles.antiCensorship")}</li>
              <li>(2) {homeT("principles.respectOriginality")}</li>
              <li>(3) {homeT("principles.decentralized")}</li>
              <li>(4) {homeT("principles.poweredByLove")}</li>
              <li>(5) {t("corePrinciples.fairExchange")}</li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-semibold mb-4">{t("community.title")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/feed"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("community.feed")}
                </Link>
              </li>
              <li>
                <Link
                  href="/creators"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("community.creators")}
                </Link>
              </li>
              <li>
                <Link
                  href="/guidelines"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("community.guidelines")}
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("community.support")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">{t("resources.title")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/docs"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("resources.documentation")}
                </Link>
              </li>
              <li>
                <Link
                  href="/api"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("resources.api")}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("resources.privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("resources.terms")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">{t("copyright")}</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-gray-400 text-sm">{t("poweredBy")}</span>
            <div className="flex items-center space-x-2">
              <Link href="https://lens.xyz/" target="_blank">
                <span className="text-green-400 font-medium">
                  Lens Protocol
                </span>
              </Link>
              <span className="text-gray-400">•</span>
              <Link
                href="https://lens.xyz/news/introducing-grove-onchain-controlled-storage"
                target="_blank"
              >
                <span className="text-blue-400 font-medium">Grove Storage</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
