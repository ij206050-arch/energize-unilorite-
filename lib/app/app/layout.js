import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "ENERGIZE UNILORITE — UNILORIN Student Hub",
  description: "Campus news, results, and Post-UTME info for University of Ilorin students.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-neutral-50">
        <div className="max-w-md mx-auto min-h-screen bg-neutral-50 relative pb-16">
          <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-neutral-100">
            <div className="flex items-center justify-between px-4 py-3">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-brand">
                  <span className="text-white text-sm font-black">E</span>
                </div>
                <div className="leading-none">
                  <p className="font-black text-[13px] tracking-tight text-neutral-900">
                    ENERGIZE<span className="text-brand">UNILORITE</span>
                  </p>
                  <p className="text-[9px] text-neutral-400 font-semibold tracking-wide">UNILORIN STUDENT HUB</p>
                </div>
              </Link>
              <Link href="/dashboard" className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-sm">
                👤
              </Link>
            </div>
          </header>

          <main>{children}</main>

          <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-neutral-200">
            <div className="max-w-md mx-auto flex">
              {[
                ["/", "Home"],
                ["/feed", "Feed"],
                ["/results", "Results"],
                ["/post-utme", "Post-UTME"],
                ["/dashboard", "You"],
              ].map(([href, label]) => (
                <Link key={href} href={href} className="flex-1 text-center py-2.5 text-[11px] font-bold text-neutral-500 hover:text-brand">
                  {label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </body>
    </html>
  );
}
