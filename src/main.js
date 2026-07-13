// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');

if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('shadow-md', 'bg-white/90');
      navbar.classList.remove('bg-white/70');
    } else {
      navbar.classList.remove('shadow-md', 'bg-white/90');
      navbar.classList.add('bg-white/70');
    }
  });
}

// Fetch Public Website Settings from Supabase
import { supabase } from './supabase.js';

async function fetchPublicSettings() {
  try {
    const { data, error } = await supabase
      .from('website_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error("Error fetching settings:", error);
      return;
    }

    if (data) {
      // Update DOM if elements exist
      const pubNamaToko = document.getElementById('pub_nama_toko');
      const pubTentangKami = document.getElementById('pub_tentang_kami');
      const pubAlamat = document.getElementById('pub_alamat');
      const pubNomorWa = document.getElementById('pub_nomor_wa');
      
      const pubLogoText = document.getElementById('pub_logo_text');
      const pubLogoIcon = document.getElementById('pub_logo_icon');
      const pubLogoContainer = document.getElementById('pub_logo_container');
      
      const pubBannerTitle = document.getElementById('pub_banner_title');
      const pubBannerSubtitle = document.getElementById('pub_banner_subtitle');
      const pubBannerImage = document.getElementById('pub_banner_image');
      
      const pubKeunggulan = document.getElementById('pub_keunggulan_teks');
      const pubCta = document.getElementById('pub_cta_teks');

      // Populate Footer & General Info
      if (pubNamaToko && data.nama_toko) pubNamaToko.textContent = data.nama_toko;
      if (pubTentangKami && data.tentang_kami) pubTentangKami.textContent = data.tentang_kami;
      if (pubAlamat && data.alamat) pubAlamat.textContent = data.alamat;
      if (pubNomorWa && data.nomor_wa) {
        pubNomorWa.textContent = data.nomor_wa;
      }
      
      if (data.nomor_wa) {
        const cleanWa = data.nomor_wa.replace(/[^0-9]/g, '');
        const waLinks = document.querySelectorAll('.dynamic-wa-link');
        waLinks.forEach(link => {
          let url = `https://wa.me/${cleanWa}`;
          const text = link.getAttribute('data-wa-text');
          if (text) url += `?text=${encodeURIComponent(text)}`;
          link.href = url;
        });
      }
      
      // Populate Logo
      if (pubLogoContainer) {
        if (data.logo_url && data.logo_url.trim() !== '') {
          pubLogoContainer.innerHTML = `<img src="${data.logo_url}" alt="Logo" class="h-10">`;
        } else {
          if (pubLogoText && data.nama_toko) pubLogoText.textContent = data.nama_toko;
        }
      }
      
      // Populate Banner & CTA
      if (pubBannerTitle && data.banner_title) pubBannerTitle.innerHTML = data.banner_title;
      if (pubBannerSubtitle && data.banner_subtitle) pubBannerSubtitle.innerHTML = data.banner_subtitle;
      if (pubBannerImage && data.banner_image_url) pubBannerImage.src = data.banner_image_url;
      
      if (pubKeunggulan && data.keunggulan_teks) pubKeunggulan.textContent = data.keunggulan_teks;
      if (pubCta && data.cta_teks) pubCta.textContent = data.cta_teks;
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

// Selalu coba fetch (jika di halaman publik)
if (!window.location.pathname.includes('/admin/')) {
  fetchPublicSettings();
  fetchPublicServices();
  fetchPublicPricing();
  fetchPublicPromos();
}

async function fetchPublicServices() {
  const container = document.getElementById('pub_layanan_container');
  const unggulanContainer = document.getElementById('pub_layanan_unggulan_container');
  
  if (!container && !unggulanContainer) return;
  
  try {
    const { data, error } = await supabase.from('services').select('*').order('id', { ascending: true });
    if (error) return;
    
    const waNumber = document.getElementById('pub_nomor_wa') ? document.getElementById('pub_nomor_wa').textContent : '6281234567890';
    const waBaseUrl = `https://wa.me/${waNumber.replace(/[^0-9]/g, '')}?text=`;

    if (container) {
      container.innerHTML = '';
      data.forEach(item => {
        container.innerHTML += `
        <div class="bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 hover:shadow-xl hover:shadow-brand-light-blue/10 transition duration-300 group">
          ${item.image_url ? `<img src="${item.image_url}" alt="${item.nama}" class="w-full h-48 object-cover group-hover:scale-105 transition duration-500">` : `
          <div class="p-6 pb-0">
            <div class="w-14 h-14 bg-brand-light-blue/10 text-brand-light-blue rounded-xl flex items-center justify-center mb-2">
              <i class="ph-fill ${item.icon} text-3xl"></i>
            </div>
          </div>
          `}
          <div class="p-6">
            <h3 class="text-2xl font-bold text-brand-blue mb-2">${item.nama}</h3>
            <p class="text-slate-600 mb-6 text-sm">${item.deskripsi}</p>
            <a href="${waBaseUrl}Halo%20REFF%20INK,%20saya%20ingin%20tanya%20layanan%20${encodeURIComponent(item.nama)}" target="_blank" class="w-full bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 transition flex justify-center items-center gap-2">
              <i class="ph-fill ph-whatsapp-logo text-xl"></i> Pesan via WhatsApp
            </a>
          </div>
        </div>`;
      });
    }

    if (unggulanContainer) {
      unggulanContainer.innerHTML = '';
      const unggulanData = data.filter(item => item.is_unggulan);
      unggulanData.forEach(item => {
        unggulanContainer.innerHTML += `
        <div class="bg-white rounded-[2rem_1rem_3rem_1rem] p-8 hover-lift border border-slate-100 shadow-sm transition-all duration-300 hover:border-brand-light-blue/30 hover:shadow-brand-light-blue/5 group relative overflow-hidden">
          <div class="absolute top-0 right-0 w-32 h-32 bg-brand-light-blue/5 rounded-bl-[4rem] -z-10 group-hover:scale-125 group-hover:-translate-x-2 group-hover:translate-y-2 transition-transform duration-500"></div>
          <div class="w-14 h-14 bg-gradient-to-br from-brand-blue to-blue-800 text-white rounded-[1rem_0.5rem_1rem_0.5rem] flex items-center justify-center mb-6 shadow-lg shadow-brand-blue/20 group-hover:from-brand-light-blue group-hover:to-brand-cyan group-hover:rotate-6 transition-all duration-300">
            <i class="ph-fill ${item.icon} text-2xl"></i>
          </div>
          <h4 class="text-xl font-bold text-brand-blue mb-3">${item.nama}</h4>
          <p class="text-slate-600 mb-6">${item.deskripsi}</p>
          <a href="${waBaseUrl}Halo%20REFF%20INK,%20saya%20ingin%20tanya%20layanan%20${encodeURIComponent(item.nama)}" target="_blank" class="text-brand-light-blue font-semibold flex items-center gap-2 hover:text-brand-cyan transition">
            Pesan via WhatsApp <i class="ph-bold ph-arrow-right group-hover:translate-x-1 transition-transform"></i>
          </a>
        </div>`;
      });
    }
  } catch (err) {
    console.error(err);
  }
}

async function fetchPublicPricing() {
  const tintaCont = document.getElementById('pub_harga_tinta_container');
  const serviceCont = document.getElementById('pub_harga_service_container');
  const sparepartCont = document.getElementById('pub_harga_sparepart_container');
  
  if (!tintaCont && !serviceCont && !sparepartCont) return;

  try {
    const { data, error } = await supabase.from('pricing').select('*').order('id', { ascending: true });
    if (error) return;
    
    if (tintaCont) tintaCont.innerHTML = '';
    if (serviceCont) serviceCont.innerHTML = '';
    if (sparepartCont) sparepartCont.innerHTML = '';

    data.forEach(item => {
      if (item.kategori === 'tinta' && tintaCont) {
        tintaCont.innerHTML += `
          <tr class="hover:bg-slate-50 transition">
            <td class="py-4 px-6">${item.nama}</td>
            <td class="py-4 px-6">${item.keterangan}</td>
            <td class="py-4 px-6 text-right font-semibold text-brand-blue">${item.harga}</td>
          </tr>
        `;
      } else if (item.kategori === 'jasa' && serviceCont) {
        const isFree = item.harga.toLowerCase().includes('gratis');
        const colorClass = isFree ? 'text-green-600' : 'text-brand-blue';
        serviceCont.innerHTML += `
          <tr class="hover:bg-slate-50 transition">
            <td class="py-4 px-6">${item.nama}</td>
            <td class="py-4 px-6">${item.keterangan}</td>
            <td class="py-4 px-6 text-right font-semibold ${colorClass}">${item.harga}</td>
          </tr>
        `;
      } else if (item.kategori === 'sparepart' && sparepartCont) {
        sparepartCont.innerHTML += `
          <div class="bg-white p-6 rounded-2xl border border-slate-200 text-center hover:border-brand-light-blue transition">
            <h4 class="font-bold text-brand-blue mb-1">${item.nama}</h4>
            <p class="text-slate-500 text-sm mb-3">${item.keterangan}</p>
            <p class="text-xl font-bold text-slate-800">${item.harga}</p>
          </div>
        `;
      }
    });
  } catch (err) {
    console.error(err);
  }
}

async function fetchPublicPromos() {
  const container = document.getElementById('pub_promo_container');
  if (!container) return;
  
  try {
    const { data, error } = await supabase.from('promos').select('*').order('id', { ascending: false });
    if (error) return;
    
    const waNumber = document.getElementById('pub_nomor_wa') ? document.getElementById('pub_nomor_wa').textContent : '6281234567890';
    const waBaseUrl = `https://wa.me/${waNumber.replace(/[^0-9]/g, '')}?text=`;

    container.innerHTML = '';
    
    const bgColors = ['from-blue-50', 'from-green-50', 'from-purple-50', 'from-orange-50'];
    const textColors = ['text-brand-blue', 'text-green-600', 'text-purple-600', 'text-orange-600'];
    const btnColors = ['bg-brand-blue hover:bg-slate-800', 'bg-green-600 hover:bg-green-700', 'bg-purple-600 hover:bg-purple-700', 'bg-orange-500 hover:bg-orange-600'];
    const badgeColors = ['bg-red-500', 'bg-green-500', 'bg-brand-blue', 'bg-orange-500'];

    data.forEach((item, idx) => {
      const colorIdx = idx % bgColors.length;
      const hargaCoret = item.harga_awal ? `<span class="text-sm text-slate-400 line-through">${item.harga_awal}</span>` : '';
      
      container.innerHTML += `
        <div class="bg-gradient-to-br ${bgColors[colorIdx]} to-white rounded-3xl p-8 border border-slate-100 flex flex-col justify-between hover:shadow-xl transition relative overflow-hidden group">
          <div class="absolute top-0 right-0 ${badgeColors[colorIdx]} text-white px-4 py-1 rounded-bl-xl font-bold text-sm">${item.badge}</div>
          <div>
            <h3 class="text-2xl font-bold text-brand-blue mb-2">${item.judul}</h3>
            <p class="text-slate-600 mb-6">${item.deskripsi}</p>
            <div class="flex items-end gap-3 mb-6">
              ${hargaCoret}
              <span class="text-3xl font-bold ${textColors[colorIdx]}">${item.harga_promo}</span>
            </div>
          </div>
          <a href="${waBaseUrl}Halo%20REFF%20INK,%20saya%20mau%20klaim%20promo%20${encodeURIComponent(item.judul)}" target="_blank" class="w-full ${btnColors[colorIdx]} text-white py-3 rounded-xl font-medium transition text-center">Klaim Promo</a>
        </div>
      `;
    });
  } catch (err) {
    console.error(err);
  }
}

// ==========================================
// NEW FEATURE FETCHES (Galeri, FAQ, Testimoni)
// ==========================================

async function fetchPublicGallery() {
  const grid = document.getElementById('pub_gallery_grid');
  const loading = document.getElementById('pub_gallery_loading');
  const empty = document.getElementById('pub_gallery_empty');
  
  if (!grid) return;
  
  try {
    const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    if (loading) loading.remove();
    
    if (error || !data || data.length === 0) {
      if (empty) empty.classList.remove('hidden');
      return;
    }
    
    grid.innerHTML = '';
    data.forEach(item => {
      grid.innerHTML += `
        <div class="rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition group relative bg-slate-100 aspect-[4/3]">
          <img src="${item.image_url}" alt="${item.caption || 'Galeri REFF INK'}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-6">
            <span class="inline-block bg-brand-blue text-white text-xs font-bold px-2 py-1 rounded w-max mb-2">${item.category}</span>
            <p class="text-white font-medium">${item.caption || ''}</p>
          </div>
        </div>
      `;
    });
  } catch (err) {
    console.error("Gallery fetch error:", err);
  }
}

async function fetchPublicFAQ() {
  const container = document.getElementById('pub_faq_container');
  const loading = document.getElementById('pub_faq_loading');
  const empty = document.getElementById('pub_faq_empty');
  
  if (!container) return;
  
  try {
    const { data, error } = await supabase.from('faqs').select('*').order('created_at', { ascending: false });
    if (loading) loading.remove();
    
    if (error || !data || data.length === 0) {
      if (empty) empty.classList.remove('hidden');
      return;
    }
    
    container.innerHTML = '';
    container.classList.remove('hidden');
    
    data.forEach((item, index) => {
      container.innerHTML += `
        <details class="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm" ${index === 0 ? 'open' : ''}>
          <summary class="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-slate-800 hover:text-brand-blue transition">
            <span class="text-lg">${item.question}</span>
            <span class="transition group-open:rotate-180">
              <i class="ph-bold ph-caret-down text-xl"></i>
            </span>
          </summary>
          <div class="text-slate-600 p-6 pt-0 leading-relaxed border-t border-slate-100">
            ${item.answer}
          </div>
        </details>
      `;
    });
  } catch (err) {
    console.error("FAQ fetch error:", err);
  }
}

async function fetchPublicTestimonials() {
  const grid = document.getElementById('pub_testimonial_grid');
  const loading = document.getElementById('pub_testimonial_loading');
  const empty = document.getElementById('pub_testimonial_empty');
  
  if (!grid) return;
  
  try {
    const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    if (loading) loading.remove();
    
    if (error || !data || data.length === 0) {
      if (empty) empty.classList.remove('hidden');
      return;
    }
    
    grid.innerHTML = '';
    grid.classList.remove('hidden');
    
    data.forEach(item => {
      // Generate stars
      let starsHtml = '';
      for (let i = 1; i <= 5; i++) {
        starsHtml += `<i class="ph-fill ph-star ${i <= item.rating ? 'text-yellow-400' : 'text-slate-200'}"></i>`;
      }
      
      grid.innerHTML += `
        <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition flex flex-col justify-between">
          <div>
            <div class="flex gap-1 mb-4 text-lg">
              ${starsHtml}
            </div>
            <p class="text-slate-600 italic mb-6">"${item.review}"</p>
          </div>
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-brand-blue font-bold text-xl">
              ${item.customer_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 class="font-bold text-slate-800">${item.customer_name}</h4>
              <p class="text-sm text-slate-500">Pelanggan REFF INK</p>
            </div>
          </div>
        </div>
      `;
    });
  } catch (err) {
    console.error("Testimonial fetch error:", err);
  }
}

// Special fetch for profile page text
async function fetchProfileData() {
  const content = document.getElementById('pub_profile_content');
  const loading = document.getElementById('pub_profile_loading');
  if (!content) return;
  
  try {
    const { data, error } = await supabase.from('website_settings').select('tentang_kami').eq('id', 1).maybeSingle();
    if (loading) loading.remove();
    
    if (data && data.tentang_kami) {
      content.classList.remove('hidden');
      // Simple split by newline to create paragraphs
      const paragraphs = data.tentang_kami.split('\n').filter(p => p.trim() !== '');
      content.innerHTML = paragraphs.map(p => `<p class="mb-4">${p}</p>`).join('');
    }
  } catch (err) {
    console.error(err);
  }
}

// Panggil fungsi sesuai kebutuhan halaman
document.addEventListener('DOMContentLoaded', () => {
  fetchPublicSettings();
  fetchPublicServices();
  fetchPublicPromos();
  
  // New features
  fetchPublicGallery();
  fetchPublicFAQ();
  fetchPublicTestimonials();
  fetchProfileData();
});
