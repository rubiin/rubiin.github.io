"use strict";
exports.id = 815;
exports.ids = [815];
exports.modules = {

/***/ 916:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(429);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_helmet__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9633);
/* harmony import */ var gatsby__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2446);
/* harmony import */ var lodash_kebabCase__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8721);
/* harmony import */ var lodash_kebabCase__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash_kebabCase__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(2736);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5337);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(9849);
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(4088);
const{colors,fontSizes,fonts}=_styles__WEBPACK_IMPORTED_MODULE_5__/* .theme */ .w4;const StyledTagsContainer=(0,styled_components__WEBPACK_IMPORTED_MODULE_6__["default"])(_styles__WEBPACK_IMPORTED_MODULE_5__/* .Main */ .gZ).withConfig({displayName:"tags__StyledTagsContainer",componentId:"sc-1jpemnd-0"})(["max-width:1000px;h1{margin-bottom:50px;}ul{color:",";li{font-size:",";a{",";color:",";.count{color:",";font-family:",";font-size:",";}}}}"],colors.lightSlate,fontSizes.xxl,_styles__WEBPACK_IMPORTED_MODULE_5__/* .mixins */ .vE.inlineLink,colors.lightSlate,colors.slate,fonts.SFMono,fontSizes.md);const TagsPage=({data:{allMarkdownRemark:{group},site:{siteMetadata:{title}}},location})=>{const sortTags=group.sort((a,b)=>{return b.totalCount-a.totalCount;});return/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components__WEBPACK_IMPORTED_MODULE_4__/* .Layout */ .PE,{location:location},/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_helmet__WEBPACK_IMPORTED_MODULE_1__.Helmet,{title:title}),/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(StyledTagsContainer,null,/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span",{className:"breadcrumb"},/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span",{className:"arrow"},"\u2190"),/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(gatsby__WEBPACK_IMPORTED_MODULE_2__.Link,{to:"/blog"},"All posts")),/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h1",null,"Tags"),/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul",{className:"fancy-list"},sortTags.map(tag=>/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li",{key:tag.fieldValue},/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(gatsby__WEBPACK_IMPORTED_MODULE_2__.Link,{to:`/blog/tags/${lodash_kebabCase__WEBPACK_IMPORTED_MODULE_3___default()(tag.fieldValue)}/`},tag.fieldValue," ",/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span",{className:"count"},"(",tag.totalCount,")")))))));};TagsPage.propTypes={data:prop_types__WEBPACK_IMPORTED_MODULE_7___default().shape({allMarkdownRemark:prop_types__WEBPACK_IMPORTED_MODULE_7___default().shape({group:prop_types__WEBPACK_IMPORTED_MODULE_7___default().arrayOf(prop_types__WEBPACK_IMPORTED_MODULE_7___default().shape({fieldValue:(prop_types__WEBPACK_IMPORTED_MODULE_7___default().string).isRequired,totalCount:(prop_types__WEBPACK_IMPORTED_MODULE_7___default().number).isRequired}).isRequired)}),site:prop_types__WEBPACK_IMPORTED_MODULE_7___default().shape({siteMetadata:prop_types__WEBPACK_IMPORTED_MODULE_7___default().shape({title:(prop_types__WEBPACK_IMPORTED_MODULE_7___default().string).isRequired})})}),location:(prop_types__WEBPACK_IMPORTED_MODULE_7___default().object)};/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TagsPage);const pageQuery="209688594";

/***/ })

};
;
//# sourceMappingURL=component---src-pages-blog-tags-js.js.map