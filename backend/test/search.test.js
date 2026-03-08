const test = require("node:test");
const assert = require("node:assert/strict");
const {
  escapeRegex,
  buildSearchRegex,
  normalizeSearchQuery,
} = require("../utils/search");

test("escapeRegex regex operatorlerini kacislar", () => {
  assert.equal(escapeRegex("su+yali(tim)"), "su\\+yali\\(tim\\)");
});

test("normalizeSearchQuery bosluklari normalize eder", () => {
  assert.equal(normalizeSearchQuery("  su   yalitim "), "su yalitim");
});

test("buildSearchRegex kisa sorguda null doner", () => {
  assert.equal(buildSearchRegex("a"), null);
});

test("buildSearchRegex birden fazla kelimeyi esnek eslestirir", () => {
  const regex = buildSearchRegex("su yalitim");
  assert.ok(regex);
  assert.equal(regex.test("Su ve temel yalitim cozumleri"), true);
});
