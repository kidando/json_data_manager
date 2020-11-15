module.exports = {
  chainWebpack: config => { config.externals({ "nedb-promises":"commonjs nedb-promises" }) },
  transpileDependencies: ["vuetify"],
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        extraResources: ["src/data/"],
      }
    },
  },
};
