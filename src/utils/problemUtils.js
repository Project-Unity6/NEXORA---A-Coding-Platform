const problemTags = [
  "array",
  "string",
  "hash_table",
  "linked_list",
  "stack",
  "queue",
  "deque",
  "heap",
  "priority_queue",
  "tree",
  "binary_tree",
  "binary_search_tree",
  "trie",
  "graph",
  "matrix",
  "hashing",

  "sorting",
  "searching",
  "binary_search",
  "two_pointers",
  "sliding_window",
  "prefix_sum",

  "greedy",
  "recursion",
  "backtracking",
  "divide_and_conquer",
  "brute_force",

  "dynamic_programming",
  "dp_1d",
  "dp_2d",
  "bitmask_dp",
  "knapsack",

  "bfs",
  "dfs",
  "topological_sort",
  "dijkstra",
  "union_find",

  "segment_tree",
  "fenwick_tree",

  "string_matching",
  "kmp",
  "rolling_hash",

  "math",
  "number_theory",
  "combinatorics",
  "geometry",
  "bit_manipulation",

  "monotonic_stack",
  "monotonic_queue",

  "implementation",
  "simulation",
  "design",

  "data_stream",
  "interactive",
  "hash-table",
  "binary-search",
];

const SUPPORTED_LANGUAGES = ["javascript", "python", "java", "cpp","c"];


const JUDGE0_LANGUAGE_IDS = {
    cpp: 54,
    "c++":54,
    java: 62,
    javascript: 63,
    python: 71,
    c: 50
};

const JUDGE0_STATUS = {

   1: "Pending",

   2: "Processing",

   3: "Accepted",

   4: "Wrong Answer",

   5: "Time Limit Exceeded",

   6: "Compilation Error",

   7: "Runtime Error",

   8: "Runtime Error",

   9: "Runtime Error",

   10: "Runtime Error",

   11: "Runtime Error",

   12: "Runtime Error",

   13: "Internal Error",

   14: "Exec Format Error"
};

module.exports = {problemTags,SUPPORTED_LANGUAGES,JUDGE0_LANGUAGE_IDS,JUDGE0_STATUS};