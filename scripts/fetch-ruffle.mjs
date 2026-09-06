/**
 * Descarga Ruffle (reproductor Flash autoalojado) y lo copia a assets/ruffle/.
 * Uso: node scripts/fetch-ruffle.mjs [versión]
 * La versión se fija para reproducibilidad; sin argumento usa RUFFLE_VERSION.
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import os from "node:os";

const root = path.resolve(import.meta.dirname, "..");
const RUFFLE_VERSION = process.argv[2] || "0.5.0";
const destDir = path.join(root, "assets", "ruffle");
const pkg = "@ruffle-rs/ruffle";
const tarballUrl = `https://registry.npmjs.org/${pkg}/-/${pkg.split("/").pop()}-${RUFFLE_VERSION}.tgz`;

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "ruffle-"));
const tgz = path.join(tmp, "ruffle.tgz");

console.log(`Descargando ${pkg}@${RUFFLE_VERSION}…`);
const res = await fetch(tarballUrl);
if (!res.ok) {
  console.error(`Error descargando ${tarballUrl}: HTTP ${res.status}`);
  process.exit(1);
}
fs.writeFileSync(tgz, Buffer.from(await res.arrayBuffer()));

execSync(`tar xzf "${tgz}" -C "${tmp}"`, { stdio: "inherit" });
const srcDir = path.join(tmp, "package");

fs.rmSync(destDir, { recursive: true, force: true });
fs.mkdirSync(destDir, { recursive: true });

for (const file of fs.readdirSync(srcDir)) {
  fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
}
fs.writeFileSync(path.join(destDir, "VERSION"), `${RUFFLE_VERSION}\n`);

fs.rmSync(tmp, { recursive: true, force: true });
console.log(`Ruffle ${RUFFLE_VERSION} instalado en assets/ruffle/ (${fs.readdirSync(destDir).length} ficheros).`);
