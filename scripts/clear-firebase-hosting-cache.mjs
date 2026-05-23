import fs from 'node:fs';
import path from 'node:path';

const firebaseDir = path.resolve('.firebase');
if (!fs.existsSync(firebaseDir)) {
  process.exit(0);
}

let removed = 0;
for (const name of fs.readdirSync(firebaseDir)) {
  if (name.startsWith('hosting.') && name.endsWith('.cache')) {
    fs.unlinkSync(path.join(firebaseDir, name));
    removed++;
  }
}

if (removed > 0) {
  console.log(`Cleared ${removed} Firebase Hosting cache file(s).`);
}
