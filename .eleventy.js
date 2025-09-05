// .eleventy.js
require("dotenv").config();
const contentful = require("contentful");

// This function must remain synchronous
module.exports = function(eleventyConfig) {
  // Pass the Contentful client and configuration to the global data file
  eleventyConfig.addGlobalData("contentful", async () => {
    // Choose token depending on environment
    const isPreview = process.env.CONTEXT === "deploy-preview" || process.env.CONTENTFUL_ENV === "preview";

    const accessToken = isPreview
      ? process.env.CONTENTFUL_PREVIEW_TOKEN
      : process.env.CONTENTFUL_DELIVERY_TOKEN;

    if (!process.env.CONTENTFUL_SPACE_ID || !accessToken) {
      throw new Error("❌ Missing Contentful environment variables. Check Netlify settings.");
    }

    const client = contentful.createClient({
      space: process.env.CONTENTFUL_SPACE_ID,
      accessToken: accessToken,
      host: isPreview ? "preview.contentful.com" : "cdn.contentful.com"
    });

    // Fetch blog posts and return them
    const entries = await client.getEntries({ content_type: "blogPost" });

    return {
      posts: entries.items.map(item => ({
        title: item.fields.title,
        date: item.fields.date,
        slug: item.fields.slug,
        body: item.fields.body
      }))
    };
  });

  return {
    dir: { input: "src", output: "_site" }
  };
};