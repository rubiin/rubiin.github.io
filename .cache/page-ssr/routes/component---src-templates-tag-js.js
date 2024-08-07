"use strict";
exports.id = 502;
exports.ids = [502];
exports.modules = {

/***/ 2743:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(429);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var gatsby__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2446);
/* harmony import */ var lodash_kebabCase__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8721);
/* harmony import */ var lodash_kebabCase__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash_kebabCase__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(2736);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5337);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(9849);
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(4088);
const{colors,fontSizes}=_styles__WEBPACK_IMPORTED_MODULE_4__/* .theme */ .w4;const StyledTagsContainer=(0,styled_components__WEBPACK_IMPORTED_MODULE_5__["default"])(_styles__WEBPACK_IMPORTED_MODULE_4__/* .Main */ .gZ).withConfig({displayName:"tag__StyledTagsContainer",componentId:"sc-go14ot-0"})(["max-width:1000px;a{",";}h1{",";margin-bottom:50px;a{font-size:",";font-weight:400;}}ul{li{font-size:24px;h2{font-size:inherit;margin:0;a{color:",";}}.subtitle{color:",";font-size:",";.tag{margin-right:5px;}}}}"],_styles__WEBPACK_IMPORTED_MODULE_4__/* .mixins */ .vE.inlineLink,_styles__WEBPACK_IMPORTED_MODULE_4__/* .mixins */ .vE.flexBetween,fontSizes.lg,colors.lightSlate,colors.slate,fontSizes.sm);const TagTemplate=({pageContext,data,location})=>{const{tag}=pageContext;const{edges}=data.allMarkdownRemark;return/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components__WEBPACK_IMPORTED_MODULE_3__/* .Layout */ .PE,{location:location},/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(StyledTagsContainer,null,/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span",{className:"breadcrumb"},/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span",{className:"arrow"},"\u2190"),/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(gatsby__WEBPACK_IMPORTED_MODULE_1__.Link,{to:"/blog"},"All posts")),/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h1",null,/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span",null,"#",tag),/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span",null,/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(gatsby__WEBPACK_IMPORTED_MODULE_1__.Link,{to:"/blog/tags"},"View all tags"))),/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul",{className:"fancy-list"},edges.map(({node})=>{const{title,slug,date,tags}=node.frontmatter;return/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li",{key:slug},/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h2",null,/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(gatsby__WEBPACK_IMPORTED_MODULE_1__.Link,{to:slug},title)),/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p",{className:"subtitle"},/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("time",null,new Date(date).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})),/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span",null,"\xA0\u2014\xA0"),tags&&tags.length>0&&tags.map((tag,i)=>/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(gatsby__WEBPACK_IMPORTED_MODULE_1__.Link,{key:i,to:`/blog/tags/${lodash_kebabCase__WEBPACK_IMPORTED_MODULE_2___default()(tag)}/`,className:"tag"},"#",tag))));}))));};/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TagTemplate);TagTemplate.propTypes={pageContext:prop_types__WEBPACK_IMPORTED_MODULE_6___default().shape({tag:(prop_types__WEBPACK_IMPORTED_MODULE_6___default().string).isRequired}),data:prop_types__WEBPACK_IMPORTED_MODULE_6___default().shape({allMarkdownRemark:prop_types__WEBPACK_IMPORTED_MODULE_6___default().shape({totalCount:(prop_types__WEBPACK_IMPORTED_MODULE_6___default().number).isRequired,edges:prop_types__WEBPACK_IMPORTED_MODULE_6___default().arrayOf(prop_types__WEBPACK_IMPORTED_MODULE_6___default().shape({node:prop_types__WEBPACK_IMPORTED_MODULE_6___default().shape({frontmatter:prop_types__WEBPACK_IMPORTED_MODULE_6___default().shape({title:(prop_types__WEBPACK_IMPORTED_MODULE_6___default().string).isRequired})})}).isRequired)})}),location:(prop_types__WEBPACK_IMPORTED_MODULE_6___default().object)};const pageQuery="1917135829";

/***/ })

};
;
//# sourceMappingURL=component---src-templates-tag-js.js.map