import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface LayoutProps { children: React.ReactNode }

const BRANDS = ['Samsung', 'Apple', 'Xiaomi', 'Oppo', 'Vivo', 'OnePlus', 'Huawei', 'Realme'];

export default function Layout({ children }: LayoutProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const userRole = (session?.user as { role?: string } | undefined)?.role;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState('');

  const handleSignOut = async () => { await signOut({ callbackUrl: '/' }); };
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* Announcement marquee */}
      <div className="bg-orange-500 text-white text-xs font-semibold h-7 flex items-center overflow-hidden">
        <div className="marquee-track px-4">
          Pakistan&apos;s #1 Phone Marketplace &nbsp;&bull;&nbsp; Buy New, Used &amp; Refurbished Phones &nbsp;&bull;&nbsp; List Your Phone for FREE &nbsp;&bull;&nbsp; Trusted Sellers Across All Major Cities
        </div>
      </div>
      {/* Main header */}
      <header className="sticky top-0 z-40 bg-[#111] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-3">
          <Link href="/" className="brand-font text-xl font-bold shrink-0 tracking-wide">
            PAK<span className="text-orange-500">PHONES</span>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 hidden sm:flex max-w-lg mx-4">
            <input
              type="text"
              placeholder="Search phones, brands, models..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 px-4 py-1.5 text-sm bg-white/10 border border-white/20 rounded-l text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
            />
            <button type="submit" className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-r transition-colors">
              Search
            </button>
          </form>

          <div className="flex items-center gap-2 ml-auto text-sm">
            {session ? (
              <>
                <Link href="/phones/add" className="hidden sm:inline-flex items-center px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded transition-colors text-xs uppercase tracking-wide">
                  + Sell Phone
                </Link>
                <Link href="/profile" className="hidden sm:inline-block px-3 py-1.5 text-gray-300 hover:text-white font-medium rounded transition-colors">
                  My Account
                </Link>
                {userRole === 'admin' && (
                  <Link href="/admin" className="hidden sm:inline-block px-3 py-1.5 text-gray-300 hover:text-orange-400 font-medium rounded transition-colors text-xs uppercase">
                    Admin
                  </Link>
                )}
                <button onClick={handleSignOut} className="px-3 py-1.5 text-gray-400 hover:text-red-400 transition-colors text-xs">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/phones/add" className="hidden sm:inline-flex items-center px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded transition-colors text-xs uppercase tracking-wide">
                  + Sell Phone
                </Link>
                <Link href="/auth/signin" className="hidden sm:inline-block px-3 py-1.5 text-gray-300 hover:text-white transition-colors font-medium">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="inline-flex items-center px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded transition-colors text-xs uppercase tracking-wide">
                  Register
                </Link>
              </>
            )}
            <button onClick={() => setMobileMenuOpen(p => !p)} className="sm:hidden p-1 text-gray-300 hover:text-white text-sm">
              {mobileMenuOpen ? 'X' : '='}
            </button>
          </div>
        </div>
        {/* Category / Brand strip */}
        <nav className="bg-[#1c1c1c] border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 h-9 overflow-x-auto">
            <span className="text-gray-500 text-xs font-semibold uppercase tracking-widest shrink-0 mr-2">Brands:</span>
            {BRANDS.map(b => (
              <Link key={b} href={`/?brand=${b}`}
                className="shrink-0 px-3 py-0.5 text-xs font-semibold text-gray-300 hover:text-orange-400 hover:bg-white/5 rounded transition-colors">
                {b}
              </Link>
            ))}
            <span className="mx-2 text-white/20">|</span>
            <Link href="/?condition=new"   className="shrink-0 px-3 py-0.5 text-xs font-semibold text-gray-300 hover:text-green-400 hover:bg-white/5 rounded transition-colors">New</Link>
            <Link href="/?condition=used"  className="shrink-0 px-3 py-0.5 text-xs font-semibold text-gray-300 hover:text-blue-400 hover:bg-white/5 rounded transition-colors">Used</Link>
            <Link href="/?condition=refurbished" className="shrink-0 px-3 py-0.5 text-xs font-semibold text-gray-300 hover:text-purple-400 hover:bg-white/5 rounded transition-colors">Refurbished</Link>
          </div>
        </nav>
        {mobileMenuOpen && (
          <div className="sm:hidden bg-[#1a1a1a] border-t border-white/10 px-4 py-3 space-y-2">
            <form onSubmit={handleSearch} className="flex mb-3">
              <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
                className="flex-1 px-3 py-1.5 text-sm bg-white/10 border border-white/20 rounded-l text-white placeholder-gray-400 focus:outline-none" />
              <button type="submit" className="px-3 py-1.5 bg-orange-500 text-white text-sm font-semibold rounded-r">Go</button>
            </form>
            {session ? (
              <>
                <Link href="/phones/add" className="block text-sm text-orange-400 font-bold py-1" onClick={() => setMobileMenuOpen(false)}>+ Sell Phone</Link>
                <Link href="/profile" className="block text-sm text-gray-300 py-1" onClick={() => setMobileMenuOpen(false)}>My Account</Link>
                {userRole === 'admin' && <Link href="/admin" className="block text-sm text-gray-300 py-1" onClick={() => setMobileMenuOpen(false)}>Admin</Link>}
                <button onClick={handleSignOut} className="block text-sm text-red-400 py-1 w-full text-left">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/phones/add" className="block text-sm text-orange-400 font-bold py-1" onClick={() => setMobileMenuOpen(false)}>+ Sell Phone</Link>
                <Link href="/auth/signin" className="block text-sm text-gray-300 py-1" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                <Link href="/auth/signup" className="block text-sm text-orange-400 font-bold py-1" onClick={() => setMobileMenuOpen(false)}>Register Free</Link>
              </>
            )}
          </div>
        )}
      </header>
      <main className="max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8 fade-up">
        {children}
      </main>
      <footer className="bg-[#111] text-gray-400 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div className="col-span-2 sm:col-span-1">
            <p className="brand-font text-xl font-bold text-white mb-2">PAK<span className="text-orange-500">PHONES</span></p>
            <p className="text-xs leading-relaxed">Pakistan&apos;s trusted marketplace for buying and selling new, used, and refurbished smartphones.</p>
          </div>
          <div>
            <p className="text-white text-xs font-bold uppercase tracking-widest mb-3">Top Brands</p>
            <ul className="space-y-1.5 text-xs">
              {['Samsung', 'Apple', 'Xiaomi', 'Oppo', 'Vivo'].map(b => (
                <li key={b}><Link href={`/?brand=${b}`} className="hover:text-orange-400 transition-colors">{b}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-white text-xs font-bold uppercase tracking-widest mb-3">Condition</p>
            <ul className="space-y-1.5 text-xs">
              {['New', 'Used', 'Refurbished'].map(c => (
                <li key={c}><Link href={`/?condition=${c.toLowerCase()}`} className="hover:text-orange-400 transition-colors">{c}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-white text-xs font-bold uppercase tracking-widest mb-3">Account</p>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="/auth/signin" className="hover:text-orange-400 transition-colors">Sign In</Link></li>
              <li><Link href="/auth/signup" className="hover:text-orange-400 transition-colors">Register</Link></li>
              <li><Link href="/phones/add" className="hover:text-orange-400 transition-colors">Sell a Phone</Link></li>
              <li><Link href="/profile" className="hover:text-orange-400 transition-colors">My Profile</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 text-center text-xs py-4 text-gray-600">
          &copy; {new Date().getFullYear()} PakPhones. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
