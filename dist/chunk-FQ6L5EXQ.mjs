// src/utils/slugify.ts
function slugify(input) {
  return input.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
}

export {
  slugify
};
