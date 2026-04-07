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
    <div className="min-h-screen bg-slate-50">
      <div className="theme-topbar border-b border-blue-100 text-blue-900 text-xs sm:text-sm text-center py-2 px-4 font-semibold">
        New QMart Bright Theme Live - Post your ad in minutes.
      </div>

      <header className="theme-header sticky top-0 z-40 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
          <Link href="/" className="brand-font text-2xl font-bold text-gray-900 shrink-0">
            Q<span className="text-orange-500">MART</span>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 hidden md:flex max-w-xl mx-3">
            <input
              type="text"
              placeholder="Search phones by model, brand, or city"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="theme-input flex-1 px-4 py-2 text-sm rounded-l-lg placeholder-gray-400"
            />
            <button type="submit" className="theme-btn-primary px-4 py-2 text-sm font-semibold rounded-r-lg transition-colors">
              Search
            </button>
          </form>

          <div className="flex items-center gap-2 ml-auto text-sm">
            <Link href="/phones/add" className="theme-btn-primary hidden sm:inline-flex items-center px-4 py-2 font-semibold rounded-lg transition-colors">
              Post an Ad
            </Link>
            {session ? (
              <>
                <Link href="/profile" className="hidden sm:inline-block px-3 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-lg transition-colors">
                  My Account
                </Link>
                {userRole === 'admin' && (
                  <Link href="/admin" className="hidden sm:inline-block px-3 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-lg transition-colors">
                    Admin
                  </Link>
                )}
                <button onClick={handleSignOut} className="px-3 py-2 text-gray-500 hover:text-red-500 transition-colors">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="hidden sm:inline-block px-3 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-lg transition-colors">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="inline-flex items-center px-3 py-2 bg-gray-900 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors">
                  Register
                </Link>
              </>
            )}
            <button onClick={() => setMobileMenuOpen(p => !p)} className="md:hidden px-3 py-2 border border-gray-300 rounded-lg text-gray-700">
              {mobileMenuOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>

        <nav className="bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-2 overflow-x-auto">
            <span className="text-gray-500 text-xs font-semibold uppercase tracking-wide shrink-0">Popular:</span>
            {BRANDS.map(b => (
              <Link
                key={b}
                href={`/?brand=${b}`}
                className="theme-chip shrink-0 px-3 py-1.5 text-xs font-medium rounded-full transition-colors"
              >
                {b}
              </Link>
            ))}
          </div>
        </nav>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-3">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l-lg text-gray-900 placeholder-gray-400 focus:outline-none"
              />
              <button type="submit" className="px-3 py-2 bg-orange-500 text-white text-sm font-semibold rounded-r-lg">Go</button>
            </form>
            <Link href="/phones/add" className="block text-sm font-semibold text-orange-600" onClick={() => setMobileMenuOpen(false)}>Post an Ad</Link>
            {session ? (
              <>
                <Link href="/profile" className="block text-sm text-gray-700" onClick={() => setMobileMenuOpen(false)}>My Account</Link>
                {userRole === 'admin' && <Link href="/admin" className="block text-sm text-gray-700" onClick={() => setMobileMenuOpen(false)}>Admin</Link>}
                <button onClick={handleSignOut} className="block text-sm text-red-600 w-full text-left">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="block text-sm text-gray-700" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                <Link href="/auth/signup" className="block text-sm text-gray-700" onClick={() => setMobileMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 fade-up">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div className="col-span-2 sm:col-span-1">
            <p className="brand-font text-xl font-bold text-gray-900 mb-2">Q<span className="text-orange-500">MART</span></p>
            <p className="text-xs text-gray-600 leading-relaxed">Simple, trusted marketplace for buying and selling phones across Pakistan.</p>
          </div>
          <div>
            <p className="text-gray-900 text-xs font-bold uppercase tracking-widest mb-3">Top Brands</p>
            <ul className="space-y-1.5 text-xs text-gray-600">
              {['Samsung', 'Apple', 'Xiaomi', 'Oppo', 'Vivo'].map(b => (
                <li key={b}><Link href={`/?brand=${b}`} className="hover:text-orange-400 transition-colors">{b}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-gray-900 text-xs font-bold uppercase tracking-widest mb-3">Condition</p>
            <ul className="space-y-1.5 text-xs text-gray-600">
              {['New', 'Used', 'Refurbished'].map(c => (
                <li key={c}><Link href={`/?condition=${c.toLowerCase()}`} className="hover:text-orange-400 transition-colors">{c}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-gray-900 text-xs font-bold uppercase tracking-widest mb-3">Account</p>
            <ul className="space-y-1.5 text-xs text-gray-600">
              <li><Link href="/auth/signin" className="hover:text-orange-400 transition-colors">Sign In</Link></li>
              <li><Link href="/auth/signup" className="hover:text-orange-400 transition-colors">Register</Link></li>
              <li><Link href="/phones/add" className="hover:text-orange-500 transition-colors">Post an Ad</Link></li>
              <li><Link href="/profile" className="hover:text-orange-500 transition-colors">My Profile</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 text-center text-xs py-4 text-gray-500">
          &copy; {new Date().getFullYear()} QMart. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
