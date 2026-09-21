import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { SEO } from '../../components/common/SEO';

export const KebijakanPrivasiPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <SEO
        title="Kebijakan Privasi - KABAR TERBARU"
        description="Kebijakan Privasi portal berita KABAR TERBARU terkait perlindungan data pengguna, cookie, dan kerahasiaan pembaca."
        canonicalUrl="https://kabarterbaru.com/kebijakan-privasi"
      />

      <nav className="flex items-center gap-1.5 text-xs text-gray-500 py-1 border-b border-gray-200">
        <Link to="/" className="hover:text-[#0b4f8a]">
          Beranda
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-bold">Kebijakan Privasi</span>
      </nav>

      <div className="bg-white border border-gray-200 p-6 md:p-10 shadow-2xs">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h1 className="font-serif-headline text-2xl sm:text-3xl font-extrabold text-gray-950">
            Kebijakan Privasi (Privacy Policy)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Terakhir Diperbarui: 21 September 2026
          </p>
        </div>

        <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
          <p>
            Privasi pengunjung <strong>KABAR TERBARU</strong> (<em>https://kabarterbaru.com</em>) merupakan hal yang sangat penting bagi kami. Dokumen kebijakan privasi ini menguraikan jenis informasi pribadi yang diterima dan dikumpulkan serta bagaimana informasi tersebut dipergunakan.
          </p>

          <section className="space-y-2">
            <h2 className="font-serif-headline text-base font-bold text-gray-900">
              1. Berkas Log (Log Files)
            </h2>
            <p className="text-xs text-gray-600">
              Seperti kebanyakan situs media lainnya, KABAR TERBARU menggunakan berkas log. Informasi dalam berkas log meliputi alamat protokol internet (IP address), jenis peramban (browser), penyedia layanan internet (ISP), stempel tanggal/waktu, dan halaman perujuk/keluar semata-mata untuk menganalisis tren dan mengelola situs secara anonim.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif-headline text-base font-bold text-gray-900">
              2. Cookie dan Web Beacon
            </h2>
            <p className="text-xs text-gray-600">
              KABAR TERBARU dapat menggunakan cookie untuk menyimpan preferensi pengunjung dan mengoptimalkan pengalaman membaca berdasarkan jenis peramban pengguna. Mitra pihak ketiga seperti analitik web atau penyedia periklanan mungkin juga menggunakan cookie pihak ketiga sesuai kebijakan masing-masing.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif-headline text-base font-bold text-gray-900">
              3. Perlindungan Informasi Pribadi
            </h2>
            <p className="text-xs text-gray-600">
              Kami tidak akan pernah menjual, menyewakan, atau membagikan alamat email atau informasi kontak yang Anda kirimkan melalui formulir kontak kami kepada pihak ketiga mana pun tanpa persetujuan tertulis dari Anda.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
