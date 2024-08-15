"use strict";(self.webpackChunkrubiin_github_io=self.webpackChunkrubiin_github_io||[]).push([[334],{8068:function(e,t,a){a.r(t);var n=a(5768),l=a(6499),o=a.n(l),i=a(5644),r=a(9965),d=a(8721),s=a.n(d),m=a(758),c=a(6709);const{colors:g,fontSizes:p,fonts:u}=i.w4,f=Object.freeze({RECENT:"Recent",FEATURED:"Featured"}),y=c.default.div.withConfig({displayName:"blog__StyledTagsContainer",componentId:"sc-41y2at-0"})(["width:200px;margin-top:100px;",";",";"],i.$_.bigDesktop`display:none;`,i.$_.phablet`display: none;`),h=(0,c.default)(i.gZ).withConfig({displayName:"blog__StyledMainContainer",componentId:"sc-41y2at-1"})(["& > header{text-align:center;margin-bottom:100px;a{&:hover,&:focus{cursor:url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='48' viewport='0 0 100 100' style='fill:black;font-size:24px;'><text y='50%'>⚡</text></svg>\") 20 0,auto;}}}footer{",";margin-top:20px;width:100%;justify-content:flex-end;}"],i.vE.flexBetween),E=c.default.div.withConfig({displayName:"blog__StyledButtonContainer",componentId:"sc-41y2at-2"})(["margin:0 auto;display:flex;justify-content:center;align-items:center;"]),w=c.default.div.withConfig({displayName:"blog__StyledFlex",componentId:"sc-41y2at-3"})(["margin-top:20px;display:flex;width:inherit;gap:10%;justify-content:space-around;.posts{display:flex;flex-direction:column;width:80%;gap:0.5rem;}"]),_=c.default.div.withConfig({displayName:"blog__StyledPostInner",componentId:"sc-41y2at-4"})(["",";",";flex-direction:column;align-items:flex-start;position:relative;padding:2rem 1.75rem;height:100%;border-radius:",";transition:",";background-color:",";header,a{width:100%;}"],i.vE.boxShadow,i.vE.flexBetween,i.w4.borderRadius,i.w4.transition,g.lightNavy),x=(0,c.default)(r.Link).withConfig({displayName:"blog__StyledAllCategory",componentId:"sc-41y2at-5"})(["padding:1rem;"]),b=c.default.div.withConfig({displayName:"blog__StyledPost",componentId:"sc-41y2at-6"})(["transition:",";cursor:default;&:hover,&:focus{outline:0;","{transform:translateY(-5px);}}"],i.w4.transition,_),C=c.default.span.withConfig({displayName:"blog__StyledReadingTime",componentId:"sc-41y2at-7"})(["font-family:",";font-size:",";color:",";"],u.SFMono,p.smish,g.lightSlate),v=(0,c.default)(C).withConfig({displayName:"blog__StyledDate",componentId:"sc-41y2at-8"})(["text-transform:uppercase;"]),N=c.default.div.withConfig({displayName:"blog__StyledReadingTimeContainer",componentId:"sc-41y2at-9"})(["margin-bottom:1rem;display:flex;align-items:center;margin-top:10px;justify-content:space-between;"]),S=c.default.div.withConfig({displayName:"blog__StyledPostHeader",componentId:"sc-41y2at-10"})(["",";margin-bottom:30px;"],i.vE.flexBetween),k=c.default.div.withConfig({displayName:"blog__StyledFolder",componentId:"sc-41y2at-11"})(["color:",";svg{width:40px;height:40px;}"],g.green),I=c.default.h5.withConfig({displayName:"blog__StyledPostName",componentId:"sc-41y2at-12"})(["margin:0 0 10px;font-size:",";color:",";"],p.xxl,g.lightestSlate),R=c.default.div.withConfig({displayName:"blog__StyledPostDescription",componentId:"sc-41y2at-13"})(["font-size:17px;color:",";"],g.lightSlate),T=c.default.div.withConfig({displayName:"blog__StyledTags",componentId:"sc-41y2at-14"})(["display:flex;flex-wrap:wrap;a{",";}"],i.vE.inlineLink),D=(0,c.default)(i.$n).withConfig({displayName:"blog__StyledToggleButton",componentId:"sc-41y2at-15"})(["padding:0.5rem 0.7rem;margin:0.4rem;"]),F=(0,c.default)(i.$n).withConfig({displayName:"blog__StyledMoreButton",componentId:"sc-41y2at-16"})(["margin:40px 0;padding:1.25rem 10rem;",";",";",";"],i.$_.thone`padding:1.25rem 6rem;`,i.$_.thone`padding:1.25rem 4rem;`,i.$_.tiny`padding:1.25rem 4rem;`),$=c.default.h1.withConfig({displayName:"blog__StyledLatestPostHeader",componentId:"sc-41y2at-17"})(["margin:0  auto;margin-bottom:1rem;}"]);t.default=e=>{let{location:t,data:a}=e;const l=a.allMarkdownRemark.group,i=a.allMarkdownRemark.edges,{0:d,1:c}=(0,m.useState)(f.FEATURED),{0:g,1:p}=(0,m.useState)(i.slice(0,4)),u=l.sort(((e,t)=>t.totalCount-e.totalCount)).slice(0,4),A={year:"numeric",month:"short",day:"numeric"},P={title:` Blog | ${o().name}`,siteUrl:t.href,description:o().postPageDescription};return m.createElement(n.PE,{location:t},m.createElement(n.p3,{metadata:P}),m.createElement(h,null,m.createElement(w,null,m.createElement("div",{className:"posts"},m.createElement($,{className:"small-title wavy"},d===f.FEATURED?f.RECENT:f.FEATURED," Posts"),m.createElement(E,null,m.createElement(D,{onClick:()=>{d===f.FEATURED?(c(f.RECENT),p(i.filter((e=>{let{node:t}=e;return t.frontmatter.featured})).slice(0,4))):(p(i.slice(0,4)),c(f.FEATURED))}},d)),i.length>0&&g.map(((e,t)=>{let{node:a}=e;const{frontmatter:l,timeToRead:o,excerpt:i}=a,{title:d,slug:s,date:c,tags:g}=l,p=new Date(c);return m.createElement(b,{key:t,tabIndex:"0"},m.createElement(_,null,m.createElement("header",null,m.createElement(r.Link,{to:s},m.createElement(S,null,m.createElement(k,null)),m.createElement(N,null,m.createElement(v,null,`📆 ${p.toLocaleDateString("en-us",A)}`),m.createElement(C,null,`⏱️ ${o} min read`)),m.createElement(I,null,d),m.createElement(R,null,i))),m.createElement("footer",null,m.createElement(T,null,g.map(((e,t)=>m.createElement(n.WA,{key:t,text:e})))))))})),m.createElement(E,null,m.createElement(F,{onClick:()=>{d===f.FEATURED?p(i.slice(0,g.length+4)):p(i.filter((e=>{let{node:t}=e;return!0===t.frontmatter.featured})).slice(0,g.length+4))}},"Show More"))),m.createElement(y,null,m.createElement("h2",{className:"small-text"},"Read more on"),m.createElement("ul",{className:"fancy-list"},u.map((e=>m.createElement("li",{key:e.fieldValue},m.createElement(r.Link,{to:`/blog/tags/${s()(e.fieldValue)}/`},e.fieldValue," ",m.createElement("span",{className:"count"},"(",e.totalCount,")"))))),m.createElement(x,{to:"/blog/tags"},"All tags"))))))}}}]);
//# sourceMappingURL=component---src-pages-blog-index-js-fc67c7274a9c59c19a31.js.map