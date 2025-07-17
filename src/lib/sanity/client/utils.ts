import createImageUrlBuilder from '@sanity/image-url';
import type { CreateDataAttributeProps } from 'next-sanity';
import { createDataAttribute } from 'next-sanity';
import { clientEnv } from '@/env/clientEnv';
import type { SeoFragmentType } from '../queries/fragments/fragment.types';

const imageBuilder = createImageUrlBuilder({
  projectId: clientEnv.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: clientEnv.NEXT_PUBLIC_SANITY_DATASET,
});

export const urlForImage = (source: { asset?: { _ref?: string } }) => {
  if (!source?.asset?._ref) {
    return undefined;
  }

  return imageBuilder?.image(source).auto('format').fit('max');
};

export function resolveOpenGraphImage(
  image?: SeoFragmentType['metaImage'],
  width = 1200,
  height = 627,
) {
  if (!image) return;
  const url = imageBuilder.image(image)?.width(width).height(height).fit('crop').url();
  if (!url) return;
  return { url, width, height };
}

type DataAttributeConfig = CreateDataAttributeProps &
  Required<Pick<CreateDataAttributeProps, 'id' | 'type' | 'path'>>;

export function dataAttr(config: DataAttributeConfig) {
  return createDataAttribute({
    projectId: clientEnv.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: clientEnv.NEXT_PUBLIC_SANITY_DATASET,
    baseUrl: clientEnv.NEXT_PUBLIC_SANITY_STUDIO_URL,
  })
    .combine(config)
    .toString();
}
