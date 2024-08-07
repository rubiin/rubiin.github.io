"use strict";
exports.id = 480;
exports.ids = [480];
exports.modules = {

/***/ 9789:
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
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(9849);
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4088);
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5337);
const{colors}=_styles__WEBPACK_IMPORTED_MODULE_3__/* .theme */ .w4;const StyledPostContainer=(0,styled_components__WEBPACK_IMPORTED_MODULE_5__["default"])(_styles__WEBPACK_IMPORTED_MODULE_3__/* .Main */ .gZ).withConfig({displayName:"post__StyledPostContainer",componentId:"sc-e001fa-0"})(["max-width:1000px;"]);const StyledPostHeader=styled_components__WEBPACK_IMPORTED_MODULE_5__["default"].header.withConfig({displayName:"post__StyledPostHeader",componentId:"sc-e001fa-1"})(["margin-bottom:50px;.tag{margin-right:10px;}"]);const StyledPostContent=styled_components__WEBPACK_IMPORTED_MODULE_5__["default"].div.withConfig({displayName:"post__StyledPostContent",componentId:"sc-e001fa-2"})(["margin-bottom:100px;h1,h2,h3,h4,h5,h6{margin:2em 0 1em;}p{margin:1em 0;line-height:1.5;color:",";}"],colors.lightSlate);const PostTemplate=({data,location})=>{const{frontmatter,html}=data.markdownRemark;const{title,date,tags}=frontmatter;return/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components__WEBPACK_IMPORTED_MODULE_4__/* .Layout */ .PE,{location:location},/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(StyledPostContainer,null,/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span",{className:"breadcrumb"},/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span",{className:"arrow"},"\u2190"),/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(gatsby__WEBPACK_IMPORTED_MODULE_1__.Link,{to:"/blog"},"All posts")),/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(StyledPostHeader,null,/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h1",{className:"medium-title"},title),/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p",{className:"subtitle"},/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("time",null,new Date(date).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})),/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span",null,"\xA0\u2014\xA0"),tags&&tags.length>0&&tags.map((tag,i)=>/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(gatsby__WEBPACK_IMPORTED_MODULE_1__.Link,{key:i,to:`/blog/tags/${lodash_kebabCase__WEBPACK_IMPORTED_MODULE_2___default()(tag)}/`,className:"tag"},"#",tag)))),/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(StyledPostContent,{dangerouslySetInnerHTML:{__html:html}})));};/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PostTemplate);PostTemplate.propTypes={data:(prop_types__WEBPACK_IMPORTED_MODULE_6___default().object),location:(prop_types__WEBPACK_IMPORTED_MODULE_6___default().object)};const pageQuery="527986723";

/***/ })

};
;
//# sourceMappingURL=component---src-templates-post-js.js.map