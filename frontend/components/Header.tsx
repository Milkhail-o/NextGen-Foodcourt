'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Utensils,
  Moon,
  Sun,
  BarChart3,
  ClipboardList,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext'; // Adjust the import path as necessary

export default function Header() {
  const pathname = usePathname();
  const { user, isLoggedIn, cart, loading, logout } = useAuth();
  const isOwner = user?.role === 'owner';
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Initialize dark mode from localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setMobileMenuOpen(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const ownerNavItems = [
    { href: '/owner-dashboard', label: 'Overview', icon: BarChart3 },
    { href: '/owner-analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/order-management', label: 'Order Management', icon: ClipboardList }
  ];

  const customerNavItems = [
    { href: '/', label: 'Home' },
    { href: '/order', label: 'Order' },
    { href: '/reservations', label: 'Reservations' },
    ...(isLoggedIn && user
      ? [
          { href: '#', label: `Hello, ${user.name}`, isUserGreeting: true as const }
        ]
      : [{ href: '/login', label: 'Login' }])
  ];

  const navItems = isOwner ? ownerNavItems : customerNavItems;
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <nav className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-full">
                <Utensils className="w-8 h-8 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                NextGen FoodCourt
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-8 w-20 rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-full">
              <Utensils className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              NextGen FoodCourt
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <div key={item.href}>
                {'isUserGreeting' in item && item.isUserGreeting ? (
                  <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className={`text-lg font-semibold transition-all duration-300 hover:text-orange-600 hover:scale-105 ${
                      pathname === item.href
                        ? 'text-orange-600 border-b-2 border-orange-600'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}

            {/* Show cart only for customers */}
            {!isOwner && (
              <Link href="/checkout" className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-orange-600">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Logout button for logged in users */}
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="text-lg font-semibold text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1 transition-colors"
              >
                <LogOut className="w-5 h-5" /> Logout
              </button>
            )}

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-orange-600 transition-colors"
            >
              {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Show cart only for customers */}
            {!isOwner && (
              <Link href="/checkout" className="relative p-2 text-gray-700 dark:text-gray-300">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-700 dark:text-gray-300"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 dark:text-gray-300"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <div key={item.href}>
                  {'isUserGreeting' in item && item.isUserGreeting ? (
                    <span className="block px-4 py-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-2 text-lg font-semibold transition-colors ${
                        pathname === item.href
                          ? 'text-orange-600 bg-orange-50 dark:bg-orange-900/20'
                          : 'text-gray-700 dark:text-gray-300 hover:text-orange-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}

              {isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="text-left px-4 py-2 text-lg font-semibold text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

