// Post-deploy smoke test. Usage: node scripts/smoke-test.mjs [baseUrl]
// Also run every six hours by .github/workflows/site-health.yml.
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

for (const p of ["/", "/services", "/empty-legs", "/pricing", "/faq", "/private-jet-charter-dubai", "/request-flight", "/contact", "/about", "/fleet", "/membership", "/jet-card"])
  await check(p, html);

// Legacy-site URLs must redirect (public/_redirects), not land on the app's 404.
async function checkRedirect(path, expected) {
  try {
    const res = await fetch(base + path, { redirect: "manual" });
    const location = res.headers.get("location") || "";
    const target = location.replace(/^https?:\/\/[^/]+/, "") || "(none)";
    const problem =
      res.status !== 301 && res.status !== 308 ? `status ${res.status}, expected 301`
      : target.replace(/\/$/, "") !== expected.replace(/\/$/, "") ? `redirects to ${target}, expected ${expected}` : null;
    console.log(`${problem ? "FAIL" : "ok  "} ${path} -> ${expected}${problem ? " - " + problem : ""}`);
    if (problem) failed++;
  } catch (e) {
    console.log(`FAIL ${path} - ${e.message}`);
    failed++;
  }
}
await checkRedirect("/ww/en", "/");
await checkRedirect("/ww/en/about-us", "/about");
await checkRedirect("/ww/en/contact", "/contact");
await checkRedirect("/ww/en/private-jet/20", "/fleet");
await checkRedirect("/ww/en/anything-else", "/");
await check("/sitemap.xml", xml);
await check("/sitemap-uj.xml", xml);
await check("/robots.txt", (res, body) => (res.status !== 200 ? `status ${res.status}` : !/Sitemap:/.test(body) ? "no Sitemap line" : null));

if (failed) { console.error(`${failed} check(s) failed`); process.exit(1); }
console.log("All smoke checks passed");
