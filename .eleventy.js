require("dotenv").config();
const contentful = require("contentful");

module.exports = async function(eleventyConfig) {
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
    host: isPreview ? "preview.contentful.com" : "cdn.contentful.com" // 👈 important!
  });

  // Fetch blog posts
  const entries = await client.getEntries({ content_type: "blogPost" });

  eleventyConfig.addCollection("posts", () => {
    return entries.items.map(item => ({
      title: item.fields.title,
      date: item.fields.date,
      slug: item.fields.slug,
      body: item.fields.body
    }));
  });

  return {
    dir: { input: "src", output: "_site" }
  };
};
