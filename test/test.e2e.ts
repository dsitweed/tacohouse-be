import * as path from 'path';
import * as fg from 'fast-glob';

const specs = fg.sync(
  path.join(__dirname, '/modules/**/*.spec.ts').replace(/\\/g, '/'),
);

specs.forEach((file) => {
  require(file);
});
