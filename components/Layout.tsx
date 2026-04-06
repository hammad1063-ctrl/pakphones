import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const userRole = (session?.user as { role?: string } | undefined)?.role;

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-40 border-b border-white/60 bg-white/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-bold shadow-md">
                P
              </span>
              <Link href="/" className="headline-font text-xl font-bold text-slate-900 tracking-tight">
                PakPhones
              </Link>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              <Link
                href="/"
                className={`px-3 py-2 rounded-full text-sm font-semibold transition-colors ${
                  router.pathname === '/'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Home
              </Link>

              {session ? (
                <>
                  <Link
                    href="/phones/add"
                    className={`px-3 py-2 rounded-full text-sm font-semibold transition-colors ${
                      router.pathname === '/phones/add'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    Add Phone
                  </Link>
                  <Link
                    href="/profile"
                    className={`px-3 py-2 rounded-full text-sm font-semibold transition-colors ${
                      router.pathname === '/profile'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    Profile
                  </Link>
                  {userRole === 'admin' && (
                    <Link
                      href="/admin"
                      className={`px-3 py-2 rounded-full text-sm font-semibold transition-colors ${
                        router.pathname === '/admin'
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="px-3 py-2 rounded-full text-sm font-semibold text-slate-700 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="px-3 py-2 rounded-full text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-md transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 animate-rise-in">
        {children}
      </main>
    </div>
  );
}