function publicFileUrl(req, filePath) {
  if (!filePath) return null;
  if (/^(https?:|data:)/i.test(filePath)) return filePath;
  const base = process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get('host')}`;
  return `${base}${filePath.startsWith('/') ? '' : '/'}${filePath}`;
}

module.exports = { publicFileUrl };
