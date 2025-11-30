import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";

// 🗂️ chemin du zip
const zipPath = path.resolve("./api.zip");

if (!fs.existsSync(zipPath)) {
  console.error("❌ Fichier introuvable :", zipPath);
  process.exit(1);
}

const zip = new AdmZip(zipPath);
const entries = zip.getEntries();

console.log("📦 Contenu du zip :");
entries.forEach((entry) => {
  console.log(entry.entryName);
});
