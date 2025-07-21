import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderPath = `./fileUploads`;

    fs.access(folderPath, fs.constants.F_OK, (err) => {
      if (err) {
        fs.mkdir(folderPath, { recursive: true }, (err) => {
          if (err) {
            cb(err, "Error occured when creating folder");
          } else {
            cb(null, folderPath);
          }
        });
      } else {
        cb(null, folderPath);
      }
    });
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + `-` + file.originalname);
  },
});

export const fileUpload = multer({ storage: storage });
