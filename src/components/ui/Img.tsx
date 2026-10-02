import Image, { type ImageProps } from 'next/image'

/**
 * next/image with sensible defaults for the Unsplash photos in /public/img (3:2, 1600px wide).
 * Size and fit are controlled from CSS, so width/height here only reserve the aspect ratio.
 */
export function Img({
  width = 1600,
  height = 1067,
  sizes = '(max-width: 768px) 100vw, 50vw',
  alt = '',
  ...rest
}: Partial<ImageProps> & { src: string }) {
  return <Image width={width} height={height} sizes={sizes} alt={alt} {...rest} />
}
