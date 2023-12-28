import { seedMungData } from './seed/seedMungData';
import { seedSample } from './seed/seedSample';

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
