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
        this.data = data;
        this.options = __assign(__assign({}, Tree.defaultOptions), options);
    }
    Tree.prototype.hasChildren = function (item) {
        return Array.isArray(item[this.options.children]);
    };
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
    Tree.prototype.flat = function () {
        var result = [];
        this.forEach(function (item) { return result.push(item); });
        return result;
    };
    Tree.prototype.toString = function () {
        return JSON.stringify(this.data);
    };
    Tree.defaultOptions = {
        id: 'id',
        parent: 'parent',
        children: 'children',
    };
    return Tree;
}());
function tree(data, options) {
    return new Tree(data, options);
}

export default tree;
export { Tree };
//# sourceMappingURL=index.es.js.map
