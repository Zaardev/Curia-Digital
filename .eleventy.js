require("dotenv").config();
const contentful = require("contentful");

module.exports = async function(eleventyConfig) {
  if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
    throw new Error(
      "❌ Missing Contentful environment variables.\n" +
      "Set CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN in your .env (local) " +
      "or in Netlify → Site settings → Build & deploy → Environment."
    );
  }

  const client = contentful.createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
  });

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
