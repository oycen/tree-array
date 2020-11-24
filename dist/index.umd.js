(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.TreeArray = factory());
}(this, (function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    /** Tree Class */
    var Tree = /** @class */ (function () {
        /**
         * Tree class constructor
         * @param data Tree structure data or flat tree structure data
         * @param options Tree options
         */
        function Tree(data, options) {
            this.options = __assign(__assign({}, Tree.defaultOptions), options);
            this.data = (options === null || options === void 0 ? void 0 : options.parent) ? Tree.toTreeData(data, this.options) : data;
        }
        /**
         * Flat array conversion tree array
         * @param list Flat array
         * @param options Tree options
         */
        Tree.toTreeData = function (list, options) {
            var id = options.id, parent = options.parent, children = options.children;
            var result = list.reduce(function (map, item) { return ((map[item[id]] = item), (item[children] = []), map); }, {});
            return list.filter(function (item) {
                if (Object.prototype.toString.call(item[parent]) === '[object Object]') {
                    result[item[parent][id]] && result[item[parent][id]].children.push(item);
                    return !item[parent][id];
                }
                else {
                    result[item[parent]] && result[item[parent]].children.push(item);
                    return !item[parent];
                }
            });
        };
        /**
         * Determine node has children
         * @param node Node object
         */
        Tree.prototype.hasChildren = function (node) {
            return Array.isArray(node[this.options.children]) && node[this.options.children].length > 0;
        };
        /**
         * Tree node traversal
         * @param callback Tree node callback function
         */
        Tree.prototype.forEach = function (callback, path) {
            var _this = this;
            if (path === void 0) { path = { indexPath: [], nodePath: [] }; }
            this.data.forEach(function (item, index) {
                try {
                    path.indexPath.push(index);
                    path.nodePath.push(item);
                    callback.call(_this, item, __assign({}, path), _this.data);
                    _this.hasChildren(item) &&
                        new Tree(item[_this.options.children], {
                            id: _this.options.id,
                            children: _this.options.children,
                        }).forEach(callback, path);
                }
                catch (error) {
                    throw error;
                }
                finally {
                    path.indexPath.pop();
                    path.nodePath.pop();
                }
            });
        };
        /**
         * Tree node mapping
         * @param callback Tree node callback function
         */
        Tree.prototype.map = function (callback, path) {
            var _this = this;
            if (path === void 0) { path = { indexPath: [], nodePath: [] }; }
            return this.data.map(function (item, index) {
                try {
                    path.indexPath.push(index);
                    path.nodePath.push(item);
                    _this.hasChildren(item) &&
                        (item[_this.options.children] = new Tree(item[_this.options.children], {
                            id: _this.options.id,
                            children: _this.options.children,
                        }).map(callback, path));
                    return callback.call(_this, item, __assign({}, path), _this.data);
                }
                catch (error) {
                    throw error;
                }
                finally {
                    path.indexPath.pop();
                    path.nodePath.pop();
                }
            });
        };
        /**
         * Tree node filter
         * @param callback Tree node callback function
         */
        Tree.prototype.filter = function (callback, path) {
            var _this = this;
            if (path === void 0) { path = { indexPath: [], nodePath: [] }; }
            return this.data.filter(function (item, index) {
                try {
                    path.indexPath.push(index);
                    path.nodePath.push(item);
                    _this.hasChildren(item) &&
                        (item[_this.options.children] = new Tree(item[_this.options.children], {
                            id: _this.options.id,
                            children: _this.options.children,
                        }).filter(callback, path));
                    return callback.call(_this, item, __assign({}, path), _this.data);
                }
                catch (error) {
                    throw error;
                }
                finally {
                    path.indexPath.pop();
                    path.nodePath.pop();
                }
            });
        };
        /**
         * Find tree node
         * @param callback Tree node callback function
         */
        Tree.prototype.find = function (callback) {
            var _this = this;
            var result;
            try {
                this.forEach(function (item, path, tree) {
                    if (callback.call(_this, item, __assign({}, path), tree))
                        result = item;
                    if (result)
                        throw new Error('StopIteration');
                });
            }
            catch (error) {
                if (error.message !== 'StopIteration')
                    throw error;
            }
            finally {
                return result;
            }
        };
        /**
         * Tree flattening
         */
        Tree.prototype.flat = function () {
            var _this = this;
            var result = [];
            this.forEach(function (item, _a) {
                var _b;
                var nodePath = _a.nodePath;
                var data = __assign({}, item);
                delete data[_this.options.children];
                data.parent = (_b = nodePath[nodePath.length - 2]) !== null && _b !== void 0 ? _b : null;
                data.parent && delete data.parent[_this.options.children];
                data.path = nodePath.map(function (item) { return item[_this.options.id]; });
                data.level = nodePath.length;
                data.hasChild = _this.hasChildren(item);
                result.push(data);
            });
            return result;
        };
        /**
         * If there are tree nodes that meet the conditions, it returns true, otherwise it returns false
         * @param callback Tree node callback function
         */
        Tree.prototype.some = function (callback) {
            var _this = this;
            var result = false;
            try {
                this.forEach(function (item, path, tree) {
                    if (callback.call(_this, item, __assign({}, path), tree))
                        result = true;
                    if (result)
                        throw new Error('StopIteration');
                });
            }
            catch (error) {
                if (error.message !== 'StopIteration')
                    throw error;
            }
            finally {
                return result;
            }
        };
        /**
         * If all tree nodes meet the conditions, it returns true, otherwise it returns false
         * @param callback Tree node callback function
         */
        Tree.prototype.every = function (callback) {
            var _this = this;
            var result = true;
            try {
                this.forEach(function (item, path, tree) {
                    if (!callback.call(_this, item, __assign({}, path), tree))
                        result = false;
                    if (!result)
                        throw new Error('StopIteration');
                });
            }
            catch (error) {
                if (error.message !== 'StopIteration')
                    throw error;
            }
            finally {
                return result;
            }
        };
        /**
         * Tree data string representation
         */
        Tree.prototype.toString = function () {
            return JSON.stringify(this.data);
        };
        /** Tree default options */
        Tree.defaultOptions = {
            id: 'id',
            parent: '',
            children: 'children',
        };
        return Tree;
    }());
    /**
     * Return a tree instance
     * @param data Tree structure data or flat tree structure data
     * @param options Tree options
     */
    function tree(data, options) {
        return new Tree(data, options);
    }

    return tree;

})));
