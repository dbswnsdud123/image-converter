/* eslint-disable @typescript-eslint/no-var-requires */
module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule("raw")
      .test(/\.txt$/)
      .use("raw-loader")
      .loader("raw-loader")
      .end();
  },
  devServer: {
    https: false,
    host: "localhost",
  },
  configureWebpack: {
    devtool: "source-map",
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      outputDir: "dist_electron",
      builderOptions: {
        productName: "Image Converter",
        artifactName: "Image Converter Setup ${version}.${ext}",
        win: {
          icon: "public/logo.png",
        },
      },
    },
  },
};
