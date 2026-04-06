import api from "../api";

const caches = new Map();
const inflightPromises = new Map();

const normalizeList = (data) => (Array.isArray(data) ? data : []);
const normalizeLocale = (locale = "tr") =>
  String(locale || "tr").toLowerCase().startsWith("en") ? "en" : "tr";

export const getCachedServices = (locale = "tr") =>
  caches.get(normalizeLocale(locale)) || null;

export const primeServicesCache = (services, locale = "tr") => {
  const normalizedLocale = normalizeLocale(locale);
  const list = normalizeList(services);
  caches.set(normalizedLocale, list);
  return list;
};

export const fetchServicesCached = async ({ force = false, locale = "tr" } = {}) => {
  const normalizedLocale = normalizeLocale(locale);
  const cachedServices = caches.get(normalizedLocale) || null;
  const inflightPromise = inflightPromises.get(normalizedLocale) || null;

  if (!force && Array.isArray(cachedServices)) {
    return cachedServices;
  }

  if (!force && inflightPromise) {
    return inflightPromise;
  }

  const request = api
    .get("/services", {
      params: { view: "summary", locale: normalizedLocale },
    })
    .then(({ data }) => {
      const list = normalizeList(data);
      caches.set(normalizedLocale, list);
      return list;
    })
    .finally(() => {
      inflightPromises.delete(normalizedLocale);
    });

  inflightPromises.set(normalizedLocale, request);
  return request;
};

export const findCachedServiceById = (id, locale = "tr") => {
  const cachedServices = caches.get(normalizeLocale(locale)) || null;
  if (!id || !Array.isArray(cachedServices)) return null;
  return cachedServices.find((service) => service?._id === id) || null;
};
