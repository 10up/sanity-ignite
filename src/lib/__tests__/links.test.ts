import { expect, test, it, describe } from 'vitest'
import { getDocumentLink } from '../links'

describe('getDocumentLink', () => {
	it('should return the correct link', () => {
		expect(getDocumentLink({ _type: 'page', slug: 'about' })).toBe('/about')
		expect(getDocumentLink({ _type: 'post', slug: 'post-slug' })).toBe('/blog/post-slug')
		expect(getDocumentLink({ _type: 'category', slug: 'category-slug' })).toBe('/category/category-slug')
		expect(getDocumentLink({ _type: 'homePage', slug: 'homepage-slug' })).toBe('/')
	})

	it('should return the correct absolute link', () => {
		expect(getDocumentLink({ _type: 'page', slug: 'about' }, true)).toBe('http://localhost:3000/about')
	})
})