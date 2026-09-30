import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";
const directory = fileURLToPath(
  new URL("../public/images/local/", import.meta.url),
);
for (const name of [
  "st-catharines-city-hall",
  "welland-city-hall",
  "thorold-canal",
]) {
  for (const width of [480, 800]) {
    const output = path.join(directory, `${name}-${width}.webp`);
    await sharp(path.join(directory, `${name}.webp`))
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(output);
    console.log(`Prepared ${name} at ${width}px`);
  }
}
