import type { APIRoute, GetStaticPaths } from 'astro';
import { getImages } from '../../../social/images';

/** Link preview images (see src/social/images.ts): /images/og/<page>.<hash>.jpg */
export const getStaticPaths = (async () => {
  const images = await getImages();
  return [...images.values()].map(({ file, data }) => ({
    params: { image: file.replace(/\.jpg$/, '') },
    props: { data },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) =>
  new Response(new Uint8Array(props.data), { headers: { 'Content-Type': 'image/jpeg' } });
