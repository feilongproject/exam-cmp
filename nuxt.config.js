export default {
  srcDir: "src/",
  ssr: false,

  target: "static",

  head: {
    title: "exam cmp",
    htmlAttrs: {
      lang: "zh"
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "exam cmp" },
      { name: "format-detection", content: "telephone=no" },
      { name: "keywords", content: "免费,飞龙project,feilongproject" }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "//cdn.jsdelivr.net/gh/feilongproject/bili-downloader/favicon.ico" },
    ],
    script: [{ src: "/index.js" }],
  },

  css: [
    "static/index.css",
    "element-ui/lib/theme-chalk/index.css",
  ],


  plugins: ["plugins/element-ui.js"],

  components: true,

  buildModules: [
    "@nuxt/typescript-build",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    vendor: ["element-ui"]
  }
}
