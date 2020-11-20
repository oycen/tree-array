export interface TreeOptions {
  id?: string;
  parent?: string;
  children?: string;
}

export class Tree<T extends object> {
  private static readonly defaultOptions: Required<TreeOptions> = {
    id: 'id',
    parent: 'parent',
    children: 'children',
  };

  private options: Required<TreeOptions>;

  data: T[];

  constructor(data: T[], options?: TreeOptions) {
    this.data = data;
    this.options = { ...Tree.defaultOptions, ...options };
  }

  hasChildren(item: any) {
    return Array.isArray(item[this.options.children]);
  }

  forEach(
    callback: (this: Tree<T>, value: T, path: { indexPath: number[]; itemPath: T[] }, tree: T[]) => void,
    path: { indexPath: number[]; itemPath: T[] } = { indexPath: [], itemPath: [] }
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

  map<U>(
    callback: (this: Tree<T>, value: T, path: { indexPath: number[]; itemPath: T[] }, tree: T[]) => U,
    path: { indexPath: number[]; itemPath: T[] } = { indexPath: [], itemPath: [] }
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

  filter(
    callback: (this: Tree<T>, value: T, path: { indexPath: number[]; itemPath: T[] }, tree: T[]) => unknown,
    path: { indexPath: number[]; itemPath: T[] } = { indexPath: [], itemPath: [] }
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

  find(callback: (this: Tree<T>, value: T, path: { indexPath: number[]; itemPath: T[] }, tree: T[]) => unknown) {
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

  some(callback: (this: Tree<T>, value: T, path: { indexPath: number[]; itemPath: T[] }, tree: T[]) => unknown) {
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

  every(callback: (this: Tree<T>, value: T, path: { indexPath: number[]; itemPath: T[] }, tree: T[]) => unknown) {
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

  flat() {
    const result: T[] = [];
    this.forEach((item) => result.push(item));
    return result;
  }

  toString() {
    return JSON.stringify(this.data);
  }
}

export default function tree<T extends object>(data: T[], options?: TreeOptions) {
  return new Tree(data, options);
}
