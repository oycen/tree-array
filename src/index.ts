/** Tree options interface */
export interface TreeOptions {
  /** Unique identification property name of the tree node */
  id?: string;
  /** Parent node property name of the tree node */
  parent?: string;
  /** Children node property name of the tree node */
  children?: string;
}

/** Node path */
export interface NodePath<T> {
  /** Node index path */
  indexPath: number[];
  /** Node path */
  nodePath: T[];
}

/** Tree Class */
class Tree<T extends object> {
  /** Tree default options */
  private static readonly defaultOptions: Required<TreeOptions> = {
    id: "id",
    parent: "",
    children: "children",
  };

  /** Tree options */
  private options: Required<TreeOptions>;

  /**
   * Flat array conversion tree array
   * @param list Flat array
   * @param options Tree options
   */
  static toTreeData<T extends object>(list: T[], options: Required<TreeOptions>) {
    const { id, parent, children } = options;
    let result = list.reduce((map: any, item: any) => ((map[item[id]] = item), (item[children] = []), map), {});
    return list.filter((item: any) => {
      if (Object.prototype.toString.call(item[parent]) === "[object Object]") {
        result[item[parent][id]] && result[item[parent][id]].children.push(item);
        return !item[parent][id];
      } else {
        result[item[parent]] && result[item[parent]].children.push(item);
        return !item[parent];
      }
    });
  }

  /** Tree data */
  data: T[];

  /**
   * Tree class constructor
   * @param data Tree structure data or flat tree structure data
   * @param options Tree options
   */
  constructor(data: T[], options?: TreeOptions) {
    this.options = { ...Tree.defaultOptions, ...options };
    this.data = options?.parent ? Tree.toTreeData(data, this.options) : data;
  }

  /**
   * Determine node has children
   * @param node Node object
   */
  hasChildren(node: any) {
    return Array.isArray(node[this.options.children]) && node[this.options.children].length > 0;
  }

  /**
   * Tree node traversal
   * @param callback Tree node callback function
   */
  forEach(
    callback: (this: Tree<T>, node: T, path: NodePath<T>, tree: T[]) => void,
    path: NodePath<T> = { indexPath: [], nodePath: [] }
  ) {
    this.data.forEach((item: any, index) => {
      try {
        path.indexPath.push(index);
        path.nodePath.push(item);
        callback.call(this, item, { ...path }, this.data);
        this.hasChildren(item) &&
          new Tree<T>(item[this.options.children], {
            id: this.options.id,
            children: this.options.children,
          }).forEach(callback, path);
      } catch (error) {
        throw error;
      } finally {
        path.indexPath.pop();
        path.nodePath.pop();
      }
    });
  }

  /**
   * Tree node mapping
   * @param callback Tree node callback function
   */
  map<U>(
    callback: (this: Tree<T>, node: T, path: NodePath<T>, tree: T[]) => U,
    path: NodePath<T> = { indexPath: [], nodePath: [] }
  ) {
    return this.data.map((item: any, index) => {
      try {
        path.indexPath.push(index);
        path.nodePath.push(item);
        this.hasChildren(item) &&
          (item[this.options.children] = new Tree<T>(item[this.options.children], {
            id: this.options.id,
            children: this.options.children,
          }).map(callback, path));
        return callback.call(this, item, { ...path }, this.data);
      } catch (error) {
        throw error;
      } finally {
        path.indexPath.pop();
        path.nodePath.pop();
      }
    });
  }

  /**
   * Tree node filter
   * @param callback Tree node callback function
   */
  filter(
    callback: (this: Tree<T>, node: T, path: NodePath<T>, tree: T[]) => unknown,
    path: NodePath<T> = { indexPath: [], nodePath: [] }
  ) {
    return this.data.filter((item: any, index) => {
      try {
        path.indexPath.push(index);
        path.nodePath.push(item);
        this.hasChildren(item) &&
          (item[this.options.children] = new Tree<T>(item[this.options.children], {
            id: this.options.id,
            children: this.options.children,
          }).filter(callback, path));
        return callback.call(this, item, { ...path }, this.data);
      } catch (error) {
        throw error;
      } finally {
        path.indexPath.pop();
        path.nodePath.pop();
      }
    });
  }

  /**
   * Find tree node
   * @param callback Tree node callback function
   */
  find(callback: (this: Tree<T>, node: T, path: NodePath<T>, tree: T[]) => unknown) {
    let result: T | undefined;
    try {
      this.forEach((item, path, tree) => {
        if (callback.call(this, item, { ...path }, tree)) result = item;
        if (result) throw new Error("StopIteration");
      });
    } catch (error: any) {
      if (error.message !== "StopIteration") throw error;
    } finally {
      return result;
    }
  }

  /**
   * Tree flattening
   */
  flat() {
    const result: T[] = [];
    this.forEach((item: any, { nodePath }) => {
      const data = { ...item };

      data.parent = nodePath[nodePath.length - 2] ?? null;

      data.path = nodePath.map((item: any) => item[this.options.id]);
      data.level = nodePath.length;
      data.hasChild = this.hasChildren(data);

      result.push(data);
    });
    return result;
  }

  /**
   * If there are tree nodes that meet the conditions, it returns true, otherwise it returns false
   * @param callback Tree node callback function
   */
  some(callback: (this: Tree<T>, node: T, path: NodePath<T>, tree: T[]) => unknown) {
    let result: Boolean = false;
    try {
      this.forEach((item, path, tree) => {
        if (callback.call(this, item, { ...path }, tree)) result = true;
        if (result) throw new Error("StopIteration");
      });
    } catch (error: any) {
      if (error.message !== "StopIteration") throw error;
    } finally {
      return result;
    }
  }

  /**
   * If all tree nodes meet the conditions, it returns true, otherwise it returns false
   * @param callback Tree node callback function
   */
  every(callback: (this: Tree<T>, node: T, path: NodePath<T>, tree: T[]) => unknown) {
    let result: Boolean = true;
    try {
      this.forEach((item, path, tree) => {
        if (!callback.call(this, item, { ...path }, tree)) result = false;
        if (!result) throw new Error("StopIteration");
      });
    } catch (error: any) {
      if (error.message !== "StopIteration") throw error;
    } finally {
      return result;
    }
  }

  /**
   * Tree data string representation
   */
  toString() {
    return JSON.stringify(this.data);
  }
}

/**
 * Return a tree instance
 * @param data Tree structure data or flat tree structure data
 * @param options Tree options
 */
export default function tree<T extends object>(data: T[], options?: TreeOptions) {
  return new Tree(data, options);
}
