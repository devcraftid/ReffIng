import { supabase } from './supabase.js';

/**
 * Cek apakah user sudah login. Jika belum, alihkan ke login.html
 */
export async function requireAuth() {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session) {
    // Hindari redirect infinite loop jika sudah di halaman login
    if (!window.location.pathname.includes('login.html')) {
      window.location.href = './login.html';
    }
    return null;
  }
  
  // Jika di halaman login tapi sudah login, alihkan ke dashboard
  if (window.location.pathname.includes('login.html')) {
    window.location.href = './index.html';
  }
  
  return session;
}

/**
 * Handle Login Admin
 */
export async function loginAdmin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
  
  if (error) {
    throw error;
  }
  
  return data;
}

/**
 * Handle Logout Admin
 */
export async function logoutAdmin() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
  window.location.href = './login.html';
}

// Otomatis cek auth untuk setiap halaman admin (kecuali login)
if (window.location.pathname.includes('/admin/')) {
  requireAuth();
  
  // Admin Mobile Menu Toggle Logic
  function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('admin-mobile-menu-btn');
    const adminSidebar = document.getElementById('admin-sidebar');
    const sidebarOverlay = document.getElementById('admin-sidebar-overlay');
    
    if (mobileMenuBtn && adminSidebar && sidebarOverlay) {
      mobileMenuBtn.addEventListener('click', () => {
        adminSidebar.classList.toggle('-translate-x-full');
        sidebarOverlay.classList.toggle('hidden');
      });
      sidebarOverlay.addEventListener('click', () => {
        adminSidebar.classList.add('-translate-x-full');
        sidebarOverlay.classList.add('hidden');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu);
  } else {
    initMobileMenu();
  }
}
