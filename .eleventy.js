const markdownIt = require('markdown-it')
const markdownItAttrs = require('markdown-it-attrs')

const markdownItOptions = {
  html: true,
  breaks: true,
  linkify: true
}

const markdownLib = markdownIt(markdownItOptions).use(markdownItAttrs)

module.exports = function(eleventyConfig) {
    // Return your Object options:
    eleventyConfig.addPassthroughCopy("assets");
    eleventyConfig.setLibrary('md', markdownLib)

    return {
      dir: {
        output: "docs"
      }
    }
  };
  