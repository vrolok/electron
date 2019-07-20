const gid = function $$gid(id, scope) {
  return (scope || document).getElementById(id);
};

const qs = function $$qs(selector, scope) {
  return (scope || document).querySelector(selector);
};

module.exports = {
  gid,
  qs
}
