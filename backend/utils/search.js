function escapeRegex(input = "") {
  return String(input || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeSearchQuery(input = "") {
  return String(input || "")
    .trim()
    .replace(/\s+/g, " ");
}

function buildSearchRegex(input = "") {
  const query = normalizeSearchQuery(input);
  if (query.length < 2) return null;
  const pattern = query
    .split(" ")
    .filter(Boolean)
    .map(escapeRegex)
    .join(".*");
  return new RegExp(pattern, "i");
}

module.exports = {
  escapeRegex,
  normalizeSearchQuery,
  buildSearchRegex,
};
