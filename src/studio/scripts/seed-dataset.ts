import { retryPromise } from './helpers';
import { getCliClient } from 'sanity/cli';
import {
  generateAndUploadMockImages,
  generateMockBlogPage,
  generateMockCategories,
  generateMockPeople,
  generateMockSiteSettings,
} from './mock-data';

const client = getCliClient();

async function createData() {
  console.log('🔄 Starting transaction... \n\n\n');
  const transaction = client.transaction();

  // Blog Page
  console.log('📸 Generating blog page... \n\n');
  const blogPage = generateMockBlogPage();
  transaction.createOrReplace(blogPage);
  console.log(`✅ Created/updated blog page data \n\n`);

  // Images
  console.log('📸 Generating mock images... \n\n');
  const imagesStore = await generateAndUploadMockImages(client);
  console.log(`✅ Created ${imagesStore.length} images \n\n`);

  // People
  console.log('👥 Generating mock people... \n\n');
  const personsPayload = generateMockPeople(imagesStore);
  for (const person of personsPayload) {
    transaction.create(person);
  }
  console.log(`✅ Created ${personsPayload.length} persons \n\n`);

  // Categories
  console.log('📑 Generating mock categories... \n\n');
  const categoriesPayload = generateMockCategories();
  for (const category of categoriesPayload) {
    transaction.create(category);
  }
  console.log(`✅ Created ${categoriesPayload.length} categories \n\n`);

  // Site Settings
  console.log('📸 Generating mock site settings... \n\n');
  const siteSettings = generateMockSiteSettings();
  transaction.createOrReplace(siteSettings);
  console.log(`✅ Created/updated site settings data \n\n\n`);

  console.log('💾 Committing transaction... \n\n');
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
