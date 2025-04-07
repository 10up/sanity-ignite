import { getCliClient } from 'sanity/cli';
import { retryPromise } from '../helpers';
import {
  generateAndUploadMockImages,
  generateMockBlogPage,
  generateMockCategories,
  generateMockHomePage,
  generateMockPage,
  generateMockPeople,
  generateMockPosts,
  generateMockSiteSettings,
} from './mock-data';

const client = getCliClient();

async function createData() {
  console.log('🔄 Starting transaction... \n\n\n');
  const transaction = client.transaction();

  // Images
  console.log('📸 Generating mock images... \n');
  const imagesStore = await generateAndUploadMockImages(client);
  console.log(`✅ Created ${imagesStore.length} images \n\n`);

  //Home page
  console.log('🏠 Generating home page... \n');
  const homePage = generateMockHomePage(imagesStore);
  transaction.createOrReplace(homePage);
  console.log(`✅ Created/updated home page data \n\n`);

  // Blog Page
  console.log(' Generating blog page... \n');
  const blogPage = generateMockBlogPage();
  transaction.createOrReplace(blogPage);
  console.log(`✅ Created/updated blog page data \n\n`);

  // People
  console.log('👥 Generating mock people... \n');
  const personsPayload = generateMockPeople(imagesStore);
  for (const person of personsPayload) {
    transaction.create(person);
  }
  console.log(`✅ Created ${personsPayload.length} persons \n\n`);

  // Categories
  console.log('📑 Generating mock categories... \n');
  const categoriesPayload = generateMockCategories();
  for (const category of categoriesPayload) {
    transaction.create(category);
  }
  console.log(`✅ Created ${categoriesPayload.length} categories \n\n`);

  // Posts
  console.log('📝 Generating posts... \n');
  const posts = generateMockPosts({
    imagesStore,
    authors: personsPayload,
    categories: categoriesPayload,
  });

  for (const post of posts) {
    transaction.create(post);
  }
  console.log(`✅ Created ${posts.length} posts \n\n`);

  // Pages
  console.log('📝 Generating pages... \n');
  const page = generateMockPage(imagesStore);
  transaction.createOrReplace(page);

  console.log(`✅ Created/updated page \n\n`);

  // Site Settings
  console.log('📸 Generating mock site settings... \n');
  const siteSettings = generateMockSiteSettings();
  transaction.createOrReplace(siteSettings);
  console.log(`✅ Created/updated site settings data \n\n\n`);

  console.log('💾 Committing transaction... \n');
  await transaction.commit();

  console.log('✨ Successfully committed all content! \n');
}

async function main() {
  await retryPromise(
    async () => {
      await createData();
    },
    {
      onRetry(error, attempt) {
        console.log(`🔄 Retrying transaction attempt ${attempt}:`, error.message);
      },
    },
  );
}

main().catch((error) => {
  console.error('❌ Error creating data:', error);
  process.exit(1);
});
