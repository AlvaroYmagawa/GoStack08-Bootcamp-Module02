import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';
// extname return the exension of some file
// resolve inform a path of some file

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'), // storage the images in this diretory file
    filename: (req, file, cb) => {
      // Generate 16 random bytes
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err); // case ocurr error
        // case not return error
        return cb(null, res.toString('hex') + extname(file.originalname)); // extname just use the extension of the original file
      });
    },
  }),
};
