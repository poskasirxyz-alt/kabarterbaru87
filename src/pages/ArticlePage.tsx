import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import {
  Clock,
  User,
  Share2,
  Calendar,
  Tag,
  ExternalLink,
  ChevronRight,
  Bookmark,
  Check,
  AlertTriangle,
  ArrowLeft,
} from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { ArticleCard, formatDateIndonesian } from '../components/common/ArticleCard';
import { AdSlot } from '../components/ads/AdSlot';
import { getArticleBySlug, getPublishedArticles } from '../services/db';
import type { Article } from '../types';

export const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    if (slug) {
      getArticleBySlug(slug).then((art) => {
        if (!mounted) return;
        setArticle(art);
        setLoading(false);

        if (art) {
          getPublishedArticles().then((all) => {
            if (!mounted) return;
            // Related: same category, different id
            const related = all
              .filter((a) => a.categoryId === art.categoryId && a.id !== art.id)
              .slice(0, 4);
            setRelatedArticles(related);

            // Latest:
            const latest = all.filter((a) => a.id !== art.id).slice(0, 5);
            setLatestArticles(latest);
          });
        }
      });
    }

    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-[#0b4f8a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500 font-medium">Memuat artikel berita...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="py-20 text-center max-w-lg mx-auto">
        <h1 className="text-2xl font-bold font-serif-headline text-gray-900 mb-3">
          Berita Tidak Ditemukan
        </h1>
        <p className="text-gray-600 text-sm mb-6">
          Artikel yang Anda cari mungkin telah dipindahkan, diperbarui slug tautannya, atau telah dihapus oleh redaksi.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-[#0b4f8a] text-white px-5 py-2 text-sm font-semibold hover:bg-[#083b68]"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const categorySlug = article.categoryName
    ? article.categoryName.toLowerCase().replace(/\s+/g, '-')
    : 'nasional';

  const canonical = article.canonicalUrl || `https://kabarterbaru.com/berita/${article.slug}`;

  // Sanitize content with DOMPurify
  const sanitizedContent = DOMPurify.sanitize(article.content);

  // Social share handlers
  const handleCopyLink = () => {
    navigator.clipboard.writeText(canonical);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const shareWhatsApp = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${article.title} - Baca di KABAR TERBARU: ${canonical}`
  )}`;

  const shareTwitter = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    article.title
  )}&url=${encodeURIComponent(canonical)}&via=kabarterbaru`;

  const shareFacebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    canonical
  )}`;

  // JSON-LD NewsArticle
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonical,
    },
    headline: article.title,
    description: article.excerpt || article.seoDescription,
    image: [article.featuredImage],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: {
      '@type': 'Person',
      name: article.authorName,
      url: `https://kabarterbaru.com/penulis/${article.authorSlug}`,
    },
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: 'KABAR TERBARU',
      url: 'https://kabarterbaru.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://cdn.phototourl.com/member/2026-09-21-3236fde4-dbca-4b4a-af6e-c924737f9ffa.png',
      },
    },
  };

  return (
    <div className="space-y-6">
      <SEO
        title={article.seoTitle || article.title}
        description={article.seoDescription || article.excerpt}
        canonicalUrl={canonical}
        imageUrl={article.featuredImage}
        type="article"
        publishedTime={article.publishedAt}
        modifiedTime={article.updatedAt}
        authorName={article.authorName}
        categoryName={article.categoryName}
        jsonLd={jsonLd}
      />

      {/* AD SLOT: ARTICLE TOP */}
      <AdSlot placement="article-top" pageTarget="article" categoryId={article.categoryId} />

      {/* BREADCRUMB */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 py-1 border-b border-gray-200">
        <Link to="/" className="hover:text-[#0b4f8a]">
          Beranda
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link to={`/kategori/${categorySlug}`} className="hover:text-[#0b4f8a] font-medium">
          {article.categoryName}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-800 truncate max-w-xs sm:max-w-md">
          {article.title}
        </span>
      </nav>

      {/* MAIN LAYOUT: ARTICLE BODY (8 cols) vs SIDEBAR (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ARTICLE COLUMN */}
        <article className="lg:col-span-8 bg-white border border-gray-200 p-4 sm:p-6 md:p-8 shadow-2xs">
          
          {/* CATEGORY & TITLE */}
          <div className="mb-4">
            <Link
              to={`/kategori/${categorySlug}`}
              className="inline-block bg-[#0b4f8a] text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 mb-3 hover:bg-[#083b68]"
            >
              {article.categoryName}
            </Link>
            <h1 className="font-serif-headline text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-950 leading-tight">
              {article.title}
            </h1>
          </div>

          {/* EXCERPT / LEAD PARAGRAPH */}
          {article.excerpt && (
            <div className="border-l-4 border-[#0b4f8a] pl-4 py-1 text-base sm:text-lg text-gray-700 font-medium leading-relaxed mb-6 bg-slate-50">
              {article.excerpt}
            </div>
          )}

          {/* AUTHOR & METADATA BAR */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-gray-200 mb-6 text-xs text-gray-600">
            {/* Author info */}
            <div className="flex items-center gap-3">
              <Link to={`/penulis/${article.authorSlug}`} className="shrink-0">
                <img
                  src={article.authorImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'}
                  alt={article.authorName}
                  className="w-10 h-10 rounded-full object-cover border border-gray-300"
                />
              </Link>
              <div>
                <p className="text-[11px] text-gray-400 uppercase font-semibold">Ditulis oleh</p>
                <Link
                  to={`/penulis/${article.authorSlug}`}
                  className="font-bold text-gray-900 hover:text-[#0b4f8a] text-sm"
                >
                  {article.authorName}
                </Link>
              </div>
            </div>

            {/* Date and reading time */}
            <div className="flex items-center gap-4 text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#0b4f8a]" />
                <span>{formatDateIndonesian(article.publishedAt)}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#0b4f8a]" />
                <span>{article.readingTime || 3} min baca</span>
              </div>
            </div>
          </div>

          {/* SHARE STRIP */}
          <div className="flex items-center justify-between gap-2 pb-4 mb-6 border-b border-gray-100 text-xs">
            <span className="font-semibold text-gray-600 flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-[#0b4f8a]" />
              Bagikan:
            </span>
            <div className="flex items-center gap-2">
              <a
                href={shareWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white px-3 py-1 font-semibold rounded-xs hover:opacity-90 flex items-center gap-1"
                aria-label="Bagikan ke WhatsApp"
              >
                WhatsApp
              </a>
              <a
                href={shareTwitter}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-white px-3 py-1 font-semibold rounded-xs hover:opacity-90 flex items-center gap-1"
                aria-label="Bagikan ke X"
              >
                X
              </a>
              <a
                href={shareFacebook}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1877F2] text-white px-3 py-1 font-semibold rounded-xs hover:opacity-90 flex items-center gap-1"
                aria-label="Bagikan ke Facebook"
              >
                Facebook
              </a>
              <button
                type="button"
                onClick={handleCopyLink}
                className="border border-gray-300 text-gray-700 px-2.5 py-1 font-medium hover:bg-gray-100 flex items-center gap-1 rounded-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-600" />
                    Tersalin
                  </>
                ) : (
                  'Salin Tautan'
                )}
              </button>
            </div>
          </div>

          {/* FEATURED IMAGE WITH CAPTION */}
          <figure className="mb-8">
            <img
              src={article.featuredImage}
              alt={article.featuredImageAlt || article.title}
              className="w-full h-auto max-h-[500px] object-cover bg-gray-100 border border-gray-200"
              loading="eager"
            />
            {article.captionImage ? (
              <figcaption className="text-xs text-gray-500 italic mt-2 text-center bg-gray-50 py-1.5 px-3 border-x border-b border-gray-200">
                {article.captionImage}
              </figcaption>
            ) : (
              <figcaption className="text-[11px] text-gray-400 italic mt-1 text-right">
                Dokumentasi / Foto: KABAR TERBARU
              </figcaption>
            )}
          </figure>

          {/* ARTICLE CONTENT (RICH TEXT) */}
          <div
            className="article-body"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />

          {/* AD SLOT: ARTICLE MIDDLE */}
          <AdSlot placement="article-middle" pageTarget="article" categoryId={article.categoryId} />

          {/* SOURCE & ATTRIBUTION SECTION (per section 53) */}
          {(article.sourceName || article.sourceUrl || article.sourceNote) && (
            <div className="my-8 p-4 bg-gray-50 border-l-4 border-gray-400 text-xs text-gray-700">
              <p className="font-bold text-gray-900 mb-1 flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 text-[#0b4f8a]" />
                Atribusi Sumber & Transparansi Informasi:
              </p>
              {article.sourceName && (
                <p>
                  <strong>Sumber:</strong> {article.sourceName}
                </p>
              )}
              {article.sourceUrl && (
                <p>
                  <strong>Tautan Referensi:</strong>{' '}
                  <a
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0b4f8a] hover:underline break-all inline-flex items-center gap-1"
                  >
                    {article.sourceUrl} <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              )}
              {article.sourceNote && (
                <p className="mt-1 text-gray-600 italic">
                  <strong>Catatan Verifikasi:</strong> {article.sourceNote}
                </p>
              )}
            </div>
          )}

          {/* TAGS LIST */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-gray-200 my-6">
              <span className="text-xs font-bold text-gray-500 flex items-center gap-1 mr-1">
                <Tag className="w-3.5 h-3.5" />
                Tag Terkait:
              </span>
              {article.tags.map((tag, idx) => (
                <Link
                  key={idx}
                  to={`/search?q=${encodeURIComponent(tag)}`}
                  className="bg-gray-100 hover:bg-[#0b4f8a] hover:text-white text-gray-700 text-xs px-2.5 py-1 transition-colors border border-gray-200"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* AUTHOR BIO CARD */}
          <div className="p-4 sm:p-5 bg-[#f8fafc] border border-gray-200 my-8">
            <div className="flex items-start gap-4">
              <Link to={`/penulis/${article.authorSlug}`} className="shrink-0">
                <img
                  src={article.authorImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'}
                  alt={article.authorName}
                  className="w-16 h-16 rounded-xs object-cover border border-gray-300"
                />
              </Link>
              <div>
                <p className="text-[11px] font-bold text-[#0b4f8a] uppercase tracking-wider">
                  Tentang Penulis
                </p>
                <Link
                  to={`/penulis/${article.authorSlug}`}
                  className="font-serif-headline text-lg font-bold text-gray-900 hover:text-[#0b4f8a]"
                >
                  {article.authorName}
                </Link>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Jurnalis KABAR TERBARU yang memegang teguh integritas, prinsip verifikasi independen, dan Kode Etik Jurnalistik dalam setiap karya liputan.
                </p>
                <Link
                  to={`/penulis/${article.authorSlug}`}
                  className="inline-block text-xs font-semibold text-[#0b4f8a] hover:underline mt-2"
                >
                  Lihat Semua Berita Karya Penulis Ini &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* HAK JAWAB & KOREKSI NOTICE */}
          <div className="bg-amber-50/70 border border-amber-200 p-4 text-xs text-amber-900 flex items-start gap-3 my-6">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-1">Pedoman Hak Jawab & Klarifikasi Redaksi</p>
              <p className="leading-relaxed">
                KABAR TERBARU melayani permohonan hak jawab, klarifikasi, maupun pengaduan koreksi terhadap materi pemberitaan ini sesuai dengan UU Pers No. 40/1999 dan Pedoman Media Siber. Sampaikan laporan melalui email resmi redaksi:{' '}
                <a href="mailto:kabarterbaru.id@gmail.com" className="font-bold underline">
                  kabarterbaru.id@gmail.com
                </a>
                .
              </p>
            </div>
          </div>

          {/* AD SLOT: ARTICLE BOTTOM */}
          <AdSlot placement="article-bottom" pageTarget="article" categoryId={article.categoryId} />

          {/* RELATED ARTICLES */}
          {relatedArticles.length > 0 && (
            <div className="mt-10 pt-8 border-t-2 border-[#0b4f8a]">
              <h3 className="font-serif-headline text-xl font-bold text-gray-900 mb-4">
                Berita Terkait di Kanal {article.categoryName}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedArticles.map((rel) => (
                  <ArticleCard key={rel.id} article={rel} variant="secondary" />
                ))}
              </div>
            </div>
          )}

        </article>

        {/* SIDEBAR */}
        <aside className="lg:col-span-4 space-y-6">
          
          {/* SIDEBAR AD */}
          <AdSlot placement="sidebar" pageTarget="article" categoryId={article.categoryId} />

          {/* BERITA TERBARU DI SIDEBAR */}
          <div className="bg-white border border-gray-200 p-4">
            <div className="border-b-2 border-[#0b4f8a] pb-2 mb-3">
              <h3 className="font-serif-headline text-base font-bold text-gray-900">
                Berita Terkini Lainnya
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {latestArticles.map((lat) => (
                <ArticleCard key={lat.id} article={lat} variant="compact" />
              ))}
            </div>
          </div>

          {/* INFO REDAKSI SIDEBAR WIDGET */}
          <div className="bg-white border border-gray-200 p-4 text-xs text-gray-600">
            <h4 className="font-bold text-gray-900 text-sm mb-2 font-serif-headline">
              KABAR TERBARU
            </h4>
            <p className="leading-relaxed mb-3">
              Portal berita independen menyajikan kabar terpercaya untuk rakyat Indonesia.
            </p>
            <div className="space-y-1 text-[11px] text-gray-500 border-t border-gray-100 pt-2">
              <p>Email: kabarterbaru.id@gmail.com</p>
              <p>WhatsApp: 082379474173</p>
              <p>Alamat: Lamarantarung, Kab. Indramayu, Jawa Barat</p>
            </div>
          </div>

        </aside>

      </div>
    </div>
  );
};
