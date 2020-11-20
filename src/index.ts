/** Tree options interface（树选项配置）*/
export interface TreeOptions {
  /** Unique identification property name of the tree node（树节点的唯一标识属性名称） */
  id?: string;
  /** Parent node property name of the tree node（树节点的父节点属性名称） */
  parent?: string;
  /** Children node property name of the tree node（树节点的子节点属性名称） */
  children?: string;
}

/** 节点路径 */
interface NodePath<T> {
  /** Node index path（节点索引路径） */
  indexPath: number[];
  /** Node path（节点路径） */
  itemPath: T[];
}

/** Tree Class（树类）*/
export class Tree<T extends object> {
  /** Tree default options（树默认选项配置） */
  private static readonly defaultOptions: Required<TreeOptions> = {
    id: 'id',
    parent: 'parent',
    children: 'children',
  };

  /** Tree options（树选项配置） */
  private options: Required<TreeOptions>;

  /** Tree data（树数据） */
  data: T[];

  /**
   * Tree class constructor（树构造函数）
   * @param data Tree structure data or flat tree structure data（树形结构数据或扁平的树形结构数据）
   * @param options Tree options（树选项配置）
   */
  constructor(data: T[], options?: TreeOptions) {
    this.data = data;
    this.options = { ...Tree.defaultOptions, ...options };
  }

  /**
   * Determine node has children（判断节点是否有子节点）
   * @param node Node object（节点）
   */
  hasChildren(node: any) {
    return Array.isArray(node[this.options.children]) && node[this.options.children].length > 0;
  }

  /**
   * Tree node traversal（树节点遍历）
   * @param callback Tree node callback function（节点回调函数）
   */
  forEach(
    callback: (this: Tree<T>, node: T, path: NodePath<T>, tree: T[]) => void,
    path: NodePath<T> = { indexPath: [], itemPath: [] }
  ) {
    this.data.forEach((item: any, index) => {
      try {
        path.indexPath.push(index);
        path.itemPath.push(item);
        callback.call(this, item, { ...path }, this.data);
        this.hasChildren(item) && new Tree<T>(item[this.options.children], this.options).forEach(callback, path);
      } catch (error) {
        throw error;
      } finally {
        path.indexPath.pop();
        path.itemPath.pop();
      }
    });
  }

  /**
   * Tree node mapping（树节点映射转换）
   * @param callback Tree node callback function（节点回调函数）
   */
  map<U>(
    callback: (this: Tree<T>, node: T, path: NodePath<T>, tree: T[]) => U,
    path: NodePath<T> = { indexPath: [], itemPath: [] }
  ) {
    return this.data.map((item: any, index) => {
      try {
        path.indexPath.push(index);
        path.itemPath.push(item);
        this.hasChildren(item) &&
          (item[this.options.children] = new Tree<T>(item[this.options.children], this.options).map(callback, path));
        return callback.call(this, item, { ...path }, this.data);
      } catch (error) {
        throw error;
      } finally {
        path.indexPath.pop();
        path.itemPath.pop();
      }
    });
  }

  /**
   * Tree node filter（树节点过滤）
   * @param callback Tree node callback function（节点回调函数）
   */
  filter(
    callback: (this: Tree<T>, node: T, path: NodePath<T>, tree: T[]) => unknown,
    path: NodePath<T> = { indexPath: [], itemPath: [] }
  ) {
    return this.data.filter((item: any, index) => {
      try {
        path.indexPath.push(index);
        path.itemPath.push(item);
        this.hasChildren(item) &&
          (item[this.options.children] = new Tree<T>(item[this.options.children], this.options).filter(callback, path));
        return callback.call(this, item, { ...path }, this.data);
      } catch (error) {
        throw error;
      } finally {
        path.indexPath.pop();
        path.itemPath.pop();
      }
    });
  }

  /**
   * Find tree node（查找树节点）
   * @param callback Tree node callback function（节点回调函数）
   */
  find(callback: (this: Tree<T>, node: T, path: NodePath<T>, tree: T[]) => unknown) {
    let result: T | undefined;
    try {
      this.forEach((item, path, tree) => {
        if (callback.call(this, item, { ...path }, tree)) result = item;
        if (result) throw new Error('StopIteration');
      });
    } catch (error) {
      if (error.message !== 'StopIteration') throw error;
    } finally {
      return result;
    }
  }

  /**
   * If there are tree nodes that meet the conditions, it returns true, otherwise it returns false（如有满足条件的树节点则返回true，反之则返回false）
   * @param callback Tree node callback function（节点回调函数）
   */
  some(callback: (this: Tree<T>, node: T, path: NodePath<T>, tree: T[]) => unknown) {
    let result: Boolean = false;
    try {
      this.forEach((item, path, tree) => {
        if (callback.call(this, item, { ...path }, tree)) result = true;
        if (result) throw new Error('StopIteration');
      });
    } catch (error) {
      if (error.message !== 'StopIteration') throw error;
    } finally {
      return result;
    }
  }

  /**
   * If all tree nodes meet the conditions, it returns true, otherwise it returns false（若所有树节点满足条件则返回true，反之则返回false）
   * @param callback Tree node callback function（节点回调函数）
   */
  every(callback: (this: Tree<T>, node: T, path: NodePath<T>, tree: T[]) => unknown) {
    let result: Boolean = true;
    try {
      this.forEach((item, path, tree) => {
        if (!callback.call(this, item, { ...path }, tree)) result = false;
        if (!result) throw new Error('StopIteration');
      });
    } catch (error) {
      if (error.message !== 'StopIteration') throw error;
    } finally {
      return result;
    }
  }

  /**
   * 树扁平化
   */
  flat() {
    const result: T[] = [];
    this.forEach((item) => result.push(item));
    return result;
  }

  /**
   * Tree data string representation（树数据字符串表示形式）
   */
  toString() {
    return JSON.stringify(this.data);
  }
}

/**
 * Return a tree instance（返回一个树实例）
 * @param data Tree structure data or flat tree structure data（树形结构数据或扁平的树形结构数据）
 * @param options Tree options（树选项配置）
 */
export default function tree<T extends object>(data: T[], options?: TreeOptions) {
  return new Tree(data, options);
}
