import {trees} from "../fixtures/doc-trees/index.js";

export function showQueue(q) {
  let line = '[';
  q.forEach(node => line = line.concat(`${node.name}, `));
  return line + ']\n';
}

export function dfsTraverseTree(root, nodeCallback) {
  let escape = { stop: false };
  if (root) {
    let q = [root];
    while (q.length) {
      // console.log('q', showQueue(q));
      const node = q.shift();

      nodeCallback(node, escape);

      if (escape.stop) {
        return;
      }

      if (node.children?.length > 0) {
        const level = [];

        node.children.forEach(subNode => {
          subNode.parent = node;
          level.push(subNode);
        })

        q = level.concat(q);
      }
    }
  }
}

export function bfsTraverseTree(root, nodeCallback) {
  let escape = { stop: false };
  if (root) {
    let q = [root];
    while (q.length) {
      // console.log('q', showQueue(q));
      const node = q.shift();

      nodeCallback(node, escape);

      if (escape.stop) {
        return;
      }

      if (node.children?.length > 0) {
        const level = [];

        node.children.forEach(subNode => {
          subNode.parent = node;
          level.push(subNode);
        })

        q = q.concat(level);
      }
    }
  }
}

bfsTraverseTree(trees[5], node => {
  console.log('visiting: ', node.name);
});

