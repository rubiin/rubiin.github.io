"use strict";(self.webpackChunkrubiin_github_io=self.webpackChunkrubiin_github_io||[]).push([[334],{7264:function(e,t,a){a.r(t);var l=a(2485),n=a(4479),o=a.n(n),i=a(2722),r=a(8667),d=a(8721),s=a.n(d),m=a(758),c=a(9633),g=a(6709),u=a(449);const{colors:p,fontSizes:f,fonts:y}=i.w4,h=g.default.div.withConfig({displayName:"blog__StyledTagsContainer",componentId:"sc-41y2at-0"})(["width:200px;margin-top:100px;",";",";"],i.$_.bigDesktop`display:none;`,i.$_.phablet`display: none;`),w=(0,g.default)(i.gZ).withConfig({displayName:"blog__StyledMainContainer",componentId:"sc-41y2at-1"})(["& > header{text-align:center;margin-bottom:100px;a{&:hover,&:focus{cursor:url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='48' viewport='0 0 100 100' style='fill:black;font-size:24px;'><text y='50%'>⚡</text></svg>\") 20 0,auto;}}}footer{",";margin-top:20px;width:100%;justify-content:flex-end;}"],i.vE.flexBetween),_=g.default.div.withConfig({displayName:"blog__StyledButtonContainer",componentId:"sc-41y2at-2"})(["margin:0 auto;display:flex;justify-content:center;align-items:center;"]),x=g.default.div.withConfig({displayName:"blog__StyledFlex",componentId:"sc-41y2at-3"})(["margin-top:20px;display:flex;width:inherit;gap:10%;justify-content:space-around;.posts{display:flex;flex-direction:column;width:80%;gap:0.5rem;}"]),b=g.default.div.withConfig({displayName:"blog__StyledPostInner",componentId:"sc-41y2at-4"})(["",";",";flex-direction:column;align-items:flex-start;position:relative;padding:2rem 1.75rem;height:100%;border-radius:",";transition:",";background-color:",";header,a{width:100%;}"],i.vE.boxShadow,i.vE.flexBetween,i.w4.borderRadius,i.w4.transition,p.lightNavy),E=(0,g.default)(r.Link).withConfig({displayName:"blog__StyledAllCategory",componentId:"sc-41y2at-5"})(["padding:1rem;"]),C=g.default.div.withConfig({displayName:"blog__StyledPost",componentId:"sc-41y2at-6"})(["transition:",";cursor:default;&:hover,&:focus{outline:0;","{transform:translateY(-5px);}}"],i.w4.transition,b),v=g.default.span.withConfig({displayName:"blog__StyledReadingTime",componentId:"sc-41y2at-7"})(["font-family:",";font-size:",";color:",";"],y.SFMono,f.smish,p.lightSlate),S=(0,g.default)(v).withConfig({displayName:"blog__StyledDate",componentId:"sc-41y2at-8"})(["text-transform:uppercase;"]),N=g.default.div.withConfig({displayName:"blog__StyledReadingTimeContainer",componentId:"sc-41y2at-9"})(["margin-bottom:1rem;display:flex;align-items:center;margin-top:10px;justify-content:space-between;"]),k=g.default.div.withConfig({displayName:"blog__StyledPostHeader",componentId:"sc-41y2at-10"})(["",";margin-bottom:30px;"],i.vE.flexBetween),I=g.default.div.withConfig({displayName:"blog__StyledFolder",componentId:"sc-41y2at-11"})(["color:",";svg{width:40px;height:40px;}"],p.green),$=g.default.h5.withConfig({displayName:"blog__StyledPostName",componentId:"sc-41y2at-12"})(["margin:0 0 10px;font-size:",";color:",";"],f.xxl,p.lightestSlate),F=g.default.div.withConfig({displayName:"blog__StyledPostDescription",componentId:"sc-41y2at-13"})(["font-size:17px;color:",";"],p.lightSlate),R=g.default.div.withConfig({displayName:"blog__StyledTags",componentId:"sc-41y2at-14"})(["display:flex;flex-wrap:wrap;a{",";}"],i.vE.inlineLink),P=(0,g.default)(i.$n).withConfig({displayName:"blog__StyledToggleButton",componentId:"sc-41y2at-15"})(["padding:0.5rem 0.7rem;margin:0.4rem;"]),B=(0,g.default)(i.$n).withConfig({displayName:"blog__StyledMoreButton",componentId:"sc-41y2at-16"})(["margin:40px 0;padding:1.25rem 10rem;",";",";",";"],i.$_.thone`padding:1.25rem 6rem;`,i.$_.thone`padding:1.25rem 4rem;`,i.$_.tiny`padding:1.25rem 4rem;`),L=g.default.h1.withConfig({displayName:"blog__StyledLatestPostHeader",componentId:"sc-41y2at-17"})(["margin:0  auto;margin-bottom:1rem;}"]);t.default=e=>{let{location:t,data:a}=e;const n=a.allMarkdownRemark.group,i=a.allMarkdownRemark.edges,{0:d,1:g}=(0,m.useState)("Featured"),{0:p,1:f}=(0,m.useState)(i.slice(0,4)),y=n.sort(((e,t)=>t.totalCount-e.totalCount)).slice(0,5),M={year:"numeric",month:"short",day:"numeric"};return m.createElement(l.PE,{location:t},m.createElement(c.m,null,m.createElement("title",null,"Blog | ",o().name),m.createElement("link",{rel:"canonical",href:`${o().siteUrl}/blog`})),m.createElement(w,null,m.createElement(x,null,m.createElement("div",{className:"posts"},m.createElement(L,{className:"small-title wavy"},"Featured"===d?"Recent":"Featured"," Posts"),m.createElement(_,null,m.createElement(P,{onClick:()=>{"Featured"===d?(g("Recent"),f(i.filter((e=>{let{node:t}=e;return t.frontmatter.featured})).slice(0,4))):(f(i.slice(0,4)),g("Featured"))}},d)),i.length>0&&p.map(((e,t)=>{let{node:a}=e;const{frontmatter:l,timeToRead:n,excerpt:o}=a,{title:i,slug:d,date:s,tags:c}=l,g=new Date(s);return m.createElement(C,{key:t,tabIndex:"0"},m.createElement(b,null,m.createElement("header",null,m.createElement(r.Link,{to:d},m.createElement(k,null,m.createElement(I,null)),m.createElement(N,null,m.createElement(S,null,`📆 ${g.toLocaleDateString("en-us",M)}`),m.createElement(v,null,`⏱️ ${n} min read`)),m.createElement($,null,i),m.createElement(F,null,o))),m.createElement("footer",null,m.createElement(R,null,c.map(((e,t)=>m.createElement(u.A,{key:t,text:e})))))))})),m.createElement(_,null,m.createElement(B,{onClick:()=>{f("Featured"===d?i.slice(0,p.length+4):i.filter((e=>{let{node:t}=e;return!0===t.frontmatter.featured})).slice(0,p.length+4))}},"Show More"))),m.createElement(h,null,m.createElement("h2",{className:"small-text"},"Read more on"),m.createElement("ul",{className:"fancy-list"},y.map((e=>m.createElement("li",{key:e.fieldValue},m.createElement(r.Link,{to:`/blog/tags/${s()(e.fieldValue)}/`},e.fieldValue," ",m.createElement("span",{className:"count"},"(",e.totalCount,")"))))),m.createElement(E,{to:"/blog/tags"},"All tags"))))))}}}]);
//# sourceMappingURL=component---src-pages-blog-index-js-703cf744a13be8da68d9.js.map