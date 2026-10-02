
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
    const sortedArray = [...new Set(array)].sort((a, b) => a - b);

    if (sortedArray.length === 0) {
      return null;
    }

    const middleIndex = Math.floor(sortedArray.length / 2);

    const root = new Node(sortedArray[middleIndex]);

    root.left = this.buildTree(sortedArray.slice(0, middleIndex));
    root.right = this.buildTree(sortedArray.slice(middleIndex + 1));

    return root;
  }

  includes(value) {
    let current = this.root;

    while (current !== null) {
      if (value === current.data) {
        return true;
      }

      if (value < current.data) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    return false;
  }

  insert(value) {
    const newNode = new Node(value);

    if (this.root === null) {
      this.root = newNode;
      return;
    }

    let current = this.root;

    while (true) {
      if (value === current.data) {
        return;
      }

      if (value < current.data) {
        if (current.left === null) {
          current.left = newNode;
          return;
        }

        current = current.left;
      } else {
        if (current.right === null) {
          current.right = newNode;
          return;
        }

        current = current.right;
      }
    }
  }

  deleteItem(value) {
    let current = this.root;
    let parent = null;

    while (current !== null && current.data !== value) {
      parent = current;

      if (value < current.data) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    if (current === null) {
      return;
    }

    // Case 1: no children
    if (current.left === null && current.right === null) {
      if (parent === null) {
        this.root = null;
      } else if (parent.left === current) {
        parent.left = null;
      } else {
        parent.right = null;
      }

      return;
    }

    // Case 2: only right child
    if (current.left === null) {
      if (parent === null) {
        this.root = current.right;
      } else if (parent.left === current) {
        parent.left = current.right;
      } else {
        parent.right = current.right;
      }

      return;
    }

    // Case 2: only left child
    if (current.right === null) {
      if (parent === null) {
        this.root = current.left;
      } else if (parent.left === current) {
        parent.left = current.left;
      } else {
        parent.right = current.left;
      }

      return;
    }

    // Case 3: two children
    let successorParent = current;
    let successor = current.right;

    while (successor.left !== null) {
      successorParent = successor;
      successor = successor.left;
    }

    current.data = successor.data;

    if (successorParent.left === successor) {
      successorParent.left = successor.right;
    } else {
      successorParent.right = successor.right;
    }
  }

  levelOrderForEach(callback) {
    if (typeof callback !== "function") {
      throw new Error("Callback function is required");
    }

    if (this.root === null) {
      return;
    }

    const queue = [this.root];

    while (queue.length > 0) {
      const current = queue.shift();

      callback(current);

      if (current.left !== null) {
        queue.push(current.left);
      }

      if (current.right !== null) {
        queue.push(current.right);
      }
    }
  }

  inOrderForEach(callback) {
    if (typeof callback !== "function") {
      throw new Error("Callback function is required");
    }

    const traverse = (node) => {
      if (node === null) {
        return;
      }

      traverse(node.left);
      callback(node);
      traverse(node.right);
    };

    traverse(this.root);
  }

  preOrderForEach(callback) {
    if (typeof callback !== "function") {
      throw new Error("Callback function is required");
    }

    const traverse = (node) => {
      if (node === null) {
        return;
      }

      callback(node);
      traverse(node.left);
      traverse(node.right);
    };

    traverse(this.root);
  }

  postOrderForEach(callback) {
    if (typeof callback !== "function") {
      throw new Error("Callback function is required");
    }

    const traverse = (node) => {
      if (node === null) {
        return;
      }

      traverse(node.left);
      traverse(node.right);
      callback(node);
    };

    traverse(this.root);
  }
  height(value){
    const findNode = (node) => {
      if (node===null){
        return null;
      }
      if (value < node.data){
        return findNode(node.left);
      }
      return findNode(node.right);
    };

    const node = findNode(this.root);

    if (node === null){
      return null;
    }

    const getHeight = (node) => {
      if (node ===null){
        return -1;
      }
      const leftHeight = getHeight(node.left);
      const rightHeight = getHeight(node.right);
      
      return Math.max(leftHeight, rightHeight) + 1;
    };

    return getHeight(node);
  }
  depth(value){
    let current = this.root;
    let depth = 0;

    while (current !==null){
      if (current.data ===value){
        return depth;
      }
      if (value <current.data){
        current = current.left;
      }else{
        current = current.right;
      }
      depth++;
    }
    return null;
  }
  isBalanced(){
    const checkBalance = (node) => {
      if (node === null){
        return 0;
      }
      const leftHeight = checkBalance (node.left);

      if (leftHeight === -1){
        return -1;
      }

      const rightHeight = checkBalance(node.right);

      if (rightHeight === -1){
        return -1;
      }
      if (Math.abs(leftHeight - rightHeight) >1){
        return -1;
      }
      return Math.max(leftHeight, rightHeight) + 1;

    }
    return checkBalance(this.root) !== -1;
  }
  rebalance(){
    const values = [];

    this.inOrderForEach((node) => {
      values.push(node.data);
    });
    this.root = this.buildTree(values);

  }
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null || node === undefined) {
    return;
  }

  prettyPrint(
    node.right,
    `${prefix}${isLeft ? "│   " : "    "}`,
    false
  );

  console.log(
    `${prefix}${isLeft ? "└── " : "┌── "}${node.data}`
  );

  prettyPrint(
    node.left,
    `${prefix}${isLeft ? "    " : "│   "}`,
    true
  );
};

const randomArray = Array.from(
  { length: 15 },
  () => Math.floor(Math.random() * 100)
);

const tree = new Tree(randomArray);

console.log("Random array:");
console.log(randomArray);

console.log("Initial tree:");
prettyPrint(tree.root);

console.log("Is balanced:", tree.isBalanced());

console.log("Level Order:");
tree.levelOrderForEach((node) => {
  console.log(node.data);
});

console.log("Pre Order:");
tree.preOrderForEach((node) => {
  console.log(node.data);
});

console.log("Post Order:");
tree.postOrderForEach((node) => {
  console.log(node.data);
});

console.log("In Order:");
tree.inOrderForEach((node) => {
  console.log(node.data);
});

tree.insert(101);
tree.insert(150);
tree.insert(200);
tree.insert(250);

console.log("After adding values greater than 100:");
console.log("Is balanced:", tree.isBalanced());

tree.rebalance();

console.log("After rebalance:");
console.log("Is balanced:", tree.isBalanced());

console.log("Level Order after rebalance:");
tree.levelOrderForEach((node) => {
  console.log(node.data);
});

console.log("Pre Order after rebalance:");
tree.preOrderForEach((node) => {
  console.log(node.data);
});

console.log("Post Order after rebalance:");
tree.postOrderForEach((node) => {
  console.log(node.data);
});

console.log("In Order after rebalance:");
tree.inOrderForEach((node) => {
  console.log(node.data);
});