/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/home.js":
/*!*********************!*\
  !*** ./src/home.js ***!
  \*********************/
/***/ (() => {

eval("function pfp_square() {\r\n    const profile = document.getElementById('image_02');\r\n    const height = profile.offsetHeight;\r\n    profile.style.width = `${height}px`;\r\n}\r\nwindow.addEventListener('load', pfp_square);\r\nwindow.addEventListener('resize', pfp_square);\r\n\r\ndocument.getElementById(\"reaction_start\").addEventListener('click', () => {\r\n    window.open(\"../reaction/index.html\", \"_self\")\r\n})\r\ndocument.getElementById(\"problem_start\").addEventListener('click', () => {\r\n    window.open(\"../problem/index.html\", \"_self\")\r\n})\r\ndocument.getElementById(\"attention_start\").addEventListener('click', () => {\r\n    window.open(\"../attention/index.html\", \"_self\")\r\n})\r\ndocument.getElementById(\"memory_start\").addEventListener('click', () => {\r\n    window.open(\"../memory/index.html\", \"_self\")\r\n})\r\n\r\n\r\ndocument.getElementById(\"profile\").addEventListener(\"click\", () => {\r\n    window.open(\"../profile/index.html\", \"_self\")\r\n})\n\n//# sourceURL=webpack://agglomeration/./src/home.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/home.js"]();
/******/ 	
/******/ })()
;