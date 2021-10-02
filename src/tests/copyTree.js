import {trees} from "../fixtures/doc-trees/index.js";
import {bfsTraverseTree, dfsTraverseTree, showQueue} from './traverseTree.js'

let newTree = undefined;
let parentsQueue = [];
let lastNewNode = undefined;
let lastParent = undefined;

dfsTraverseTree(trees[5], (node) => {
  console.log('visiting: ', node.name);

  const newNode = {name: node.name, children: []}

  if (!newTree && !node.parent) {
    newTree = newNode;
    return;
  }

  // case 1: if last of parent's queue is current node.parent then we populating siblings under one parent (do nothing)
  if (parentsQueue[parentsQueue.length - 1] !== node.parent) {
    // case 2: if second to last in pQueue is current node.parent then we stepping back (remove parent from pQueue)
    if (parentsQueue[parentsQueue.length - 2] === node.parent) {
      parentsQueue.pop();
    } else {
      // case 3: if none of previous cases then we stepping down (add new parent to pQueue)
      parentsQueue.push(node.parent);
    }
  }

  console.log('pQueue ', showQueue(parentsQueue));
  console.log('node.parent', node.parent.name);

  const currentParent = parentsQueue[parentsQueue.length - 1];

  // Find parent node to attach
  // todo: Looks like newTree could also use the same kind of parentQueue
  //  in order to cache all tree cases of traverse movement:
  //  1. new node located under the same parent (same 'lastParent')
  //  2. new node located under the very last node (step down into 'lastNewNode' children)
  //  3. new node located under the very last node grandparent (step up from 'lastNewNode' parent)

  // Cache cases when next node is child or prev parent (step down the tree)
  console.log('lastParent', lastParent?.name);
  if (lastNewNode?.name === currentParent.name) {
    console.log('*** lastNewNode cache found', lastNewNode.name);
    lastNewNode.children.push(newNode);
    lastParent = lastNewNode;
    lastNewNode = newNode;
    return;
  }

  // Cache cases when next node is sibling under the common parent
  if (lastParent?.name === currentParent.name) {
    console.log('&&& lastParent cache found', lastParent.name);
    lastParent.children.push(newNode);
    // lastParent stays the same
    // lastGrandParent stays the same
    lastNewNode = newNode;
    return;
  }

  // Find parent node by bfsTraverseTree
  let cnt = 0;
  bfsTraverseTree(newTree, (newTreeNode, escape) => {
    cnt++;
    console.log('!!! cnt', cnt);
    if (newTreeNode.name === currentParent.name) {
      newTreeNode.children.push(newNode);
      lastNewNode = newNode;
      lastParent = newTreeNode;
      escape.stop = true;
    }
  });

  // console.log('parent', parentsQueue[parentsQueue.length - 1]?.name);
});

// Clean up tree from parent tags
dfsTraverseTree(newTree, (newTreeNode) => {
  delete newTreeNode.parent
});

const result = JSON.stringify(newTree)
console.log('\n result tree', result);

const controlString_05 = '{"name":"root","children":[{"name":"viewport","children":[{"name":"memo 1.1","children":[]},{"name":"group 1.2","children":[{"name":"memo 1.2.1","children":[]},{"name":"memo 1.2.2","children":[]},{"name":"memo 1.2.3","children":[]}]},{"name":"memo 1.3","children":[]},{"name":"group 1.4","children":[{"name":"memo 1.4.1","children":[]},{"name":"memo 1.4.2","children":[]}]},{"name":"memo 1.5","children":[]}]},{"name":"webUi","children":[{"name":"button 1","children":[]},{"name":"button 2","children":[]},{"name":"button 3","children":[]}]}]}';

console.log('Control test: ', result === controlString_05);
