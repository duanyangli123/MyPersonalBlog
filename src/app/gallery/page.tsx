import Image from 'next/image';
import Link from 'next/link';
import { getPosts } from '@/lib/posts';

export const metadata = { title: '相册 | 旅游博客' };

export default async function GalleryPage() {
  const posts = await getPosts();
  const images = posts
    .filter((p) => p.coverImage)
    .map((p) => ({ src: p.coverImage!, title: p.title, slug: p.slug, category: p.category }));

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">相册</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">旅途中的风景瞬间</p>

      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {images.map((img, i) => (
          <Link
            key={i}
            href={`/posts/${img.slug}`}
            className="group block break-inside-avoid overflow-hidden rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300"
          >
            <div className="relative overflow-hidden">
              <Image
                src={img.src}
                alt={img.title}
                width={400}
                height={300}
                className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-sm font-medium text-white line-clamp-1">{img.title}</h3>
                <span className="text-xs text-white/70">{img.category}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
