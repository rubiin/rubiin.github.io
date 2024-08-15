"use strict";(self.webpackChunkrubiin_github_io=self.webpackChunkrubiin_github_io||[]).push([[334],{4997:function(e,t,l){l.r(t);var a=l(5495),n=l(1566),o=l.n(n),i=l(4088),r=l(2255),d=l(4955),s=l(8721),m=l.n(s),c=l(758),g=l(9633),u=l(6709);const{colors:p,fontSizes:f,fonts:y}=i.w4,h=u.default.div.withConfig({displayName:"blog__StyledTagsContainer",componentId:"sc-41y2at-0"})(["max-width:max-content;height:fit-content;margin-top:100px;",";",";"],i.$_.bigDesktop`display:none;`,i.$_.phablet`display: none;`),w=(0,u.default)(i.gZ).withConfig({displayName:"blog__StyledMainContainer",componentId:"sc-41y2at-1"})(["& > header{text-align:center;margin-bottom:100px;a{&:hover,&:focus{cursor:url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='48' viewport='0 0 100 100' style='fill:black;font-size:24px;'><text y='50%'>⚡</text></svg>\") 20 0,auto;}}}footer{",";margin-top:20px;width:100%;justify-content:flex-end;}"],i.vE.flexBetween),b=u.default.div.withConfig({displayName:"blog__StyledButtonContainer",componentId:"sc-41y2at-2"})(["margin:0 auto;display:flex;justify-content:center;align-items:center;"]),_=((0,u.default)(d.A).withConfig({displayName:"blog__StyledFeaturedImg",componentId:"sc-41y2at-3"})(["width:100%;max-width:100%;vertical-align:middle;border-radius:",";position:relative;mix-blend-mode:multiply;filter:grayscale(100%) contrast(1) brightness(90%);",";"],i.w4.borderRadius,i.$_.tablet`
    object-fit: cover;
    width: auto;
    height: 100%;
    filter: grayscale(100%) contrast(1) brightness(80%);
  `),u.default.div.withConfig({displayName:"blog__StyledFlex",componentId:"sc-41y2at-4"})(["margin-top:20px;display:flex;width:inherit;gap:10%;justify-content:space-around;.posts{display:flex;flex-direction:column;width:80%;gap:0.5rem;}"])),x=u.default.div.withConfig({displayName:"blog__StyledPostInner",componentId:"sc-41y2at-5"})(["",";",";flex-direction:column;align-items:flex-start;position:relative;padding:2rem 1.75rem;height:100%;border-radius:",";transition:",";background-color:",";header,a{width:100%;}"],i.vE.boxShadow,i.vE.flexBetween,i.w4.borderRadius,i.w4.transition,p.lightNavy),E=(0,u.default)(r.Link).withConfig({displayName:"blog__StyledAllCategory",componentId:"sc-41y2at-6"})(["padding:1rem;"]),C=u.default.div.withConfig({displayName:"blog__StyledPost",componentId:"sc-41y2at-7"})(["transition:",";cursor:default;&:hover,&:focus{outline:0;","{transform:translateY(-5px);}}"],i.w4.transition,x),S=u.default.span.withConfig({displayName:"blog__StyledReadingTime",componentId:"sc-41y2at-8"})(["font-family:",";font-size:",";color:",";"],y.SFMono,f.smish,p.lightSlate),v=(0,u.default)(S).withConfig({displayName:"blog__StyledDate",componentId:"sc-41y2at-9"})(["text-transform:uppercase;"]),N=u.default.div.withConfig({displayName:"blog__StyledReadingTimeContainer",componentId:"sc-41y2at-10"})(["margin-bottom:1rem;display:flex;align-items:center;margin-top:10px;justify-content:space-between;"]),k=u.default.div.withConfig({displayName:"blog__StyledPostHeader",componentId:"sc-41y2at-11"})(["",";margin-bottom:30px;"],i.vE.flexBetween),I=u.default.div.withConfig({displayName:"blog__StyledFolder",componentId:"sc-41y2at-12"})(["color:",";svg{width:40px;height:40px;}"],p.green),$=u.default.h5.withConfig({displayName:"blog__StyledPostName",componentId:"sc-41y2at-13"})(["margin:0 0 10px;font-size:",";color:",";"],f.xxl,p.lightestSlate),F=u.default.div.withConfig({displayName:"blog__StyledPostDescription",componentId:"sc-41y2at-14"})(["font-size:17px;color:",";"],p.lightSlate),R=u.default.ul.withConfig({displayName:"blog__StyledTags",componentId:"sc-41y2at-15"})(["display:flex;align-items:flex-end;padding:0;margin:0;list-style:none;li{font-family:",";font-size:",";color:",";line-height:1.75;margin-right:15px;&:last-of-type{margin-right:0;}a{",";}}"],y.SFMono,f.xs,p.green,i.vE.inlineLink),M=(0,u.default)(i.$n).withConfig({displayName:"blog__StyledToggleButton",componentId:"sc-41y2at-16"})(["padding:0.5rem 0.7rem;margin:0.4rem;"]),P=(0,u.default)(i.$n).withConfig({displayName:"blog__StyledMoreButton",componentId:"sc-41y2at-17"})(["margin:40px 0;padding:1.25rem 10rem;",";"],i.$_.phablet`padding:1.25rem 5rem;`),T=u.default.h1.withConfig({displayName:"blog__StyledLatestPostHeader",componentId:"sc-41y2at-18"})(["margin:0  auto;margin-bottom:1rem;}"]);t.default=e=>{let{location:t,data:l}=e;const n=l.allMarkdownRemark.group,{0:i,1:d}=(0,c.useState)(l.allMarkdownRemark.edges),{0:s,1:u}=(0,c.useState)("Featured"),{0:p,1:f}=(0,c.useState)(i.slice(0,4)),y=n.sort(((e,t)=>t.totalCount-e.totalCount)).slice(0,5),B={year:"numeric",month:"short",day:"numeric"};return c.createElement(a.PE,{location:t},c.createElement(g.m,null,c.createElement("title",null,"Blog | ",o().name),c.createElement("link",{rel:"canonical",href:`${o().siteUrl}/blog`})),c.createElement(w,null,c.createElement(_,null,c.createElement("div",{className:"posts"},c.createElement(T,{className:"small-title wavy"},"Featured"===s?"Recent":"Featured"," Posts"),c.createElement(b,null,c.createElement(M,{onClick:()=>{"Featured"===s?(u("Recent"),d(l.allMarkdownRemark.edges),console.log(i)):(d(i.filter((e=>{let{node:t}=e;return!0===t.frontmatter.featured}))),console.log(i),u("Featured"))}},s)),i.length>0&&p.map(((e,t)=>{let{node:l}=e;const{frontmatter:a,timeToRead:n,excerpt:o}=l,{title:i,slug:d,date:s,tags:g}=a,u=new Date(s);return c.createElement(C,{key:t,tabIndex:"0"},c.createElement(x,null,c.createElement("header",null,c.createElement(r.Link,{to:d},c.createElement(k,null,c.createElement(I,null)),c.createElement(N,null,c.createElement(v,null,`📅 ${u.toLocaleDateString("en-us",B)}`),c.createElement(S,null,`⏱️ ${n} min read`)),c.createElement($,null,i),c.createElement(F,null,o))),c.createElement("footer",null,c.createElement(R,null,g.map(((e,t)=>c.createElement("li",{key:t},c.createElement(r.Link,{to:`/blog/tags/${m()(e)}/`},"#",e))))))))})),c.createElement(b,null,c.createElement(P,{onClick:()=>{f(i.slice(0,p.length+4))}},"Show More"))),c.createElement(h,null,c.createElement("h1",{className:"small-text"},"Tags"),c.createElement("ul",{className:"fancy-list"},y.map((e=>c.createElement("li",{key:e.fieldValue},c.createElement(r.Link,{to:`/blog/tags/${m()(e.fieldValue)}/`},e.fieldValue," ",c.createElement("span",{className:"count"},"(",e.totalCount,")"))))),c.createElement(E,{to:"/blog/tags"},"All Tags"))))))}}}]);
//# sourceMappingURL=component---src-pages-blog-index-js-79717eca3740c1a0377c.js.map