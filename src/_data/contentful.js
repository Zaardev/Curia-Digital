require("dotenv").config();
const contentful = require("contentful");

module.exports = async function() {
  const isPreview =
    process.env.CONTEXT === "deploy-preview" ||
    process.env.CONTENTFUL_ENV === "preview";

  const accessToken = isPreview
    ? process.env.CONTENTFUL_PREVIEW_TOKEN
    : process.env.CONTENTFUL_DELIVERY_TOKEN;

  if (!process.env.CONTENTFUL_SPACE_ID || !accessToken) {
    throw new Error("❌ Missing Contentful environment variables. Check Netlify settings.");
  }

  const client = contentful.createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken,
    host: isPreview ? "preview.contentful.com" : "cdn.contentful.com",
  });

  const entries = await client.getEntries({ content_type: "blogPost" });

  return {
    posts: entries.items.map(item => ({
      title: item.fields.title,
      date: item.fields.date,
      slug: item.fields.slug,
      body: item.fields.body,
    })),
  };
};
