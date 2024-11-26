var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
/* eslint-disable */
// @ts-nocheck
/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */
import humanize from 'ms';
function setup(env) {
    return __awaiter(this, void 0, void 0, function () {
        /**
         * Selects a color for a debug namespace
         * @param {String} namespace The namespace string for the debug instance to be colored
         * @return {Number|String} An ANSI color code for the given namespace
         * @api private
         */
        function selectColor(namespace) {
            var hash = 0;
            for (var i = 0; i < namespace.length; i++) {
                hash = (hash << 5) - hash + namespace.charCodeAt(i);
                hash |= 0; // Convert to 32bit integer
            }
            return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
        }
        /**
         * Create a debugger with the given `namespace`.
         *
         * @param {String} namespace
         * @return {Function}
         * @api public
         */
        function createDebug(namespace) {
            var prevTime;
            var enableOverride = null;
            var namespacesCache;
            var enabledCache;
            function debug() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                // Disabled?
                if (!debug.enabled) {
                    return;
                }
                var self = debug;
                // Set `diff` timestamp
                var curr = Number(new Date());
                var ms = curr - (prevTime || curr);
                self.diff = ms;
                self.prev = prevTime;
                self.curr = curr;
                prevTime = curr;
                args[0] = createDebug.coerce(args[0]);
                if (typeof args[0] !== 'string') {
                    // Anything else let's inspect with %O
                    args.unshift('%O');
                }
                // Apply any `formatters` transformations
                var index = 0;
                args[0] = args[0].replace(/%([a-zA-Z%])/g, function (match, format) {
                    // If we encounter an escaped % then don't increase the array index
                    if (match === '%%') {
                        return '%';
                    }
                    index++;
                    var formatter = createDebug.formatters[format];
                    if (typeof formatter === 'function') {
                        var val = args[index];
                        match = formatter.call(self, val);
                        // Now we need to remove `args[index]` since it's inlined in the `format`
                        args.splice(index, 1);
                        index--;
                    }
                    return match;
                });
                // Apply env-specific formatting (colors, etc.)
                createDebug.formatArgs.call(self, args);
                var logFn = self.log || createDebug.log;
                logFn.apply(self, args);
            }
            debug.namespace = namespace;
            debug.useColors = createDebug.useColors();
            debug.color = createDebug.selectColor(namespace);
            debug.extend = extend;
            debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.
            Object.defineProperty(debug, 'enabled', {
                enumerable: true,
                configurable: false,
                get: function () {
                    if (enableOverride !== null) {
                        return enableOverride;
                    }
                    if (namespacesCache !== createDebug.namespaces) {
                        namespacesCache = createDebug.namespaces;
                        enabledCache = createDebug.enabled(namespace);
                    }
                    return enabledCache;
                },
                set: function (v) {
                    enableOverride = v;
                },
            });
            // Env-specific initialization logic for debug instances
            if (typeof createDebug.init === 'function') {
                createDebug.init(debug);
            }
            return debug;
        }
        function extend(namespace, delimiter) {
            var newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
            newDebug.log = this.log;
            return newDebug;
        }
        /**
         * Enables a debug mode by namespaces. This can include modes
         * separated by a colon and wildcards.
         *
         * @param {String} namespaces
         * @api public
         */
        function enable(namespaces) {
            return __awaiter(this, void 0, void 0, function () {
                var i, split, len;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, createDebug.save(namespaces)];
                        case 1:
                            _a.sent();
                            createDebug.namespaces = namespaces;
                            createDebug.names = [];
                            createDebug.skips = [];
                            split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
                            len = split.length;
                            for (i = 0; i < len; i++) {
                                if (!split[i]) {
                                    // ignore empty strings
                                    continue;
                                }
                                namespaces = split[i].replace(/\*/g, '.*?');
                                if (namespaces[0] === '-') {
                                    createDebug.skips.push(new RegExp("^".concat(namespaces.substr(1), "$")));
                                }
                                else {
                                    createDebug.names.push(new RegExp("^".concat(namespaces, "$")));
                                }
                            }
                            return [2 /*return*/];
                    }
                });
            });
        }
        /**
         * Disable debug output.
         *
         * @return {String} namespaces
         * @api public
         */
        function disable() {
            var namespaces = __spreadArray(__spreadArray([], createDebug.names.map(toNamespace), true), createDebug.skips.map(toNamespace).map(function (namespace) { return "-".concat(namespace); }), true).join(',');
            createDebug.enable('');
            return namespaces;
        }
        /**
         * Returns true if the given mode name is enabled, false otherwise.
         *
         * @param {String} name
         * @return {Boolean}
         * @api public
         */
        function enabled(name) {
            if (name[name.length - 1] === '*') {
                return true;
            }
            var i;
            var len;
            for (i = 0, len = createDebug.skips.length; i < len; i++) {
                if (createDebug.skips[i].test(name)) {
                    return false;
                }
            }
            for (i = 0, len = createDebug.names.length; i < len; i++) {
                if (createDebug.names[i].test(name)) {
                    return true;
                }
            }
            return false;
        }
        /**
         * Convert regexp to namespace
         *
         * @param {RegExp} regxep
         * @return {String} namespace
         * @api private
         */
        function toNamespace(regexp) {
            return regexp
                .toString()
                .substring(2, regexp.toString().length - 2)
                .replace(/\.\*\?$/, '*');
        }
        /**
         * Coerce `val`.
         *
         * @param {Mixed} val
         * @return {Mixed}
         * @api private
         */
        function coerce(val) {
            if (val instanceof Error) {
                return val.stack || val.message;
            }
            return val;
        }
        /**
         * XXX DO NOT USE. This is a temporary stub function.
         * XXX It WILL be removed in the next major release.
         */
        function destroy() {
            console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
        }
        var config;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    createDebug.debug = createDebug;
                    createDebug.default = createDebug;
                    createDebug.coerce = coerce;
                    createDebug.disable = disable;
                    createDebug.enable = enable;
                    createDebug.enabled = enabled;
                    createDebug.humanize = humanize;
                    createDebug.destroy = destroy;
                    Object.keys(env).forEach(function (key) {
                        createDebug[key] = env[key];
                    });
                    /**
                     * The currently active debug mode names, and names to skip.
                     */
                    createDebug.names = [];
                    createDebug.skips = [];
                    /**
                     * Map of special "%n" handling functions, for the debug "format" argument.
                     *
                     * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
                     */
                    createDebug.formatters = {
                        /**
                         * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
                         */
                        j: function (v) {
                            try {
                                return JSON.stringify(v);
                            }
                            catch (error) {
                                return "[UnexpectedJSONParseError]: ".concat(error.message);
                            }
                        },
                    };
                    createDebug.selectColor = selectColor;
                    return [4 /*yield*/, createDebug.load()];
                case 1:
                    config = _a.sent();
                    return [4 /*yield*/, createDebug.enable(config)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, createDebug];
            }
        });
    });
}
export default setup;
