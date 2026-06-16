function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  console.error(error);

  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ success: false, message: 'A record with the same unique value already exists.' });
  }
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'The uploaded image is too large.' });
  }
  if (error.message === 'Only JPG, PNG and WebP images are allowed.') {
    return res.status(400).json({ success: false, message: error.message });
  }

  const status = error.status || 500;
  const message = status === 500 && process.env.NODE_ENV === 'production'
    ? 'An internal server error occurred.'
    : error.message || 'An internal server error occurred.';
  return res.status(status).json({ success: false, message });
}

module.exports = { notFound, errorHandler };
