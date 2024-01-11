// upload.single('image'); req.file
// upload.array('images', 5); req.files
exports.resizeTourImages = (req, res, next) => {
  console.log(req.files);
  next();
};
