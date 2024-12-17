class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    this.root = this.buildTree(array);
  }

  buildTree(array) {
    const cleanArray = [...new Set(array)].sort((a, b) => a - b); // Sort and remove duplicates
    return this.sortedArrayToBST(cleanArray, 0, cleanArray.length - 1);
  }

  // Helper function to construct BST from a sorted array
  sortedArrayToBST(array, start, end) {
    if (start > end) return null;

    const mid = Math.floor((start + end) / 2);
    const node = new Node(array[mid]);

    node.left = this.sortedArrayToBST(array, start, mid - 1);
    node.right = this.sortedArrayToBST(array, mid + 1, end);

    return node;
  }

  // Insert value into the tree
  insert(value) {
    this.root = this.insertRec(this.root, value);
  }

  insertRec(node, value) {
    if (node === null) return new Node(value);

    if (value < node.data) {
      node.left = this.insertRec(node.left, value);
    } else if (value > node.data) {
      node.right = this.insertRec(node.right, value);
    }

    return node;
  }

  // Delete value from the tree
  deleteItem(value) {
    this.root = this.deleteRec(this.root, value);
  }

  deleteRec(node, value) {
    if (node === null) return null;

    if (value < node.data) {
      node.left = this.deleteRec(node.left, value);
    } else if (value > node.data) {
      node.right = this.deleteRec(node.right, value);
    } else {
      if (node.left === null) return node.right;
      if (node.right === null) return node.left;

      const minLargerNode = this.findMin(node.right);
      node.data = minLargerNode.data;
      node.right = this.deleteRec(node.right, minLargerNode.data);
    }
    return node;
  }

  findMin(node) {
    while (node.left !== null) node = node.left;
    return node;
  }

  // Find a value in the tree
  find(value) {
    return this.findRec(this.root, value);
  }

  findRec(node, value) {
    if (node === null || node.data === value) return node;

    if (value < node.data) {
      return this.findRec(node.left, value);
    } else {
      return this.findRec(node.right, value);
    }
  }

  // Level order traversal
  levelOrder(callback) {
    if (!callback)
      throw new Error(
        "Callback function is required for levelOrder traversal."
      );

    const queue = [this.root];
    while (queue.length > 0) {
      const currentNode = queue.shift();
      callback(currentNode);

      if (currentNode.left !== null) queue.push(currentNode.left);
      if (currentNode.right !== null) queue.push(currentNode.right);
    }
  }

  // Inorder traversal
  inOrder(callback, node = this.root) {
    if (!callback)
      throw new Error("Callback function is required for inOrder traversal.");
    if (node === null) return;

    this.inOrder(callback, node.left);
    callback(node);
    this.inOrder(callback, node.right);
  }

  // Preorder traversal
  preOrder(callback, node = this.root) {
    if (!callback)
      throw new Error("Callback function is required for preOrder traversal.");
    if (node === null) return;

    callback(node);
    this.preOrder(callback, node.left);
    this.preOrder(callback, node.right);
  }

  // Postorder traversal
  postOrder(callback, node = this.root) {
    if (!callback)
      throw new Error("Callback function is required for postOrder traversal.");
    if (node === null) return;

    this.postOrder(callback, node.left);
    this.postOrder(callback, node.right);
    callback(node);
  }

  // Get the height of a node
  height(node) {
    if (node === null) return -1;
    return Math.max(this.height(node.left), this.height(node.right)) + 1;
  }

  // Get the depth of a node
  depth(node, current = this.root, depth = 0) {
    if (current === null) return -1;

    if (current === node) return depth;

    const leftDepth = this.depth(node, current.left, depth + 1);
    if (leftDepth !== -1) return leftDepth;

    return this.depth(node, current.right, depth + 1);
  }

  // Check if the tree is balanced
  isBalanced(node = this.root) {
    if (node === null) return true;

    const leftHeight = this.height(node.left);
    const rightHeight = this.height(node.right);

    return (
      Math.abs(leftHeight - rightHeight) <= 1 &&
      this.isBalanced(node.left) &&
      this.isBalanced(node.right)
    );
  }

  // Rebalance the tree
  rebalance() {
    const nodes = [];
    this.inOrder((node) => nodes.push(node.data));
    this.root = this.buildTree(nodes);
  }
}

// Pretty print function
const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) return;

  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }

  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);

  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

// Driver script
const getRandomArray = (size) =>
  Array.from({ length: size }, () => Math.floor(Math.random() * 100));

const testTree = () => {
  const randomArray = getRandomArray(10);
  console.log("Initial Array:", randomArray);

  const tree = new Tree(randomArray);
  console.log("Balanced Tree:");
  prettyPrint(tree.root);

  console.log("Is Balanced:", tree.isBalanced());

  console.log("Level Order:");
  tree.levelOrder((node) => console.log(node.data));

  console.log("Preorder:");
  tree.preOrder((node) => console.log(node.data));

  console.log("Inorder:");
  tree.inOrder((node) => console.log(node.data));

  console.log("Postorder:");
  tree.postOrder((node) => console.log(node.data));

  console.log("Unbalancing the tree...");
  tree.insert(120);
  tree.insert(130);
  tree.insert(140);

  console.log("Tree after unbalancing:");
  prettyPrint(tree.root);
  console.log("Is Balanced:", tree.isBalanced());

  console.log("Rebalancing the tree...");
  tree.rebalance();

  console.log("Balanced Tree:");
  prettyPrint(tree.root);
  console.log("Is Balanced:", tree.isBalanced());

  console.log("Final Level Order:");
  tree.levelOrder((node) => console.log(node.data));
};

testTree();
