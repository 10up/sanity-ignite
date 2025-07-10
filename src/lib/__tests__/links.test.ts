import { describe, expect, it } from 'vitest';
import { getDocumentLink, getLinkByLinkObject } from '../links';

describe('getDocumentLink', () => {
  it('should return the correct link', () => {
    expect(getDocumentLink({ _type: 'page', slug: 'about' })).toBe('/about');
    expect(getDocumentLink({ _type: 'post', slug: 'post-slug' })).toBe('/blog/post-slug');
    expect(getDocumentLink({ _type: 'category', slug: 'category-slug' })).toBe(
      '/category/category-slug',
    );
    expect(getDocumentLink({ _type: 'homePage', slug: 'homepage-slug' })).toBe('/');
  });

  it('should return the correct absolute link', () => {
    expect(getDocumentLink({ _type: 'page', slug: 'about' }, true)).toBe(
      'http://localhost:3000/about',
    );
  });
});

describe('getLinkByLinkObject', () => {
  it('should return external link', () => {
    expect(
      getLinkByLinkObject({
        type: 'external',
        external: 'https://google.com',
        internal: null,
      }),
    ).toBe('https://google.com');
  });

  it('should return internal link', () => {
    expect(
      getLinkByLinkObject({
        type: 'internal',
        external: null,
        internal: { _id: '1', _type: 'page', slug: 'about' },
      }),
    ).toBe('/about');
  });
});
