const VARIANTS = {
  a: 'aàáảãạăằắẳẵặâầấẩẫậ',
  e: 'eèéẻẽẹêềếểễệ',
  i: 'iìíỉĩị',
  o: 'oòóỏõọôồốổỗộơờớởỡợ',
  u: 'uùúủũụưừứửữự',
  y: 'yỳýỷỹỵ',
  d: 'dđ',
};

function buildSearchRegex(keyword) {
  const base = String(keyword)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
    .slice(0, 100);
  const pattern = [...base]
    .map((ch) =>
      VARIANTS[ch]
        ? `[${VARIANTS[ch]}${VARIANTS[ch].toUpperCase()}]`
        : ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    )
    .join('');
  return new RegExp(pattern, 'i');
}

module.exports = { buildSearchRegex };
