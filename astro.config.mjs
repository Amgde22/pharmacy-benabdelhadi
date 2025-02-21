import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import vue from "@astrojs/vue";




export default defineConfig({
  // update me!
  site: "https://www.yourwebsite.com",

  integrations: [icon(), sitemap({
    filter: (page) => !page.includes("/admin"),
    changefreq: "weekly",
    priority: 0.7,
  }), vue({
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag.includes('-'),
      },
    },
  })],

});