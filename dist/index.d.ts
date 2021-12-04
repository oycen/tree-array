export interface TreeOptions {
    id?: string;
    children?: string;
}
export interface NodePath<T> {
    indexPath: number[];
    nodePath: T[];
}
declare class Tree<T extends object> {
    private static readonly defaultTreeOptions;
    private data;
    private options;
    constructor(data: T[], options?: TreeOptions);
    private hasChildren;
    forEach(callback: (node: T, path: NodePath<T>, tree: T[]) => void | "continue" | "break", _path?: NodePath<T>): void;
    map<U>(callback: (node: T, path: NodePath<T>, tree: T[]) => U, _path?: NodePath<T>): (U | undefined)[];
    filter(callback: (node: T, path: NodePath<T>, tree: T[]) => unknown, _path?: NodePath<T>): T[];
}
export declare function tree<T extends object>(data: T[], options?: TreeOptions): Tree<T>;
export {};
