// backend/uploadRouter.js
const { createUploadthing } = require("uploadthing/server");

const f = createUploadthing();

const uploadRouter = {
  pdfUploader: f({
    pdf: { maxFileSize: "10MB", maxFileCount: 1 },
  }).onUploadComplete(({ file }) => {
    console.log("✅ PDF subido:", file.url);
  }),
};

module.exports = { uploadRouter };
