var TreeArray = (function (clonedeep) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var clonedeep__default = /*#__PURE__*/_interopDefaultLegacy(clonedeep);

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

    var Tree = /** @class */ (function () {
        function Tree(data, options) {
            this.options = Object.assign({}, Tree.defaultTreeOptions, options);
            this.data = data;
        }
        Tree.prototype.hasChildren = function (node) {
            return Array.isArray(node[this.options.children]) && node[this.options.children].length > 0;
        };
        Tree.prototype.forEach = function (callback, _path) {
            if (_path === void 0) { _path = { indexPath: [], nodePath: [] }; }
            for (var index = 0; index < this.data.length; index++) {
                try {
                    var item = this.data[index];
                    _path.indexPath.push(index);
                    _path.nodePath.push(item);
                    var flag = callback.call(null, item, __assign({}, _path), this.data);
                    if (flag === false)
                        break;
                    if (this.hasChildren(item)) {
                        new Tree(item[this.options.children], this.options).forEach(callback, _path);
                    }
                }
                catch (error) {
                    throw error;
                }
                finally {
                    _path.indexPath.pop();
                    _path.nodePath.pop();
                }
            }
        };
        Tree.prototype.map = function (callback, _path) {
            var _this = this;
            if (_path === void 0) { _path = { indexPath: [], nodePath: [] }; }
            var data = clonedeep__default["default"](this.data);
            return data.map(function (item, index) {
                try {
                    _path.indexPath.push(index);
                    _path.nodePath.push(item);
                    if (!_this.hasChildren(item))
                        return callback.call(null, item, __assign({}, _path), data);
                    item[_this.options.children] = new Tree(item[_this.options.children], _this.options).map(callback, _path);
                    return callback.call(null, item, __assign({}, _path), data);
                }
                catch (error) {
                    throw error;
                }
                finally {
                    _path.indexPath.pop();
                    _path.nodePath.pop();
                }
            });
        };
        Tree.prototype.filter = function (callback, _path) {
            var _this = this;
            if (_path === void 0) { _path = { indexPath: [], nodePath: [] }; }
            var data = clonedeep__default["default"](this.data);
            return data.filter(function (item, index) {
                try {
                    _path.indexPath.push(index);
                    _path.nodePath.push(item);
                    if (!_this.hasChildren(item))
                        return callback.call(null, item, __assign({}, _path), data);
                    item[_this.options.children] = new Tree(item[_this.options.children], _this.options).filter(callback, _path);
                    return callback.call(null, item, __assign({}, _path), data);
                }
                catch (error) {
                    throw error;
                }
                finally {
                    _path.indexPath.pop();
                    _path.nodePath.pop();
                }
            });
        };
        Tree.defaultTreeOptions = {
            id: "id",
            children: "children",
        };
        return Tree;
    }());
    function tree(data, options) {
        return new Tree(data, options);
    }

    return tree;

})(clonedeep);
