import { exec } from "child_process";
import util from "util";

const execAsync = util.promisify(exec);
let isPushing = false;

console.log("====================================================");
console.log("🚀 GitHub Auto-Push Watcher Aktif!");
console.log("📂 Memantau perubahan file di workspace secara real-time...");
console.log("🔗 Target Remote: https://github.com/bagoes1987/rabhgnokutimur.git (main)");
console.log("====================================================");

async function checkAndPush() {
  if (isPushing) return;
  try {
    const { stdout: status } = await execAsync("git status --porcelain");
    if (!status.trim()) return;

    isPushing = true;
    const changedFiles = status
      .trim()
      .split("\n")
      .map((line) => line.trim())
      .join(", ");

    console.log(`\n[${new Date().toLocaleTimeString("id-ID")}] 🔍 Perubahan terdeteksi: ${changedFiles}`);
    console.log("⏳ Menjalankan git add, commit, dan push otomatis ke GitHub...");

    await execAsync("git add .");
    const msg = `Auto-update: ${new Date().toLocaleString("id-ID")}`;
    await execAsync(`git commit -m "${msg}"`);
    await execAsync("git push origin main");

    console.log(`✅ [${new Date().toLocaleTimeString("id-ID")}] Berhasil di-push otomatis ke GitHub (origin/main)!`);
  } catch (err) {
    // Ignore benign "nothing to commit" messages
    if (err.stdout && err.stdout.includes("nothing to commit")) {
      // no-op
    } else {
      console.error("⚠️ Auto-push warning:", err.message);
    }
  } finally {
    isPushing = false;
  }
}

// Periksa perubahan setiap 6 detik
setInterval(checkAndPush, 6000);
checkAndPush();
