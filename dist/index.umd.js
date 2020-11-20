(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.TreeArray = {}));
}(this, (function (exports) { 'use strict';

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

    /** Tree Class（树类）*/
    var Tree = /** @class */ (function () {
        /**
         * Tree class constructor（树构造函数）
         * @param data Tree structure data or flat tree structure data（树形结构数据或扁平的树形结构数据）
         * @param options Tree options（树选项配置）
         */
        function Tree(data, options) {
            this.options = __assign(__assign({}, Tree.defaultOptions), options);
            this.data = (options === null || options === void 0 ? void 0 : options.parent) ? Tree.toTreeData(data, this.options) : data;
        }
        /**
         * Flat array conversion tree array（扁平数组转换树数组）
         * @param list Flat array（扁平数组）
         * @param options Tree options（树选项配置）
         */
        Tree.toTreeData = function (list, options) {
            var id = options.id, parent = options.parent, children = options.children;
            var result = list.reduce(function (map, item) { return ((map[item[id]] = item), (item[children] = []), map); }, {});
            return list.filter(function (item) {
                result[item[parent]] && result[item[parent]].children.push(item);
                return !item[parent];
            });
        };
        /**
         * Determine node has children（判断节点是否有子节点）
         * @param node Node object（节点）
         */
        Tree.prototype.hasChildren = function (node) {
            return Array.isArray(node[this.options.children]) && node[this.options.children].length > 0;
        };
        /**
         * Tree node traversal（树节点遍历）
         * @param callback Tree node callback function（节点回调函数）
         */
        Tree.prototype.forEach = function (callback, path) {
            var _this = this;
            if (path === void 0) { path = { indexPath: [], itemPath: [] }; }
            this.data.forEach(function (item, index) {
                try {
                    path.indexPath.push(index);
                    path.itemPath.push(item);
                    callback.call(_this, item, __assign({}, path), _this.data);
                    _this.hasChildren(item) && new Tree(item[_this.options.children], _this.options).forEach(callback, path);
                }
                catch (error) {
                    throw error;
                }
                finally {
                    path.indexPath.pop();
                    path.itemPath.pop();
                }
            });
        };
        /**
         * Tree node mapping（树节点映射转换）
         * @param callback Tree node callback function（节点回调函数）
         */
        Tree.prototype.map = function (callback, path) {
            var _this = this;
            if (path === void 0) { path = { indexPath: [], itemPath: [] }; }
            return this.data.map(function (item, index) {
                try {
                    path.indexPath.push(index);
                    path.itemPath.push(item);
                    _this.hasChildren(item) &&
                        (item[_this.options.children] = new Tree(item[_this.options.children], _this.options).map(callback, path));
                    return callback.call(_this, item, __assign({}, path), _this.data);
                }
                catch (error) {
                    throw error;
                }
                finally {
                    path.indexPath.pop();
                    path.itemPath.pop();
                }
            });
        };
        /**
         * Tree node filter（树节点过滤）
         * @param callback Tree node callback function（节点回调函数）
         */
        Tree.prototype.filter = function (callback, path) {
            var _this = this;
            if (path === void 0) { path = { indexPath: [], itemPath: [] }; }
            return this.data.filter(function (item, index) {
                try {
                    path.indexPath.push(index);
                    path.itemPath.push(item);
                    _this.hasChildren(item) &&
                        (item[_this.options.children] = new Tree(item[_this.options.children], _this.options).filter(callback, path));
                    return callback.call(_this, item, __assign({}, path), _this.data);
                }
                catch (error) {
                    throw error;
                }
                finally {
                    path.indexPath.pop();
                    path.itemPath.pop();
                }
            });
        };
        /**
         * Find tree node（查找树节点）
         * @param callback Tree node callback function（节点回调函数）
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
         * If there are tree nodes that meet the conditions, it returns true, otherwise it returns false（如有满足条件的树节点则返回true，反之则返回false）
         * @param callback Tree node callback function（节点回调函数）
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
         * If all tree nodes meet the conditions, it returns true, otherwise it returns false（若所有树节点满足条件则返回true，反之则返回false）
         * @param callback Tree node callback function（节点回调函数）
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
         * Tree flattening（树扁平化）
         */
        Tree.prototype.flat = function () {
            var result = [];
            this.forEach(function (item) { return result.push(item); });
            return result;
        };
        /**
         * Tree data string representation（树数据字符串表示形式）
         */
        Tree.prototype.toString = function () {
            return JSON.stringify(this.data);
        };
        /** Tree default options（树默认选项配置） */
        Tree.defaultOptions = {
            id: 'id',
            parent: '',
            children: 'children',
        };
        return Tree;
    }());
    /**
     * Return a tree instance（返回一个树实例）
     * @param data Tree structure data or flat tree structure data（树形结构数据或扁平的树形结构数据）
     * @param options Tree options（树选项配置）
     */
    function tree(data, options) {
        return new Tree(data, options);
    }

    exports.Tree = Tree;
    exports.default = tree;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.umd.js.map
