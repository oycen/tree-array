# tree-array

A JavaScript tree array library, usage is similar to JavaScript Array built-in objects.

## Installing

Using npm:

```bash
npm install tree-array
```

Using bower:

```bash
bower install tree-array
```

Using yarn:

```bash
yarn add tree-array
```

## Basic Usage

Construct tree instance by tree data.

```javascript
import tree from 'tree-array';

const data = [
  {
    id: 1,
    name: '一级 1',
    children: [
      {
        id: 4,
        name: '二级 1-1',
        children: [
          { id: 9, name: '三级 1-1-1' },
          { id: 10, name: '三级 1-1-2' },
        ],
      },
    ],
  },
  {
    id: 2,
    name: '一级 2',
    children: [
      { id: 5, name: '二级 2-1' },
      { id: 6, name: '二级 2-2' },
    ],
  },
  {
    id: 3,
    name: '一级 3',
    children: [
      { id: 7, name: '二级 3-1' },
      { id: 8, name: '二级 3-2' },
    ],
  },
];

// Return a tree instance.
const dataTree = tree(data, {
  
  // unique identification property name of the tree node
  // is optional, default: 'id'
  id: 'id',
  
  // children node property name of the tree node
  // is optional, default: 'children'
  children: 'children'
});

```

Or construct tree instance by list data.

```javascript
import tree from 'tree-array';

const data = [
  { id: 1, name: '一级 1', parentId: null },
  { id: 4, name: '二级 1-1', parentId: 1 },
  { id: 9, name: '三级 1-1-1', parentId: 4 },
  { id: 10, name: '三级 1-1-2', parentId: 4 },
  { id: 2, name: '一级 2', parentId: null },
  { id: 5, name: '二级 2-1', parentId: 2 },
  { id: 6, name: '二级 2-2', parentId: 2 },
  { id: 3, name: '一级 3', parentId: null },
  { id: 7, name: '二级 3-1', parentId: 3 },
  { id: 8, name: '二级 3-2', parentId: 3 },
];

// Return a tree instance.
const dataTree = tree(data, {
  
  // parent node property name of the tree node
  // property value can be parent id or parent node
  // is required
  parent: 'children'
  
});

console.log(dataTree.data); // tree data;

```

### tree.forEach

```javascript
dataTree.forEach((node, path, tree) => {
  console.log(node.name); // current node
  console.log(path.indexPath); // current node index path
  console.log(path.nodePath); // current node path
  console.log(tree); // current tree
});

```

### tree.map

Note: If you want to recurse the entire tree, you need to return the children of the current node in the callback function.

```javascript
const mappedData = dataTree.map((node, { indexPath, nodePath }, tree) => {
  console.log(node.name); // current node
  console.log(indexPath); // current node index path
  console.log(nodePath); // current node path
  console.log(tree); // current tree

  return {
    ...node,
    level: indexPath.length,
    parentId: nodePath[nodePath.length - 2]?.id,
  };
});
  
console.log(mappedData);
// [
//   {
//     id: 1,
//     name: '一级 1',
//     children: [
//       {
//         id: 4,
//         name: '二级 1-1',
//         children: [
//           { id: 9, name: '三级 1-1-1', level: 3, parentId: 4 },
//           { id: 10, name: '三级 1-1-2', level: 3, parentId: 4 },
//         ],
//         level: 2,
//         parentId: 1,
//       },
//     ],
//     level: 1,
//     parentId: null,
//   },
//   {
//     id: 2,
//     name: '一级 2',
//     children: [
//       { id: 5, name: '二级 2-1', level: 2, parentId: 2 },
//       { id: 6, name: '二级 2-2', level: 2, parentId: 2 },
//     ],
//     level: 1,
//     parentId: null,
//   },
//   {
//     id: 3,
//     name: '一级 3',
//     children: [
//       { id: 7, name: '二级 3-1', level: 2, parentId: 3 },
//       { id: 8, name: '二级 3-2', level: 2, parentId: 3 },
//     ],
//     level: 1,
//     parentId: null,
//   },
// ]

```

### tree.filter

```javascript
const filteredData = dataTree.filter((node, path, tree) => {
  console.log(node.name); // current node
  console.log(path.indexPath); // current node index path
  console.log(path.nodePath); // current node path
  console.log(tree); // current tree

  return path.indexPath.length < 3; // less than the third level
});

console.log(filteredData);
// [
//   {
//     id: 1,
//     name: '一级 1',
//     children: [{ id: 4, name: '二级 1-1', children: [] }],
//   },
//   {
//     id: 2,
//     name: '一级 2',
//     children: [
//       { id: 5, name: '二级 2-1' },
//       { id: 6, name: '二级 2-2' },
//     ],
//   },
//   {
//     id: 3,
//     name: '一级 3',
//     children: [
//       { id: 7, name: '二级 3-1' },
//       { id: 8, name: '二级 3-2' },
//     ],
//   },
// ]

```

### tree.find

```javascript
const foundData = dataTree.find((node, path, tree) => {
  console.log(node.name); // current node
  console.log(path.indexPath); // current node index path
  console.log(path.nodePath); // current node path
  console.log(tree); // current tree

  return node.id === 8;
});

console.log(foundData);
// { id: 8, name: '二级 3-2' }

```

### tree.flat

```javascript
const flatedData = dataTree.flat();

console.log(flatedData);
// [
//   {
//     id: 1,
//     name: '一级 1',
//     parent: null,
//     path: [1],
//     level: 1,
//     hasChild: true,
//   },
//   {
//     id: 4,
//     name: '二级 1-1',
//     parent: { id: 1, name: '一级 1' },
//     path: [1, 4],
//     level: 2,
//     hasChild: true,
//   },
//   {
//     id: 9,
//     name: '三级 1-1-1',
//     parent: { id: 4, name: '二级 1-1' },
//     path: [1, 4, 9],
//     level: 3,
//     hasChild: false,
//   },
//   {
//     id: 10,
//     name: '三级 1-1-2',
//     parent: { id: 4, name: '二级 1-1' },
//     path: [1, 4, 10],
//     level: 3,
//     hasChild: false,
//   },
//   {
//     id: 2,
//     name: '一级 2',
//     parent: null,
//     path: [2],
//     level: 1,
//     hasChild: true,
//   },
//   {
//     id: 5,
//     name: '二级 2-1',
//     parent: { id: 2, name: '一级 2' },
//     path: [2, 5],
//     level: 2,
//     hasChild: false,
//   },
//   {
//     id: 6,
//     name: '二级 2-2',
//     parent: { id: 2, name: '一级 2' },
//     path: [2, 6],
//     level: 2,
//     hasChild: false,
//   },
//   {
//     id: 3,
//     name: '一级 3',
//     parent: null,
//     path: [3],
//     level: 1,
//     hasChild: true,
//   },
//   {
//     id: 7,
//     name: '二级 3-1',
//     parent: { id: 3, name: '一级 3' },
//     path: [3, 7],
//     level: 2,
//     hasChild: false,
//   },
//   {
//     id: 8,
//     name: '二级 3-2',
//     parent: { id: 3, name: '一级 3' },
//     path: [3, 8],
//     level: 2,
//     hasChild: false,
//   },
// ]

```

### tree.some

```javascript
const someFlag = dataTree.some((node, path, tree) => {
  console.log(node.name); // current node
  console.log(path.indexPath); // current node index path
  console.log(path.nodePath); // current node path
  console.log(tree); // current tree

  return node.name === '';
});

console.log(someFlag); // false

```

### tree.every

```javascript
const everyFlag = dataTree.every((node, path, tree) => {
  console.log(node.name); // current node
  console.log(path.indexPath); // current node index path
  console.log(path.nodePath); // current node path
  console.log(tree); // current tree

  return node.name !== '';
});

console.log(everyFlag); // true

```

