import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

const read = (p: string) => readFileSync(p, "utf8");

// A client who receives a quote link has no account, so the page must read
// and answer the quote through its link token, never through the table.
describe("quote links work for clients without an account", () => {
  const page = read("src/pages/QuoteViewPage.tsx");
  const crm = read("src/pages/crm/QuoteDetailPage.tsx");
  const sql = read("supabase/migrations/20261107060000_quote_public_tokens.sql");

  it("the client page reads and answers through the token functions", () => {
    expect(page).toContain('supabase.rpc("get_quote_by_token", { p_token: token })');
    expect(page).toContain('supabase.rpc("respond_to_quote", { p_token: token, p_decision: decision })');
    // staff without a token still get the row-level-secured read
    expect(page).toContain('.from("quotes")');
  });

  it("the CRM copies a link that carries the token", () => {
    expect(crm).toContain("/quote/${quoteId}?token=${quote.public_token}");
  });

  it("the database functions are definer-rights, token-gated and give clients only what they need", () => {
    for (const fn of ["get_quote_by_token", "respond_to_quote"]) {
      expect(sql).toMatch(new RegExp(`CREATE OR REPLACE FUNCTION public\\.${fn}\\(`));
      expect(sql).toMatch(new RegExp(`GRANT EXECUTE ON FUNCTION public\\.${fn}\\([^)]*\\) TO anon, authenticated`));
    }
    expect(sql.match(/SECURITY DEFINER/g)?.length).toBe(2);
    expect(sql).toContain("length(p_token) >= 32");
    expect(sql).not.toMatch(/'operator'/);
    expect(sql).toContain("IF v_quote.status IN ('accepted', 'rejected') THEN");
  });

  it("every quote gets a random token by default", () => {
    expect(sql).toMatch(/public_token text NOT NULL DEFAULT encode\(extensions\.gen_random_bytes\(24\), 'hex'\)/);
    expect(sql).toContain("CREATE UNIQUE INDEX IF NOT EXISTS quotes_public_token_idx");
  });
});
