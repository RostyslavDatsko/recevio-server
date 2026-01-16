import fs from "fs";
import { extractReceiptJson } from "../services/gpt.request.js";
import { normalizeItems } from "../modules/normalizeItems.js";

export const uploadReceipt = async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ error: "No file uploaded. Field name must be 'photo'." });
  }

  const filePath = req.file.path;
  const fileName = req.file.originalname;
  const uploadTimestamp = new Date().toISOString();

  try {
    const imageBase64 = fs.readFileSync(filePath, { encoding: "base64" });

    const parsedJson = await extractReceiptJson(imageBase64);

    // Нормалізація items + метадані
    if (parsedJson?.receipts?.length > 0) {
      const r = parsedJson.receipts[0];

      r.items = normalizeItems(r.items);

      r.metadata.photo_url = `/uploads/${req.file.filename}`;
      r.metadata.upload_timestamp = uploadTimestamp;
      r.metadata.original_filename = fileName;
    }

    return res.json(parsedJson);
  } catch (error) {
    console.error("🔥 Error in /upload:", error);
    return res.status(500).json({ error: error.message });
  } finally {
    // Прибираємо тимчасовий файл
    try {
      fs.unlinkSync(filePath);
    } catch (e) {
      console.warn("⚠️ Could not delete temp file:", e.message);
    }
  }
};
