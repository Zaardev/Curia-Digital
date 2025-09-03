const contentful = require("contentful");

module.exports = async function(eleventyConfig) {
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
