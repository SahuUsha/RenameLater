import multer from "multer"

const storage = multer.diskStorage({
    // we are using deskstorage
    destination: function (req, file, cb) {
        // req will accept all json content and file will take file data
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
    
      cb(null, file.originalname) // cn-->callback
      // we can add suffix if we want to add it
     }
  })
  
  const upload = multer({ storage, })