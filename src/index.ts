import clonedeep from "lodash.clonedeep";

export interface TreeOptions {
  id?: string;
  children?: string;
}

export interface NodePath<T> {
  indexPath: number[];
  nodePath: T[];
}

class Tree<T extends object> {
  private static readonly defaultTreeOptions: Required<TreeOptions> = {
    id: "id",
    children: "children",
  };

  private data: T[];
  private options: Required<TreeOptions>;

  constructor(data: T[], options?: TreeOptions) {
    this.options = Object.assign({}, Tree.defaultTreeOptions, options);
    this.data = data;
  }

  private hasChildren(node: any) {
    return Array.isArray(node[this.options.children]) && node[this.options.children].length > 0;
  }

  forEach(
    callback: (node: T, path: NodePath<T>, tree: T[]) => void | "continue" | "break",
    _path: NodePath<T> = { indexPath: [], nodePath: [] }
  ) {
    for (let index = 0; index < this.data.length; index++) {
      try {
        const item: any = this.data[index];

        _path.indexPath.push(index);
        _path.nodePath.push(item);

        const flag = callback.call(null, item, { ..._path }, this.data);
        if (flag === "continue") break;
        if (flag === "break") break;

        if (!this.hasChildren(item)) return;
        new Tree<T>(item[this.options.children], this.options).forEach(callback, _path);
      } catch (error: any) {
        throw error;
      } finally {
        _path.indexPath.pop();
        _path.nodePath.pop();
      }
    }
  }

  map<U>(callback: (node: T, path: NodePath<T>, tree: T[]) => U, _path: NodePath<T> = { indexPath: [], nodePath: [] }) {
    const data = clonedeep(this.data);

    return data.map((item: any, index) => {
      try {
        _path.indexPath.push(index);
        _path.nodePath.push(item);

        if (!this.hasChildren(item)) return;

        item[this.options.children] = new Tree<T>(item[this.options.children], this.options).map(callback, _path);
        return callback.call(null, item, { ..._path }, data);
      } catch (error) {
        throw error;
      } finally {
        _path.indexPath.pop();
        _path.nodePath.pop();
      }
    });
  }

  filter(
    callback: (node: T, path: NodePath<T>, tree: T[]) => unknown,
    _path: NodePath<T> = { indexPath: [], nodePath: [] }
  ) {
    const data = clonedeep(this.data)

    return data.filter((item: any, index) => {
      try {
        _path.indexPath.push(index);
        _path.nodePath.push(item);

        if (!this.hasChildren(item)) return;

        item[this.options.children] = new Tree<T>(item[this.options.children], this.options).filter(callback, _path);
        return callback.call(null, item, { ..._path }, data);
      } catch (error) {
        throw error;
      } finally {
        _path.indexPath.pop();
        _path.nodePath.pop();
      }
    });
  }
}

export default function tree<T extends object>(data: T[], options?: TreeOptions) {
  return new Tree(data, options);
}
