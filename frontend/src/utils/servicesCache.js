import api from "../api";

let cachedServices = null;
let inflightPromise = null;

const normalizeList = (data) => (Array.isArray(data) ? data : []);

export const getCachedServices = () => cachedServices;

export const primeServicesCache = (services) => {
  cachedServices = normalizeList(services);
  return cachedServices;
};

export const fetchServicesCached = async ({ force = false } = {}) => {
  if (!force && Array.isArray(cachedServices)) {
    return cachedServices;
  }

  if (!force && inflightPromise) {
    return inflightPromise;
  }

  inflightPromise = api
    .get("/services", {
      params: { view: "summary" },
    })
    .then(({ data }) => {
      cachedServices = normalizeList(data);
      return cachedServices;
    })
    .finally(() => {
      inflightPromise = null;
    });

  return inflightPromise;
};

export const findCachedServiceById = (id) => {
  if (!id || !Array.isArray(cachedServices)) return null;
  return cachedServices.find((service) => service?._id === id) || null;
};
