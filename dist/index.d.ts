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
declare class Tree<T extends object> {
    /** Tree default options */
    private static readonly defaultOptions;
    /** Tree options */
    private options;
    /**
     * Flat array conversion tree array
     * @param list Flat array
     * @param options Tree options
     */
    static toTreeData<T extends object>(list: T[], options: Required<TreeOptions>): T[];
    /** Tree data */
    data: T[];
    /**
     * Tree class constructor
     * @param data Tree structure data or flat tree structure data
     * @param options Tree options
     */
    constructor(data: T[], options?: TreeOptions);
    /**
     * Determine node has children
     * @param node Node object
     */
    hasChildren(node: any): boolean;
    /**
     * Tree node traversal
     * @param callback Tree node callback function
     */
    forEach(callback: (this: Tree<T>, node: T, path: NodePath<T>, tree: T[]) => void, path?: NodePath<T>): void;
    /**
     * Tree node mapping
     * @param callback Tree node callback function
     */
    map<U>(callback: (this: Tree<T>, node: T, path: NodePath<T>, tree: T[]) => U, path?: NodePath<T>): U[];
    /**
     * Tree node filter
     * @param callback Tree node callback function
     */
    filter(callback: (this: Tree<T>, node: T, path: NodePath<T>, tree: T[]) => unknown, path?: NodePath<T>): T[];
    /**
     * Find tree node
     * @param callback Tree node callback function
     */
    find(callback: (this: Tree<T>, node: T, path: NodePath<T>, tree: T[]) => unknown): T | undefined;
    /**
     * Tree flattening
     */
    flat(): T[];
    /**
     * If there are tree nodes that meet the conditions, it returns true, otherwise it returns false
     * @param callback Tree node callback function
     */
    some(callback: (this: Tree<T>, node: T, path: NodePath<T>, tree: T[]) => unknown): Boolean;
    /**
     * If all tree nodes meet the conditions, it returns true, otherwise it returns false
     * @param callback Tree node callback function
     */
    every(callback: (this: Tree<T>, node: T, path: NodePath<T>, tree: T[]) => unknown): Boolean;
    /**
     * Tree data string representation
     */
    toString(): string;
}
/**
 * Return a tree instance
 * @param data Tree structure data or flat tree structure data
 * @param options Tree options
 */
export default function tree<T extends object>(data: T[], options?: TreeOptions): Tree<T>;
export {};
