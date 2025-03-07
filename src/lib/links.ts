type SupportedDocumentTypes = 'page' | 'post' | 'homePage';

export const getDocumentLink = ({ _type, slug }: { _type: SupportedDocumentTypes, slug: string | null }) => {
	switch (_type) {
		case 'page':
			return `/${slug}`;
		case 'post':
			return `/blog/${slug}`;
		case 'homePage':
			return '/';
		default:
			return '/';
	}
}