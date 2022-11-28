const withTM = require("next-transpile-modules")(["@world-sphere/react", "@world-sphere/core", "@world-sphere/data"]);

module.exports = withTM({
  reactStrictMode: true,
});
