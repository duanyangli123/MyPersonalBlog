import Image from 'next/image';

type MDXComponents = {
  [key: string]: React.ComponentType<any>;
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    img: (props: any) => {
      const { src, alt, ...rest } = props;
      if (!src || typeof src !== 'string') return null;

      return (
        <span className="block my-6 not-prose">
          <Image
            src={src}
            alt={alt || ''}
            width={800}
            height={500}
            className="rounded-lg w-full h-auto cursor-zoom-in"
            sizes="(max-width: 768px) 100vw, 700px"
            loading="lazy"
          />
          {alt && (
            <span className="block text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
              {alt}
            </span>
          )}
        </span>
      );
    },
  };
}
