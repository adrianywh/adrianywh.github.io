module.exports=function(eleventyConfig){  
    eleventyConfig.addPassthroughCopy('assets')

    return {
        passthroughFileCopy: true,
        dir:{
            input:"./",
            output:"./_www"
        },
        pathPrefix: "/#/"
    }
}