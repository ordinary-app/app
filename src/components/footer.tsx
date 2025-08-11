import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  const homeT = useTranslations("home");
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
        {/* <div className="space-y-4">
            <div className="flex items-center space-x-2">
              {/*<div className="text-2xl">⚓</div>*/}
        {/* <span className="font-bold text-xl">Ordinary</span>
            </div>
            <p className="text-gray-400 text-sm">{t("brand.description")}</p>
            <div className="flex space-x-4 text-2xl">
              <span>🕊️</span>
              <span>🍟</span>
              <span>🌊</span>
            </div>
          </div> */}

        {/* Core Principles */}
        {/* <div>
            <h3 className="font-semibold mb-4">Core Principles</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>(1) 抗审查 Anti-Censorship</li>
              <li>(2) 尊重原创 Respect Originality</li>
              <li>(3) 去中心化 Decentralized</li>
              <li>(4) 为爱发电 Powered by Love</li>
              <li>(5) 有偿交换 Coin Exchange</li>
            </ul>
          </div> */}

        {/* Community */}
        {/* <div>
            <h3 className="font-semibold mb-4">Community</h3>
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
          </div> */}

        {/* Resources */}
        {/* <div>
            <h3 className="font-semibold mb-4">Resources</h3>
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
        </div> */}

        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6">
          <p className="text-gray-400 text-sm text-center">
            © 2025 Ordinary. Built with ❤️ for the decentralized fandoms.
          </p>
          <div className="flex items-center space-x-4">
            <Link
              href="https://github.com/ordinary-app/app"
              target="_blank"
              className="flex items-center text-gray-400 hover:text-white transition-colors group"
            >
              <svg
                className="w-6 h-6 group-hover:scale-110 transition-transform"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </Link>
            <Link
              href="https://x.com/segseven"
              target="_blank"
              className="flex items-center text-gray-400 hover:text-white transition-colors group"
            >
              <svg
                className="w-6 h-6 group-hover:scale-110 transition-transform"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
