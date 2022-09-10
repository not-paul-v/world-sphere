const withTM = require("next-transpile-modules")(["@world-sphere/react", "@world-sphere/core"]);

module.exports = withTM({
  reactStrictMode: true,
});
