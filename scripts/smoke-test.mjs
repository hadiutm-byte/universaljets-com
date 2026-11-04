// Post-deploy smoke test. Usage: node scripts/smoke-test.mjs [baseUrl]
// Read-only: only issues GET requests. Exits non-zero on any failure.
const base = (process.argv[2] || "https://universaljets.com").replace(/\/$/, "");
let failed = 0;

async function check(path, test) {
  try {
    const res = await fetch(base + path, { redirect: "follow" });
    const body = await res.text();
    const problem = test(res, body);
    console.log(`${problem ? "FAIL" : "ok  "} ${path}${problem ? " - " + problem : ""}`);
    if (problem) failed++;
  } catch (e) {
    console.log(`FAIL ${path} - ${e.message}`);
    failed++;
  }
}

const html = (res, body) =>
  res.status !== 200 ? `status ${res.status}` : !/<div id="root"/.test(body) ? "not the app shell" : null;
const xml = (res, body) =>
  res.status !== 200 ? `status ${res.status}`
  : !/xml/.test(res.headers.get("content-type") || "") ? `content-type ${res.headers.get("content-type")}`
  : !body.includes("<urlset") ? "not a sitemap" : null;

for (const p of ["/", "/services", "/empty-legs", "/pricing", "/faq", "/private-jet-charter-dubai", "/request-flight", "/contact"])
  await check(p, html);
await check("/sitemap.xml", xml);
await check("/sitemap-uj.xml", xml);
await check("/robots.txt", (res, body) => (res.status !== 200 ? `status ${res.status}` : !/Sitemap:/.test(body) ? "no Sitemap line" : null));

if (failed) { console.error(`${failed} check(s) failed`); process.exit(1); }
console.log("All smoke checks passed");
