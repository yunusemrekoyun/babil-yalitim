const { normalizeWhitespace, stripHtmlToText } = require("./text");

function escapeRegex(input = "") {
  return String(input || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeSearchQuery(input = "") {
  return normalizeWhitespace(String(input || ""));
}

function tokenizeSearchQuery(input = "") {
  const query = normalizeSearchQuery(input).toLocaleLowerCase("tr-TR");
  if (!query) return [];

  return [...new Set(query.match(/[\p{L}\p{N}]{2,}/gu) || [])];
}

function buildSearchRegex(input = "") {
  const tokens = tokenizeSearchQuery(input);
  if (!tokens.length) return null;
  const pattern = tokens.map(escapeRegex).join(".*");
  return new RegExp(pattern, "i");
}

function buildMongoTokenQuery(fields = [], input = "") {
  const tokens = tokenizeSearchQuery(input);
  if (!tokens.length || !fields.length) return null;

  return {
    $and: tokens.map((token) => {
      const regex = new RegExp(escapeRegex(token), "i");
      return {
        $or: fields.map((field) => ({ [field]: regex })),
      };
    }),
  };
}

function normalizeSearchText(value = "") {
  if (Array.isArray(value)) {
    return normalizeWhitespace(
      value.map((item) => normalizeSearchText(item)).filter(Boolean).join(" ")
    ).toLocaleLowerCase("tr-TR");
  }

  if (value == null) return "";

  const raw = typeof value === "string" ? stripHtmlToText(value) : String(value);
  return normalizeWhitespace(raw).toLocaleLowerCase("tr-TR");
}

function scoreFieldValue(value, query, tokens, weight = 1) {
  const text = normalizeSearchText(value);
  if (!text) return 0;

  const words = text.match(/[\p{L}\p{N}]{2,}/gu) || [];
  let score = 0;

  if (text === query) score += weight * 26;
  if (text.startsWith(query)) {
    score += weight * 14;
  } else if (text.includes(query)) {
    score += weight * 9;
  }

  tokens.forEach((token) => {
    let exact = 0;
    let prefix = 0;
    let contains = 0;

    words.forEach((word) => {
      if (word === token) {
        exact += 1;
      } else if (word.startsWith(token)) {
        prefix += 1;
      } else if (word.includes(token)) {
        contains += 1;
      }
    });

    score += Math.min(exact, 4) * weight * 5;
    score += Math.min(prefix, 4) * weight * 3;
    score += Math.min(contains, 4) * weight * 1;
  });

  return Math.round(score);
}

function scoreSearchDocument(fieldConfigs = [], input = "") {
  const query = normalizeSearchQuery(input).toLocaleLowerCase("tr-TR");
  const tokens = tokenizeSearchQuery(query);

  if (!tokens.length) {
    return { score: 0, matchedFields: [] };
  }

  const matchedFields = [];
  let score = 0;

  fieldConfigs.forEach(({ value, weight = 1, label }) => {
    const fieldScore = scoreFieldValue(value, query, tokens, weight);
    if (fieldScore > 0) {
      score += fieldScore;
      if (label) matchedFields.push(label);
    }
  });

  return {
    score,
    matchedFields: [...new Set(matchedFields)].slice(0, 4),
  };
}

function buildExcerpt(value = "", input = "", maxLength = 180) {
  const plain = normalizeWhitespace(stripHtmlToText(value));
  if (!plain) return "";

  const query = normalizeSearchQuery(input).toLocaleLowerCase("tr-TR");
  const tokens = tokenizeSearchQuery(query);
  const lower = plain.toLocaleLowerCase("tr-TR");

  let matchIndex = query ? lower.indexOf(query) : -1;
  if (matchIndex === -1) {
    matchIndex = tokens.reduce((best, token) => {
      const idx = lower.indexOf(token);
      if (idx === -1) return best;
      if (best === -1) return idx;
      return Math.min(best, idx);
    }, -1);
  }

  if (plain.length <= maxLength) return plain;
  if (matchIndex === -1) return `${plain.slice(0, maxLength).trim()}...`;

  const start = Math.max(0, matchIndex - Math.floor(maxLength * 0.28));
  const end = Math.min(plain.length, start + maxLength);
  const prefix = start > 0 ? "..." : "";
  const suffix = end < plain.length ? "..." : "";

  return `${prefix}${plain.slice(start, end).trim()}${suffix}`;
}

module.exports = {
  escapeRegex,
  normalizeSearchQuery,
  tokenizeSearchQuery,
  buildSearchRegex,
  buildMongoTokenQuery,
  normalizeSearchText,
  scoreFieldValue,
  scoreSearchDocument,
  buildExcerpt,
};
