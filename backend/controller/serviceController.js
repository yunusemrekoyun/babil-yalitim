const Service = require("../models/Service");
const mediaStorage = require("../storage");
const {
  normalizeOrderedItems,
  parseDisplayOrder,
  syncCollectionDisplayOrder,
} = require("../utils/displayOrder");
const {
  parseMediaOrder,
  reorderMediaCollection,
} = require("../utils/mediaOrder");

/* -------------------- helpers -------------------- */

const normalizeAreas = (val) => {
  if (Array.isArray(val)) {
    return val
      .map(String)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) {
        return parsed
          .map(String)
          .map((s) => s.trim())
          .filter(Boolean);
      }
    } catch {
      /* JSON değilse CSV say */
    }

    return val
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeSubServices = (value) => {
  if (!value) return [];

  let parsed = value;

  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(parsed)) return [];

  return parsed.map((item, index) => ({
    id: item?.id ? String(item.id) : "",
    clientId: String(item?.clientId || item?.id || `sub-${index}`),
    displayOrder: parseDisplayOrder(item?.displayOrder) || index + 1,
    title: String(item?.title || "").trim(),
    type: String(item?.type || "").trim(),
    category: String(item?.category || "").trim(),
    description: String(item?.description || "").trim(),
    usageAreas: normalizeAreas(item?.usageAreas),
  }));
};

const VERTICAL_MIN_RATIO = Number(process.env.VERTICAL_MIN_RATIO || 1.5);

const assertPortrait = (meta, where = "kapak") => {
  const w = Number(meta?.width || 0);
  const h = Number(meta?.height || 0);
  if (!w || !h) return;

  const ratio = h / w;
  if (h < w || ratio < VERTICAL_MIN_RATIO) {
    const err = new Error(
      `Lütfen ${where} için dikey bir medya yükleyin (en-boy oranı en az ${VERTICAL_MIN_RATIO}:1).`
    );
    err.status = 400;
    throw err;
  }
};

const uploadOne = async (file, folder) => mediaStorage.upload(file, { folder });

const destroyIfExists = async (media) => mediaStorage.destroy(media);

const flattenFiles = (files) =>
  Array.isArray(files) ? files : Object.values(files || {}).flat();

const getFirstFile = (files, fieldname) =>
  flattenFiles(files).find((file) => file.fieldname === fieldname);

const getFiles = (files, fieldname) =>
  flattenFiles(files).filter((file) => file.fieldname === fieldname);

const validateServicePayload = (payload, label) => {
  if (!payload.title) {
    const err = new Error(`${label} için başlık zorunludur.`);
    err.status = 400;
    throw err;
  }

  if (!payload.description) {
    const err = new Error(`${label} için açıklama zorunludur.`);
    err.status = 400;
    throw err;
  }
};

const buildSubService = async ({
  payload,
  files,
  folder,
  existing = null,
  label = "Alt hizmet",
  imageOrder = [],
}) => {
  validateServicePayload(payload, label);

  const coverField = `subServiceCover__${payload.clientId}`;
  const imagesField = `subServiceImages__${payload.clientId}`;
  const coverFile = getFirstFile(files, coverField);
  const imageFiles = getFiles(files, imagesField);

  let cover = existing?.cover || null;
  let images = Array.isArray(existing?.images) ? [...existing.images] : [];

  if (!cover && !coverFile) {
    const err = new Error(`${label} için kapak zorunludur.`);
    err.status = 400;
    throw err;
  }

  if (coverFile) {
    const uploaded = await uploadOne(coverFile, `${folder}/subservices`);
    try {
      assertPortrait(uploaded, `${label} kapağı`);
    } catch (error) {
      await destroyIfExists(uploaded);
      throw error;
    }

    if (cover) {
      await destroyIfExists(cover);
    }
    cover = uploaded;
  }

  if (imageFiles.length) {
    const uploadedImages = await Promise.all(
      imageFiles.map((file) => uploadOne(file, `${folder}/subservices/gallery`))
    );
    images = await reorderMediaCollection({
      existing: images,
      uploaded: uploadedImages,
      order: imageOrder,
      destroy: destroyIfExists,
    });
  } else if (imageOrder.length) {
    images = await reorderMediaCollection({
      existing: images,
      uploaded: [],
      order: imageOrder,
      destroy: destroyIfExists,
    });
  }

  return {
    _id: existing?._id,
    displayOrder:
      parseDisplayOrder(payload.displayOrder) ||
      parseDisplayOrder(existing?.displayOrder) ||
      0,
    title: payload.title,
    type: payload.type,
    category: payload.category,
    description: payload.description,
    usageAreas: payload.usageAreas,
    cover,
    images,
  };
};

const destroySubServices = async (subServices = []) => {
  await Promise.all(
    subServices.flatMap((subService) => [
      destroyIfExists(subService?.cover),
      ...(Array.isArray(subService?.images)
        ? subService.images.map((image) => destroyIfExists(image))
        : []),
    ])
  );
};

const normalizeSubServiceOrder = (subServices = []) =>
  normalizeOrderedItems(subServices).map((item, index) => ({
    ...item,
    displayOrder: index + 1,
  }));

/* -------------------- GET -------------------- */
const getServices = async (_req, res) => {
  try {
    await syncCollectionDisplayOrder(Service);
    const services = await Service.find().sort({
      displayOrder: 1,
      createdAt: 1,
      _id: 1,
    });
    res.json(
      services.map((service) => {
        const payload = service.toObject();
        payload.subServices = normalizeSubServiceOrder(payload.subServices || []);
        return payload;
      })
    );
  } catch (err) {
    res
      .status(500)
      .json({ message: "Servisler alınamadı", error: err.message });
  }
};

const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Servis bulunamadı" });
    const payload = service.toObject();
    payload.subServices = normalizeSubServiceOrder(payload.subServices || []);
    res.json(payload);
  } catch (err) {
    res.status(500).json({ message: "Servis alınamadı", error: err.message });
  }
};

/* -------------------- CREATE -------------------- */
const createService = async (req, res) => {
  try {
    const requestedOrder = parseDisplayOrder(req.body.displayOrder);
    const payload = {
      title: String(req.body.title || "").trim(),
      ...(requestedOrder ? { displayOrder: requestedOrder } : {}),
      type: String(req.body.type || "").trim(),
      category: String(req.body.category || "").trim(),
      description: String(req.body.description || "").trim(),
      usageAreas: normalizeAreas(req.body.usageAreas),
    };
    const subServicesPayload = normalizeSubServices(req.body.subServices);

    validateServicePayload(payload, "Hizmet");

    const files = req.files || [];
    const coverFile = getFirstFile(files, "cover");
    if (!coverFile) {
      return res.status(400).json({ message: "Kapak zorunludur." });
    }

    const folder = process.env.MEDIA_SERVICES_FOLDER || "services";

    const cover = await uploadOne(coverFile, folder);
    assertPortrait(cover, "kapak");

    let images = [];
    const galleryFiles = getFiles(files, "images");
    if (galleryFiles.length) {
      const uploadedImages = await Promise.all(
        galleryFiles.map((file) => uploadOne(file, `${folder}/gallery`))
      );
      images = await reorderMediaCollection({
        existing: [],
        uploaded: uploadedImages,
        order: parseMediaOrder(req.body.imageOrder),
        destroy: destroyIfExists,
      });
    }

    const subServices = [];
    for (let index = 0; index < subServicesPayload.length; index += 1) {
      const item = await buildSubService({
        payload: subServicesPayload[index],
        files,
        folder,
        label: `Alt hizmet ${index + 1}`,
        imageOrder: parseMediaOrder(
          req.body[`subServiceImageOrder__${subServicesPayload[index].clientId}`]
        ),
      });
      subServices.push(item);
    }

    const orderedSubServices = normalizeSubServiceOrder(subServices);

    const created = await Service.create({
      ...payload,
      cover,
      images,
      subServices: orderedSubServices,
    });

    await syncCollectionDisplayOrder(
      Service,
      created._id,
      requestedOrder
    );
    const refreshed = await Service.findById(created._id);
    const response = refreshed.toObject();
    response.subServices = normalizeSubServiceOrder(response.subServices || []);

    res.status(201).json(response);
  } catch (err) {
    res
      .status(err.status || 400)
      .json({ message: err.message || "Servis eklenemedi" });
  }
};

/* -------------------- UPDATE -------------------- */
const updateService = async (req, res) => {
  try {
    const svc = await Service.findById(req.params.id);
    if (!svc) return res.status(404).json({ message: "Servis bulunamadı" });

    const folder = process.env.MEDIA_SERVICES_FOLDER || "services";
    const files = req.files || [];

    const title = req.body.title !== undefined ? String(req.body.title).trim() : svc.title;
    const requestedOrder = parseDisplayOrder(req.body.displayOrder);
    const type = req.body.type !== undefined ? String(req.body.type).trim() : svc.type;
    const category =
      req.body.category !== undefined
        ? String(req.body.category).trim()
        : svc.category;
    const description =
      req.body.description !== undefined
        ? String(req.body.description).trim()
        : svc.description;
    const usageAreas =
      req.body.usageAreas !== undefined
        ? normalizeAreas(req.body.usageAreas)
        : svc.usageAreas;

    validateServicePayload({ title, description }, "Hizmet");

    svc.title = title;
    if (requestedOrder) svc.displayOrder = requestedOrder;
    svc.type = type;
    svc.category = category;
    svc.description = description;
    svc.usageAreas = usageAreas;

    const coverFile = getFirstFile(files, "cover");
    if (coverFile) {
      const uploaded = await uploadOne(coverFile, folder);
      try {
        assertPortrait(uploaded, "kapak");
      } catch (error) {
        await destroyIfExists(uploaded);
        throw error;
      }
      await destroyIfExists(svc.cover);
      svc.cover = uploaded;
    }

    const galleryFiles = getFiles(files, "images");
    if (galleryFiles.length) {
      const uploadedImages = await Promise.all(
        galleryFiles.map((file) => uploadOne(file, `${folder}/gallery`))
      );
      svc.images = await reorderMediaCollection({
        existing: svc.images || [],
        uploaded: uploadedImages,
        order: parseMediaOrder(req.body.imageOrder),
        destroy: destroyIfExists,
      });
    } else if (req.body.imageOrder !== undefined) {
      svc.images = await reorderMediaCollection({
        existing: svc.images || [],
        uploaded: [],
        order: parseMediaOrder(req.body.imageOrder),
        destroy: destroyIfExists,
      });
    }

    const nextSubServicesPayload =
      req.body.subServices !== undefined
        ? normalizeSubServices(req.body.subServices)
        : (svc.subServices || []).map((item) => ({
            id: String(item._id),
            clientId: String(item._id),
            displayOrder: item.displayOrder,
            title: item.title,
            type: item.type,
            category: item.category,
            description: item.description,
            usageAreas: item.usageAreas || [],
          }));

    const existingMap = new Map(
      (svc.subServices || []).map((subService) => [String(subService._id), subService])
    );

    const nextSubServices = [];
    for (let index = 0; index < nextSubServicesPayload.length; index += 1) {
      const payload = nextSubServicesPayload[index];
      const existing = payload.id ? existingMap.get(String(payload.id)) : null;

      const item = await buildSubService({
        payload,
        files,
        folder,
        existing,
        label: `Alt hizmet ${index + 1}`,
        imageOrder: parseMediaOrder(
          req.body[`subServiceImageOrder__${payload.clientId}`]
        ),
      });

      nextSubServices.push(item);
    }

    const keptIds = new Set(
      nextSubServices
        .map((item) => item?._id)
        .filter(Boolean)
        .map((value) => String(value))
    );

    const removedSubServices = (svc.subServices || []).filter(
      (subService) => !keptIds.has(String(subService._id))
    );
    await destroySubServices(removedSubServices);

    svc.subServices = normalizeSubServiceOrder(nextSubServices);

    const saved = await svc.save();
    await syncCollectionDisplayOrder(
      Service,
      saved._id,
      requestedOrder || saved.displayOrder
    );
    const refreshed = await Service.findById(saved._id);
    const response = refreshed.toObject();
    response.subServices = normalizeSubServiceOrder(response.subServices || []);
    res.json(response);
  } catch (err) {
    res.status(err.status || 400).json({
      message: err.message || "Servis güncellenemedi",
    });
  }
};

/* -------------------- DELETE -------------------- */
const deleteService = async (req, res) => {
  try {
    const svc = await Service.findById(req.params.id);
    if (!svc) return res.status(404).json({ message: "Servis bulunamadı" });

    await destroyIfExists(svc.cover);
    if (Array.isArray(svc.images)) {
      await Promise.all(svc.images.map((image) => destroyIfExists(image)));
    }
    await destroySubServices(svc.subServices || []);

    await svc.deleteOne();
    await syncCollectionDisplayOrder(Service);
    res.json({ message: "Servis silindi" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Silme işlemi başarısız", error: err.message });
  }
};

const setServiceOrder = async (req, res) => {
  try {
    const svc = await Service.findById(req.params.id);
    if (!svc) return res.status(404).json({ message: "Servis bulunamadı" });

    const requestedOrder = parseDisplayOrder(req.body.displayOrder);
    if (!requestedOrder) {
      return res
        .status(400)
        .json({ message: "Geçerli bir gösterim sırası girin." });
    }

    await syncCollectionDisplayOrder(Service, svc._id, requestedOrder);
    const refreshed = await Service.findById(svc._id);
    res.json({
      message: "Hizmet sırası güncellendi",
      displayOrder: refreshed?.displayOrder || requestedOrder,
    });
  } catch (err) {
    res.status(400).json({
      message: "Sıra güncellenemedi",
      error: err.message,
    });
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  setServiceOrder,
};
