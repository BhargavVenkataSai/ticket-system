/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./contexts/AuthContext.tsx":
/*!**********************************!*\
  !*** ./contexts/AuthContext.tsx ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AuthProvider: () => (/* binding */ AuthProvider),\n/* harmony export */   useAuth: () => (/* binding */ useAuth)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/router */ \"./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nconst AuthContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(undefined);\nconst useAuth = ()=>{\n    const context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(AuthContext);\n    if (context === undefined) {\n        throw new Error(\"useAuth must be used within an AuthProvider\");\n    }\n    return context;\n};\nconst AuthProvider = ({ children })=>{\n    const [user, setUser] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [token, setToken] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_2__.useRouter)();\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        // Check for stored token on app load\n        const storedToken = localStorage.getItem(\"token\");\n        const storedUser = localStorage.getItem(\"user\");\n        if (storedToken && storedUser) {\n            setToken(storedToken);\n            setUser(JSON.parse(storedUser));\n        }\n        setIsLoading(false);\n    }, []);\n    const login = async (username, password)=>{\n        try {\n            const response = await fetch(\"http://localhost:8080/api/auth/login\", {\n                method: \"POST\",\n                headers: {\n                    \"Content-Type\": \"application/json\"\n                },\n                body: JSON.stringify({\n                    username,\n                    password\n                })\n            });\n            if (!response.ok) {\n                const errorText = await response.text();\n                console.error(\"Login failed:\", response.status, errorText);\n                throw new Error(\"Login failed: \" + errorText);\n            }\n            const data = await response.json();\n            console.log(\"Login successful, received data:\", {\n                hasToken: !!data.token,\n                tokenLength: data.token?.length,\n                user: data.user\n            });\n            if (!data.token) {\n                throw new Error(\"No token received from server\");\n            }\n            setToken(data.token);\n            setUser(data.user);\n            localStorage.setItem(\"token\", data.token);\n            localStorage.setItem(\"user\", JSON.stringify(data.user));\n            console.log(\"Token stored in localStorage and state\");\n            router.push(\"/dashboard\");\n        } catch (error) {\n            console.error(\"Login error:\", error);\n            throw error;\n        }\n    };\n    const logout = ()=>{\n        setToken(null);\n        setUser(null);\n        localStorage.removeItem(\"token\");\n        localStorage.removeItem(\"user\");\n        router.push(\"/login\");\n    };\n    const value = {\n        user,\n        token,\n        login,\n        logout,\n        isLoading\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(AuthContext.Provider, {\n        value: value,\n        children: children\n    }, void 0, false, {\n        fileName: \"D:\\\\ticket-system\\\\frontend\\\\contexts\\\\AuthContext.tsx\",\n        lineNumber: 117,\n        columnNumber: 10\n    }, undefined);\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb250ZXh0cy9BdXRoQ29udGV4dC50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBTWU7QUFDeUI7QUFrQnhDLE1BQU1NLDRCQUFjTCxvREFBYUEsQ0FBOEJNO0FBRXhELE1BQU1DLFVBQVU7SUFDckIsTUFBTUMsVUFBVVAsaURBQVVBLENBQUNJO0lBQzNCLElBQUlHLFlBQVlGLFdBQVc7UUFDekIsTUFBTSxJQUFJRyxNQUFNO0lBQ2xCO0lBQ0EsT0FBT0Q7QUFDVCxFQUFFO0FBTUssTUFBTUUsZUFBNEMsQ0FBQyxFQUFFQyxRQUFRLEVBQUU7SUFDcEUsTUFBTSxDQUFDQyxNQUFNQyxRQUFRLEdBQUdYLCtDQUFRQSxDQUFjO0lBQzlDLE1BQU0sQ0FBQ1ksT0FBT0MsU0FBUyxHQUFHYiwrQ0FBUUEsQ0FBZ0I7SUFDbEQsTUFBTSxDQUFDYyxXQUFXQyxhQUFhLEdBQUdmLCtDQUFRQSxDQUFDO0lBQzNDLE1BQU1nQixTQUFTZCxzREFBU0E7SUFFeEJELGdEQUFTQSxDQUFDO1FBQ1IscUNBQXFDO1FBQ3JDLE1BQU1nQixjQUFjQyxhQUFhQyxPQUFPLENBQUM7UUFDekMsTUFBTUMsYUFBYUYsYUFBYUMsT0FBTyxDQUFDO1FBRXhDLElBQUlGLGVBQWVHLFlBQVk7WUFDN0JQLFNBQVNJO1lBQ1ROLFFBQVFVLEtBQUtDLEtBQUssQ0FBQ0Y7UUFDckI7UUFFQUwsYUFBYTtJQUNmLEdBQUcsRUFBRTtJQUVMLE1BQU1RLFFBQVEsT0FBT0MsVUFBa0JDO1FBQ3JDLElBQUk7WUFDRixNQUFNQyxXQUFXLE1BQU1DLE1BQU0sd0NBQXdDO2dCQUNuRUMsUUFBUTtnQkFDUkMsU0FBUztvQkFDUCxnQkFBZ0I7Z0JBQ2xCO2dCQUNBQyxNQUFNVCxLQUFLVSxTQUFTLENBQUM7b0JBQUVQO29CQUFVQztnQkFBUztZQUM1QztZQUVBLElBQUksQ0FBQ0MsU0FBU00sRUFBRSxFQUFFO2dCQUNoQixNQUFNQyxZQUFZLE1BQU1QLFNBQVNRLElBQUk7Z0JBQ3JDQyxRQUFRQyxLQUFLLENBQUMsaUJBQWlCVixTQUFTVyxNQUFNLEVBQUVKO2dCQUNoRCxNQUFNLElBQUkxQixNQUFNLG1CQUFtQjBCO1lBQ3JDO1lBRUEsTUFBTUssT0FBTyxNQUFNWixTQUFTYSxJQUFJO1lBQ2hDSixRQUFRSyxHQUFHLENBQUMsb0NBQW9DO2dCQUM5Q0MsVUFBVSxDQUFDLENBQUNILEtBQUsxQixLQUFLO2dCQUN0QjhCLGFBQWFKLEtBQUsxQixLQUFLLEVBQUUrQjtnQkFDekJqQyxNQUFNNEIsS0FBSzVCLElBQUk7WUFDakI7WUFFQSxJQUFJLENBQUM0QixLQUFLMUIsS0FBSyxFQUFFO2dCQUNmLE1BQU0sSUFBSUwsTUFBTTtZQUNsQjtZQUVBTSxTQUFTeUIsS0FBSzFCLEtBQUs7WUFDbkJELFFBQVEyQixLQUFLNUIsSUFBSTtZQUVqQlEsYUFBYTBCLE9BQU8sQ0FBQyxTQUFTTixLQUFLMUIsS0FBSztZQUN4Q00sYUFBYTBCLE9BQU8sQ0FBQyxRQUFRdkIsS0FBS1UsU0FBUyxDQUFDTyxLQUFLNUIsSUFBSTtZQUVyRHlCLFFBQVFLLEdBQUcsQ0FBQztZQUVaeEIsT0FBTzZCLElBQUksQ0FBQztRQUNkLEVBQUUsT0FBT1QsT0FBTztZQUNkRCxRQUFRQyxLQUFLLENBQUMsZ0JBQWdCQTtZQUM5QixNQUFNQTtRQUNSO0lBQ0Y7SUFFQSxNQUFNVSxTQUFTO1FBQ2JqQyxTQUFTO1FBQ1RGLFFBQVE7UUFDUk8sYUFBYTZCLFVBQVUsQ0FBQztRQUN4QjdCLGFBQWE2QixVQUFVLENBQUM7UUFDeEIvQixPQUFPNkIsSUFBSSxDQUFDO0lBQ2Q7SUFFQSxNQUFNRyxRQUFRO1FBQ1p0QztRQUNBRTtRQUNBVztRQUNBdUI7UUFDQWhDO0lBQ0Y7SUFFQSxxQkFBTyw4REFBQ1gsWUFBWThDLFFBQVE7UUFBQ0QsT0FBT0E7a0JBQVF2Qzs7Ozs7O0FBQzlDLEVBQUUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90aWNrZXQtc3lzdGVtLWZyb250ZW5kLy4vY29udGV4dHMvQXV0aENvbnRleHQudHN4PzZkODEiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7XHJcbiAgY3JlYXRlQ29udGV4dCxcclxuICB1c2VDb250ZXh0LFxyXG4gIHVzZVN0YXRlLFxyXG4gIHVzZUVmZmVjdCxcclxuICBSZWFjdE5vZGUsXHJcbn0gZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IHVzZVJvdXRlciB9IGZyb20gXCJuZXh0L3JvdXRlclwiO1xyXG5cclxuaW50ZXJmYWNlIFVzZXIge1xyXG4gIGlkOiBudW1iZXI7XHJcbiAgdXNlcm5hbWU6IHN0cmluZztcclxuICBmdWxsTmFtZTogc3RyaW5nO1xyXG4gIGVtYWlsOiBzdHJpbmc7XHJcbiAgcm9sZTogXCJVU0VSXCIgfCBcIlNVUFBPUlRfQUdFTlRcIiB8IFwiQURNSU5cIjtcclxufVxyXG5cclxuaW50ZXJmYWNlIEF1dGhDb250ZXh0VHlwZSB7XHJcbiAgdXNlcjogVXNlciB8IG51bGw7XHJcbiAgdG9rZW46IHN0cmluZyB8IG51bGw7XHJcbiAgbG9naW46ICh1c2VybmFtZTogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKSA9PiBQcm9taXNlPHZvaWQ+O1xyXG4gIGxvZ291dDogKCkgPT4gdm9pZDtcclxuICBpc0xvYWRpbmc6IGJvb2xlYW47XHJcbn1cclxuXHJcbmNvbnN0IEF1dGhDb250ZXh0ID0gY3JlYXRlQ29udGV4dDxBdXRoQ29udGV4dFR5cGUgfCB1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XHJcblxyXG5leHBvcnQgY29uc3QgdXNlQXV0aCA9ICgpID0+IHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChBdXRoQ29udGV4dCk7XHJcbiAgaWYgKGNvbnRleHQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKFwidXNlQXV0aCBtdXN0IGJlIHVzZWQgd2l0aGluIGFuIEF1dGhQcm92aWRlclwiKTtcclxuICB9XHJcbiAgcmV0dXJuIGNvbnRleHQ7XHJcbn07XHJcblxyXG5pbnRlcmZhY2UgQXV0aFByb3ZpZGVyUHJvcHMge1xyXG4gIGNoaWxkcmVuOiBSZWFjdE5vZGU7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBBdXRoUHJvdmlkZXI6IFJlYWN0LkZDPEF1dGhQcm92aWRlclByb3BzPiA9ICh7IGNoaWxkcmVuIH0pID0+IHtcclxuICBjb25zdCBbdXNlciwgc2V0VXNlcl0gPSB1c2VTdGF0ZTxVc2VyIHwgbnVsbD4obnVsbCk7XHJcbiAgY29uc3QgW3Rva2VuLCBzZXRUb2tlbl0gPSB1c2VTdGF0ZTxzdHJpbmcgfCBudWxsPihudWxsKTtcclxuICBjb25zdCBbaXNMb2FkaW5nLCBzZXRJc0xvYWRpbmddID0gdXNlU3RhdGUodHJ1ZSk7XHJcbiAgY29uc3Qgcm91dGVyID0gdXNlUm91dGVyKCk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICAvLyBDaGVjayBmb3Igc3RvcmVkIHRva2VuIG9uIGFwcCBsb2FkXHJcbiAgICBjb25zdCBzdG9yZWRUb2tlbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIik7XHJcbiAgICBjb25zdCBzdG9yZWRVc2VyID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ1c2VyXCIpO1xyXG5cclxuICAgIGlmIChzdG9yZWRUb2tlbiAmJiBzdG9yZWRVc2VyKSB7XHJcbiAgICAgIHNldFRva2VuKHN0b3JlZFRva2VuKTtcclxuICAgICAgc2V0VXNlcihKU09OLnBhcnNlKHN0b3JlZFVzZXIpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRJc0xvYWRpbmcoZmFsc2UpO1xyXG4gIH0sIFtdKTtcclxuXHJcbiAgY29uc3QgbG9naW4gPSBhc3luYyAodXNlcm5hbWU6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZykgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcImh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9hcGkvYXV0aC9sb2dpblwiLCB7XHJcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICB9LFxyXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgdXNlcm5hbWUsIHBhc3N3b3JkIH0pLFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcclxuICAgICAgICBjb25zdCBlcnJvclRleHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkxvZ2luIGZhaWxlZDpcIiwgcmVzcG9uc2Uuc3RhdHVzLCBlcnJvclRleHQpO1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkxvZ2luIGZhaWxlZDogXCIgKyBlcnJvclRleHQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICBjb25zb2xlLmxvZyhcIkxvZ2luIHN1Y2Nlc3NmdWwsIHJlY2VpdmVkIGRhdGE6XCIsIHsgXHJcbiAgICAgICAgaGFzVG9rZW46ICEhZGF0YS50b2tlbiwgXHJcbiAgICAgICAgdG9rZW5MZW5ndGg6IGRhdGEudG9rZW4/Lmxlbmd0aCxcclxuICAgICAgICB1c2VyOiBkYXRhLnVzZXIgXHJcbiAgICAgIH0pO1xyXG4gICAgICBcclxuICAgICAgaWYgKCFkYXRhLnRva2VuKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gdG9rZW4gcmVjZWl2ZWQgZnJvbSBzZXJ2ZXJcIik7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIHNldFRva2VuKGRhdGEudG9rZW4pO1xyXG4gICAgICBzZXRVc2VyKGRhdGEudXNlcik7XHJcblxyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInRva2VuXCIsIGRhdGEudG9rZW4pO1xyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInVzZXJcIiwgSlNPTi5zdHJpbmdpZnkoZGF0YS51c2VyKSk7XHJcbiAgICAgIFxyXG4gICAgICBjb25zb2xlLmxvZyhcIlRva2VuIHN0b3JlZCBpbiBsb2NhbFN0b3JhZ2UgYW5kIHN0YXRlXCIpO1xyXG5cclxuICAgICAgcm91dGVyLnB1c2goXCIvZGFzaGJvYXJkXCIpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgY29uc29sZS5lcnJvcihcIkxvZ2luIGVycm9yOlwiLCBlcnJvcik7XHJcbiAgICAgIHRocm93IGVycm9yO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IGxvZ291dCA9ICgpID0+IHtcclxuICAgIHNldFRva2VuKG51bGwpO1xyXG4gICAgc2V0VXNlcihudWxsKTtcclxuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwidG9rZW5cIik7XHJcbiAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcInVzZXJcIik7XHJcbiAgICByb3V0ZXIucHVzaChcIi9sb2dpblwiKTtcclxuICB9O1xyXG5cclxuICBjb25zdCB2YWx1ZSA9IHtcclxuICAgIHVzZXIsXHJcbiAgICB0b2tlbixcclxuICAgIGxvZ2luLFxyXG4gICAgbG9nb3V0LFxyXG4gICAgaXNMb2FkaW5nLFxyXG4gIH07XHJcblxyXG4gIHJldHVybiA8QXV0aENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfT57Y2hpbGRyZW59PC9BdXRoQ29udGV4dC5Qcm92aWRlcj47XHJcbn07XHJcbiJdLCJuYW1lcyI6WyJSZWFjdCIsImNyZWF0ZUNvbnRleHQiLCJ1c2VDb250ZXh0IiwidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJ1c2VSb3V0ZXIiLCJBdXRoQ29udGV4dCIsInVuZGVmaW5lZCIsInVzZUF1dGgiLCJjb250ZXh0IiwiRXJyb3IiLCJBdXRoUHJvdmlkZXIiLCJjaGlsZHJlbiIsInVzZXIiLCJzZXRVc2VyIiwidG9rZW4iLCJzZXRUb2tlbiIsImlzTG9hZGluZyIsInNldElzTG9hZGluZyIsInJvdXRlciIsInN0b3JlZFRva2VuIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsInN0b3JlZFVzZXIiLCJKU09OIiwicGFyc2UiLCJsb2dpbiIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJyZXNwb25zZSIsImZldGNoIiwibWV0aG9kIiwiaGVhZGVycyIsImJvZHkiLCJzdHJpbmdpZnkiLCJvayIsImVycm9yVGV4dCIsInRleHQiLCJjb25zb2xlIiwiZXJyb3IiLCJzdGF0dXMiLCJkYXRhIiwianNvbiIsImxvZyIsImhhc1Rva2VuIiwidG9rZW5MZW5ndGgiLCJsZW5ndGgiLCJzZXRJdGVtIiwicHVzaCIsImxvZ291dCIsInJlbW92ZUl0ZW0iLCJ2YWx1ZSIsIlByb3ZpZGVyIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./contexts/AuthContext.tsx\n");

/***/ }),

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _contexts_AuthContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../contexts/AuthContext */ \"./contexts/AuthContext.tsx\");\n/* harmony import */ var react_hot_toast__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-hot-toast */ \"react-hot-toast\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_3__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([react_hot_toast__WEBPACK_IMPORTED_MODULE_2__]);\nreact_hot_toast__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\n\nfunction App({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_contexts_AuthContext__WEBPACK_IMPORTED_MODULE_1__.AuthProvider, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                ...pageProps\n            }, void 0, false, {\n                fileName: \"D:\\\\ticket-system\\\\frontend\\\\pages\\\\_app.tsx\",\n                lineNumber: 9,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_hot_toast__WEBPACK_IMPORTED_MODULE_2__.Toaster, {\n                position: \"top-right\"\n            }, void 0, false, {\n                fileName: \"D:\\\\ticket-system\\\\frontend\\\\pages\\\\_app.tsx\",\n                lineNumber: 10,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"D:\\\\ticket-system\\\\frontend\\\\pages\\\\_app.tsx\",\n        lineNumber: 8,\n        columnNumber: 5\n    }, this);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUN1RDtBQUNiO0FBQ1g7QUFFaEIsU0FBU0UsSUFBSSxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBWTtJQUM1RCxxQkFDRSw4REFBQ0osK0RBQVlBOzswQkFDWCw4REFBQ0c7Z0JBQVcsR0FBR0MsU0FBUzs7Ozs7OzBCQUN4Qiw4REFBQ0gsb0RBQU9BO2dCQUFDSSxVQUFTOzs7Ozs7Ozs7Ozs7QUFHeEIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90aWNrZXQtc3lzdGVtLWZyb250ZW5kLy4vcGFnZXMvX2FwcC50c3g/MmZiZSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IEFwcFByb3BzIH0gZnJvbSBcIm5leHQvYXBwXCI7XHJcbmltcG9ydCB7IEF1dGhQcm92aWRlciB9IGZyb20gXCIuLi9jb250ZXh0cy9BdXRoQ29udGV4dFwiO1xyXG5pbXBvcnQgeyBUb2FzdGVyIH0gZnJvbSBcInJlYWN0LWhvdC10b2FzdFwiO1xyXG5pbXBvcnQgXCIuLi9zdHlsZXMvZ2xvYmFscy5jc3NcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH06IEFwcFByb3BzKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxBdXRoUHJvdmlkZXI+XHJcbiAgICAgIDxDb21wb25lbnQgey4uLnBhZ2VQcm9wc30gLz5cclxuICAgICAgPFRvYXN0ZXIgcG9zaXRpb249XCJ0b3AtcmlnaHRcIiAvPlxyXG4gICAgPC9BdXRoUHJvdmlkZXI+XHJcbiAgKTtcclxufVxyXG4iXSwibmFtZXMiOlsiQXV0aFByb3ZpZGVyIiwiVG9hc3RlciIsIkFwcCIsIkNvbXBvbmVudCIsInBhZ2VQcm9wcyIsInBvc2l0aW9uIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-dom");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ }),

/***/ "react-hot-toast":
/*!**********************************!*\
  !*** external "react-hot-toast" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = import("react-hot-toast");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("./pages/_app.tsx")));
module.exports = __webpack_exports__;

})();