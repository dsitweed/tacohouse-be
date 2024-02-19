import { seedMungData } from './seedMungData';
import { seedSample } from './seedSample';

async function main() {
  await seedSample();
  await seedMungData();
}

main()
  .then(async () => {
    console.info('Seeding success!');
  })
  .catch(async (error) => {
    console.error(error);
    process.exit(1);
  });
