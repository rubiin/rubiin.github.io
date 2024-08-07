var plugins = [{
      name: 'gatsby-plugin-react-helmet',
      plugin: require('/home/rubin/v4/node_modules/.pnpm/gatsby-plugin-react-helmet@6.13.1_gatsby@5.13.7_babel-eslint@10.1.0_eslint@9.7.0__react-dom@1_3ni6gc2g7axaimziu2446tozti/node_modules/gatsby-plugin-react-helmet/gatsby-ssr.js'),
      options: {"plugins":[]},
    },{
      name: 'gatsby-plugin-styled-components',
      plugin: require('/home/rubin/v4/node_modules/.pnpm/gatsby-plugin-styled-components@6.13.1_babel-plugin-styled-components@2.1.4_@babel+core@7.24._uvfz6cw3zdeldgt4yec2ddunyi/node_modules/gatsby-plugin-styled-components/gatsby-ssr.js'),
      options: {"plugins":[],"displayName":true,"fileName":true,"minify":true,"namespace":"","transpileTemplateLiterals":true,"topLevelImportPaths":[],"pure":false,"disableVendorPrefixes":false},
    },{
      name: 'gatsby-plugin-sitemap',
      plugin: require('/home/rubin/v4/node_modules/.pnpm/gatsby-plugin-sitemap@6.13.1_gatsby@5.13.7_babel-eslint@10.1.0_eslint@9.7.0__react-dom@18.3.1_h44lysbtdb7p37bdjye5ijq7ku/node_modules/gatsby-plugin-sitemap/gatsby-ssr.js'),
      options: {"plugins":[],"output":"/","createLinkInHead":true,"entryLimit":45000,"query":"{ site { siteMetadata { siteUrl } } allSitePage { nodes { path } } }","excludes":[]},
    },{
      name: 'gatsby-plugin-manifest',
      plugin: require('/home/rubin/v4/node_modules/.pnpm/gatsby-plugin-manifest@5.13.1_gatsby@5.13.7_babel-eslint@10.1.0_eslint@9.7.0__react-dom@18.3._o37gwnrzjpqhyrqgr4ev3lj7gm/node_modules/gatsby-plugin-manifest/gatsby-ssr.js'),
      options: {"plugins":[],"name":"RubinBhandari","short_name":"RubinBhandari","start_url":"/","background_color":"#020c1b","theme_color":"#0a192f","display":"minimal-ui","icon":"src/images/logo.png","legacy":true,"theme_color_in_head":true,"cache_busting_mode":"query","crossOrigin":"anonymous","include_favicon":true,"cacheDigest":"c96c9f5a019cbe52963c87c2fbab3958"},
    },{
      name: 'gatsby-plugin-offline',
      plugin: require('/home/rubin/v4/node_modules/.pnpm/gatsby-plugin-offline@6.13.2_gatsby@5.13.7_babel-eslint@10.1.0_eslint@9.7.0__react-dom@18.3.1_o4k4mohfx3kgvmtwdqteukbsay/node_modules/gatsby-plugin-offline/gatsby-ssr.js'),
      options: {"plugins":[]},
    },{
      name: 'gatsby-plugin-feed',
      plugin: require('/home/rubin/v4/node_modules/.pnpm/gatsby-plugin-feed@5.13.1_gatsby@5.13.7_babel-eslint@10.1.0_eslint@9.7.0__react-dom@18.3.1_re_us3osq7lm5d5hswotytzbfifba/node_modules/gatsby-plugin-feed/gatsby-ssr.js'),
      options: {"plugins":[],"query":"\n      {\n        site {\n          siteMetadata {\n            title\n            description\n            siteUrl\n            site_url: siteUrl\n          }\n        }\n      }\n    ","feeds":[{"title":"Exploring the latest trends, best practices, and in-depth insights in software engineering and web development","output":"rss.xml","query":"\n                {\n    allMarkdownRemark(\n      filter: { fileAbsolutePath: { regex: \"/posts/\" }, frontmatter: { draft: { ne: true } } }\n   sort: {frontmatter: {date: DESC}}\n    ) {\n      edges {\n        node {\n          frontmatter {\n            title\n            slug\n            date\n            tags\n            draft\n          }\n          html\n        }\n      }\n    }\n          }\n        "}]},
    },{
      name: 'gatsby-plugin-google-gtag',
      plugin: require('/home/rubin/v4/node_modules/.pnpm/gatsby-plugin-google-gtag@5.13.1_gatsby@5.13.7_babel-eslint@10.1.0_eslint@9.7.0__react-dom@18_6fdtuyhbjxjdswjh7g3thqghvi/node_modules/gatsby-plugin-google-gtag/gatsby-ssr.js'),
      options: {"plugins":[],"trackingIds":["G-ZD0B25CPH9"],"gtagConfig":{}},
    },{
      name: 'partytown',
      plugin: require('/home/rubin/v4/node_modules/.pnpm/gatsby@5.13.7_babel-eslint@10.1.0_eslint@9.7.0__react-dom@18.3.1_react@18.3.1__react@18.3.1_t_4sk6xhkdrho53gq77wpx67s57y/node_modules/gatsby/dist/internal-plugins/partytown/gatsby-ssr.js'),
      options: {"plugins":[]},
    }]
/* global plugins */
// During bootstrap, we write requires at top of this file which looks like:
// var plugins = [
//   {
//     plugin: require("/path/to/plugin1/gatsby-ssr.js"),
//     options: { ... },
//   },
//   {
//     plugin: require("/path/to/plugin2/gatsby-ssr.js"),
//     options: { ... },
//   },
// ]

const apis = require(`./api-ssr-docs`)

function augmentErrorWithPlugin(plugin, err) {
  if (plugin.name !== `default-site-plugin`) {
    // default-site-plugin is user code and will print proper stack trace,
    // so no point in annotating error message pointing out which plugin is root of the problem
    err.message += ` (from plugin: ${plugin.name})`
  }

  throw err
}

export function apiRunner(api, args, defaultReturn, argTransform) {
  if (!apis[api]) {
    console.log(`This API doesn't exist`, api)
  }

  const results = []
  plugins.forEach(plugin => {
    const apiFn = plugin.plugin[api]
    if (!apiFn) {
      return
    }

    try {
      const result = apiFn(args, plugin.options)

      if (result && argTransform) {
        args = argTransform({ args, result })
      }

      // This if case keeps behaviour as before, we should allow undefined here as the api is defined
      // TODO V4
      if (typeof result !== `undefined`) {
        results.push(result)
      }
    } catch (e) {
      augmentErrorWithPlugin(plugin, e)
    }
  })

  return results.length ? results : [defaultReturn]
}

export async function apiRunnerAsync(api, args, defaultReturn, argTransform) {
  if (!apis[api]) {
    console.log(`This API doesn't exist`, api)
  }

  const results = []
  for (const plugin of plugins) {
    const apiFn = plugin.plugin[api]
    if (!apiFn) {
      continue
    }

    try {
      const result = await apiFn(args, plugin.options)

      if (result && argTransform) {
        args = argTransform({ args, result })
      }

      // This if case keeps behaviour as before, we should allow undefined here as the api is defined
      // TODO V4
      if (typeof result !== `undefined`) {
        results.push(result)
      }
    } catch (e) {
      augmentErrorWithPlugin(plugin, e)
    }
  }

  return results.length ? results : [defaultReturn]
}
