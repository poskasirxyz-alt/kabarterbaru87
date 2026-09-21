import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { SEO } from '../../components/common/SEO';

export const SyaratKetentuanPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <SEO
        title="Syarat dan Ketentuan - KABAR TERBARU"
        description="Syarat dan ketentuan penggunaan layanan dan konten portal berita KABAR TERBARU."
        canonicalUrl="https://kabarterbaru.com/syarat-ketentuan"
      />

      <nav className="flex items-center gap-1.5 text-xs text-gray-500 py-1 border-b border-gray-200">
        <Link to="/" className="hover:text-[#0b4f8a]">
          Beranda
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-bold">Syarat & Ketentuan</span>
      </nav>

      <div className="bg-white border border-gray-200 p-6 md:p-10 shadow-2xs">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h1 className="font-serif-headline text-2xl sm:text-3xl font-extrabold text-gray-950">
            Syarat dan Ketentuan Layanan
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Ketentuan penggunaan konten dan hak kekayaan intelektual KABAR TERBARU
          </p>
        </div>

        <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
          <p>
            Dengan mengakses dan membaca materi di <strong>KABAR TERBARU</strong> (<em>https://kabarterbaru.com</em>), Anda dianggap telah menyetujui syarat dan ketentuan berikut:
          </p>

          <section className="space-y-2">
            <h2 className="font-serif-headline text-base font-bold text-gray-900">
              1. Hak Cipta & Pengutipan Materi Berita
            </h2>
            <p className="text-xs text-gray-600">
              Seluruh artikel berita, foto, ilustrasi, tata letak grafis, dan merek dagang KABAR TERBARU dilindungi Undang-Undang Hak Cipta Republik Indonesia. Pengutipan teks berita untuk keperluan non-komersial diperbolehkan maksimal 2-3 alinea dengan syarat <strong>wajib mencantumkan kredit sumber dan tautan aktif (backlink)</strong> langsung ke artikel asli di <em>https://kabarterbaru.com</em>.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif-headline text-base font-bold text-gray-900">
              2. Larangan Duplikasi Total (Scraping)
            </h2>
            <p className="text-xs text-gray-600">
              Dilarang keras menyalin utuh (copy-paste), memperbanyak otomatis (scraping), atau mempublikasikan ulang seluruh konten berita KABAR TERBARU ke situs lain tanpa persetujuan tertulis dari Pemimpin Redaksi KABAR TERBARU.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
