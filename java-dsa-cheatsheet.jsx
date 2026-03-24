import { useState, useMemo } from "react";

/* ── One Dark Pro palette ── */
const ODP = {
  bg: "#282c34", comment: "#5c6370", keyword: "#c678dd", type: "#e5c07b",
  func: "#61afef", string: "#98c379", number: "#d19a66", operator: "#56b6c2",
  plain: "#abb2bf",
};

const KW = new Set(["if","else","while","for","return","new","class","void","boolean","int","long","double","char","float","byte","short","true","false","null","this","break","continue","static","final","public","private","protected","extends","implements","import","try","catch","throw","throws","instanceof","super","switch","case","default"]);
const TY = new Set(["Integer","String","Map","HashMap","TreeMap","List","ArrayList","LinkedList","Set","HashSet","TreeNode","ListNode","Queue","Deque","ArrayDeque","PriorityQueue","Collections","Arrays","Math","StringBuilder","TrieNode","Long","Double","Float","Boolean","Character","Object"]);

function tokenize(line) {
  const tokens = [];
  const re = /\/\/.*|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\b\d[\d._xXa-fA-FL]*\b|[a-zA-Z_$][\w$]*|[=<>!&|+\-*/%^~?:]+|./g;
  let m;
  while ((m = re.exec(line)) !== null) {
    const t = m[0];
    let color = ODP.plain;
    if (t.startsWith("//")) color = ODP.comment;
    else if (t.startsWith('"') || t.startsWith("'")) color = ODP.string;
    else if (/^\d/.test(t)) color = ODP.number;
    else if (KW.has(t)) color = ODP.keyword;
    else if (TY.has(t)) color = ODP.type;
    else if (/^[a-zA-Z_$]/.test(t) && line[re.lastIndex] === "(") color = ODP.func;
    else if (/^[=<>!&|+\-*/%^~?:]+$/.test(t)) color = ODP.operator;
    tokens.push({ color, text: t });
  }
  return tokens;
}

function CodeBlock({ code }) {
  const lines = useMemo(() => code.split("\n").map((l, i) => ({ key: i, tokens: tokenize(l) })), [code]);
  return (
    <pre style={{ margin: 0, padding: "14px 18px", background: ODP.bg, overflowX: "auto", fontSize: 12.5, lineHeight: 1.72, fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
      {lines.map(l => (
        <div key={l.key} style={{ minHeight: "1.72em" }}>
          {l.tokens.map((tk, i) => <span key={i} style={{ color: tk.color }}>{tk.text}</span>)}
        </div>
      ))}
    </pre>
  );
}

/* ── Data ── */
const patterns = [
  {
    id: "arrays", title: "Arrays & Hashing", section: "I",
    lead: "The foundation of nearly every coding interview. Master frequency maps, prefix sums, and partitioning before anything else.",
    snippets: [
      { name: "HashMap Frequency Count", code:
`Map<Integer, Integer> freq = new HashMap<>();
for (int num : nums) {
    freq.put(num, freq.getOrDefault(num, 0) + 1);
}` },
      { name: "HashSet for Duplicates", code:
`Set<Integer> seen = new HashSet<>();
for (int num : nums) {
    if (!seen.add(num)) return true; // duplicate
}` },
      { name: "Prefix Sum Array", code:
`int[] prefix = new int[n + 1];
for (int i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
}
// sum of [l, r] = prefix[r+1] - prefix[l]` },
      { name: "Kadane's (Max Subarray Sum)", code:
`int maxSum = nums[0], cur = nums[0];
for (int i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    maxSum = Math.max(maxSum, cur);
}` },
      { name: "Dutch National Flag / 3-Way Partition", code:
`int lo = 0, mid = 0, hi = n - 1;
while (mid <= hi) {
    if (a[mid] == 0) swap(a, lo++, mid++);
    else if (a[mid] == 1) mid++;
    else swap(a, mid, hi--);
}` },
    ],
  },
  {
    id: "twoptr", title: "Two Pointers", section: "II",
    lead: "Converging from both ends or chasing at different speeds\u2014two pointers eliminate nested loops on sorted or linked data.",
    snippets: [
      { name: "Opposite Ends (Sorted Array)", code:
`int l = 0, r = nums.length - 1;
while (l < r) {
    int sum = nums[l] + nums[r];
    if (sum == target) return new int[]{l, r};
    else if (sum < target) l++;
    else r--;
}` },
      { name: "Fast & Slow (Floyd's Cycle)", code:
`ListNode slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow == fast) return true; // cycle
}` },
      { name: "Remove Duplicates In-Place", code:
`int write = 1;
for (int read = 1; read < nums.length; read++) {
    if (nums[read] != nums[read - 1]) {
        nums[write++] = nums[read];
    }
}
return write; // new length` },
      { name: "Container With Most Water", code:
`int l = 0, r = height.length - 1, max = 0;
while (l < r) {
    int area = Math.min(height[l], height[r]) * (r - l);
    max = Math.max(max, area);
    if (height[l] < height[r]) l++;
    else r--;
}` },
    ],
  },
  {
    id: "sliding", title: "Sliding Window", section: "III",
    lead: "A window that expands and contracts across a sequence. Fixed-size for aggregations, variable-size for constraint satisfaction.",
    snippets: [
      { name: "Fixed Window", code:
`int windowSum = 0;
for (int i = 0; i < k; i++) windowSum += nums[i];
int maxSum = windowSum;
for (int i = k; i < nums.length; i++) {
    windowSum += nums[i] - nums[i - k];
    maxSum = Math.max(maxSum, windowSum);
}` },
      { name: "Variable Window (Shrinkable)", code:
`int l = 0, maxLen = 0;
Map<Character, Integer> window = new HashMap<>();
for (int r = 0; r < s.length(); r++) {
    char c = s.charAt(r);
    window.merge(c, 1, Integer::sum);
    while (window.size() > k) {
        char lc = s.charAt(l);
        window.merge(lc, -1, Integer::sum);
        if (window.get(lc) == 0) window.remove(lc);
        l++;
    }
    maxLen = Math.max(maxLen, r - l + 1);
}` },
      { name: "Minimum Window Substring", code:
`int[] need = new int[128], have = new int[128];
for (char c : t.toCharArray()) need[c]++;
int required = t.length(), formed = 0;
int l = 0, minLen = Integer.MAX_VALUE, start = 0;
for (int r = 0; r < s.length(); r++) {
    char c = s.charAt(r);
    have[c]++;
    if (have[c] <= need[c]) formed++;
    while (formed == required) {
        if (r - l + 1 < minLen) {
            minLen = r - l + 1; start = l;
        }
        have[s.charAt(l)]--;
        if (have[s.charAt(l)] < need[s.charAt(l)]) formed--;
        l++;
    }
}` },
    ],
  },
  {
    id: "stack", title: "Stack & Monotonic Stack", section: "IV",
    lead: "LIFO for matching pairs and maintaining order invariants. The monotonic variant answers \u201cnext greater/smaller\u201d in linear time.",
    snippets: [
      { name: "Valid Parentheses", code:
`Deque<Character> stack = new ArrayDeque<>();
for (char c : s.toCharArray()) {
    if (c == '(') stack.push(')');
    else if (c == '{') stack.push('}');
    else if (c == '[') stack.push(']');
    else if (stack.isEmpty() || stack.pop() != c)
        return false;
}
return stack.isEmpty();` },
      { name: "Next Greater Element", code:
`int[] res = new int[n];
Arrays.fill(res, -1);
Deque<Integer> stack = new ArrayDeque<>(); // indices
for (int i = 0; i < n; i++) {
    while (!stack.isEmpty() && nums[stack.peek()] < nums[i]) {
        res[stack.pop()] = nums[i];
    }
    stack.push(i);
}` },
      { name: "Largest Rectangle in Histogram", code:
`Deque<Integer> stk = new ArrayDeque<>();
int max = 0;
for (int i = 0; i <= heights.length; i++) {
    int h = (i == heights.length) ? 0 : heights[i];
    while (!stk.isEmpty() && heights[stk.peek()] > h) {
        int height = heights[stk.pop()];
        int width = stk.isEmpty() ? i : i - stk.peek() - 1;
        max = Math.max(max, height * width);
    }
    stk.push(i);
}` },
    ],
  },
  {
    id: "binary", title: "Binary Search", section: "V",
    lead: "Halving the search space each step. Beyond sorted arrays\u2014search on answer spaces for optimization problems.",
    snippets: [
      { name: "Standard Binary Search", code:
`int lo = 0, hi = nums.length - 1;
while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    if (nums[mid] == target) return mid;
    else if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
}
return -1; // or lo for insert position` },
      { name: "Lower Bound (First >= target)", code:
`int lo = 0, hi = nums.length;
while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid;
}
return lo;` },
      { name: "Search on Answer Space", code:
`// e.g. Koko eating bananas, split array
int lo = minPossible, hi = maxPossible;
while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (feasible(mid)) hi = mid;
    else lo = mid + 1;
}
return lo;` },
    ],
  },
  {
    id: "linkedlist", title: "Linked List", section: "VI",
    lead: "Pointer surgery. Dummy nodes simplify edge cases; the slow-fast technique solves cycle detection, midpoints, and more.",
    snippets: [
      { name: "Reverse Linked List (Iterative)", code:
`ListNode prev = null, cur = head;
while (cur != null) {
    ListNode next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
}
return prev;` },
      { name: "Merge Two Sorted Lists", code:
`ListNode dummy = new ListNode(0), tail = dummy;
while (l1 != null && l2 != null) {
    if (l1.val <= l2.val) {
        tail.next = l1; l1 = l1.next;
    } else {
        tail.next = l2; l2 = l2.next;
    }
    tail = tail.next;
}
tail.next = (l1 != null) ? l1 : l2;
return dummy.next;` },
      { name: "Find Middle Node", code:
`ListNode slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
}
return slow; // middle (or 2nd mid if even)` },
    ],
  },
  {
    id: "trees", title: "Trees & BST", section: "VII",
    lead: "Recursive structure, recursive thinking. DFS for depth problems, BFS for level problems, and BST properties for search.",
    snippets: [
      { name: "DFS Traversals (Recursive)", code:
`void inorder(TreeNode node, List<Integer> res) {
    if (node == null) return;
    inorder(node.left, res);
    res.add(node.val);       // inorder
    inorder(node.right, res);
}
// preorder: add BEFORE left/right
// postorder: add AFTER left/right` },
      { name: "BFS / Level Order", code:
`Queue<TreeNode> q = new LinkedList<>();
q.offer(root);
while (!q.isEmpty()) {
    int size = q.size();
    List<Integer> level = new ArrayList<>();
    for (int i = 0; i < size; i++) {
        TreeNode node = q.poll();
        level.add(node.val);
        if (node.left != null) q.offer(node.left);
        if (node.right != null) q.offer(node.right);
    }
    result.add(level);
}` },
      { name: "Max Depth / Height", code:
`int maxDepth(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(
        maxDepth(root.left),
        maxDepth(root.right)
    );
}` },
      { name: "Validate BST", code:
`boolean valid(TreeNode node, long min, long max) {
    if (node == null) return true;
    if (node.val <= min || node.val >= max) return false;
    return valid(node.left, min, node.val)
        && valid(node.right, node.val, max);
}
// call: valid(root, Long.MIN_VALUE, Long.MAX_VALUE)` },
      { name: "LCA of Binary Tree", code:
`TreeNode lca(TreeNode root, TreeNode p, TreeNode q) {
    if (root == null || root == p || root == q) return root;
    TreeNode left = lca(root.left, p, q);
    TreeNode right = lca(root.right, p, q);
    if (left != null && right != null) return root;
    return left != null ? left : right;
}` },
    ],
  },
  {
    id: "heap", title: "Heap / Priority Queue", section: "VIII",
    lead: "Constant-time access to the extreme. Min-heaps for top-K, two-heaps for running medians, and priority merges.",
    snippets: [
      { name: "Top K Elements", code:
`// Min-heap of size K for Top K Largest
PriorityQueue<Integer> pq = new PriorityQueue<>();
for (int num : nums) {
    pq.offer(num);
    if (pq.size() > k) pq.poll();
}
return pq.peek(); // kth largest` },
      { name: "Merge K Sorted Lists", code:
`PriorityQueue<ListNode> pq = new PriorityQueue<>(
    (a, b) -> a.val - b.val
);
for (ListNode head : lists)
    if (head != null) pq.offer(head);

ListNode dummy = new ListNode(0), tail = dummy;
while (!pq.isEmpty()) {
    ListNode node = pq.poll();
    tail.next = node;
    tail = tail.next;
    if (node.next != null) pq.offer(node.next);
}
return dummy.next;` },
      { name: "Two-Heap Median", code:
`PriorityQueue<Integer> lo = new PriorityQueue<>(
    Collections.reverseOrder()); // max-heap
PriorityQueue<Integer> hi = new PriorityQueue<>();
void addNum(int num) {
    lo.offer(num);
    hi.offer(lo.poll());
    if (hi.size() > lo.size()) lo.offer(hi.poll());
}
double findMedian() {
    return lo.size() > hi.size()
        ? lo.peek()
        : (lo.peek() + hi.peek()) / 2.0;
}` },
    ],
  },
  {
    id: "graph", title: "Graphs", section: "IX",
    lead: "Adjacency lists, traversals, shortest paths, topological ordering, and disjoint sets\u2014the full graph toolkit.",
    snippets: [
      { name: "Build Adjacency List", code:
`List<List<Integer>> adj = new ArrayList<>();
for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
for (int[] e : edges) {
    adj.get(e[0]).add(e[1]);
    adj.get(e[1]).add(e[0]); // undirected
}` },
      { name: "DFS (Iterative + Recursive)", code:
`// Recursive
boolean[] visited = new boolean[n];
void dfs(int node) {
    visited[node] = true;
    for (int nei : adj.get(node))
        if (!visited[nei]) dfs(nei);
}
// Iterative
Deque<Integer> stack = new ArrayDeque<>();
stack.push(start); visited[start] = true;
while (!stack.isEmpty()) {
    int cur = stack.pop();
    for (int nei : adj.get(cur))
        if (!visited[nei]) {
            visited[nei] = true;
            stack.push(nei);
        }
}` },
      { name: "BFS Shortest Path (Unweighted)", code:
`int[] dist = new int[n];
Arrays.fill(dist, -1);
Queue<Integer> q = new LinkedList<>();
q.offer(src); dist[src] = 0;
while (!q.isEmpty()) {
    int cur = q.poll();
    for (int nei : adj.get(cur)) {
        if (dist[nei] == -1) {
            dist[nei] = dist[cur] + 1;
            q.offer(nei);
        }
    }
}` },
      { name: "Topological Sort (Kahn's BFS)", code:
`int[] indegree = new int[n];
for (int[] e : edges) indegree[e[1]]++;
Queue<Integer> q = new LinkedList<>();
for (int i = 0; i < n; i++)
    if (indegree[i] == 0) q.offer(i);
List<Integer> order = new ArrayList<>();
while (!q.isEmpty()) {
    int cur = q.poll();
    order.add(cur);
    for (int nei : adj.get(cur))
        if (--indegree[nei] == 0) q.offer(nei);
}
// order.size() == n means valid DAG` },
      { name: "Dijkstra's (Weighted Shortest Path)", code:
`int[] dist = new int[n];
Arrays.fill(dist, Integer.MAX_VALUE);
dist[src] = 0;
// {dist, node}
PriorityQueue<int[]> pq = new PriorityQueue<>(
    (a, b) -> a[0] - b[0]);
pq.offer(new int[]{0, src});
while (!pq.isEmpty()) {
    int[] top = pq.poll();
    int d = top[0], u = top[1];
    if (d > dist[u]) continue;
    for (int[] edge : adj.get(u)) {
        int v = edge[0], w = edge[1];
        if (dist[u] + w < dist[v]) {
            dist[v] = dist[u] + w;
            pq.offer(new int[]{dist[v], v});
        }
    }
}` },
      { name: "Union-Find (DSU)", code:
`int[] parent, rank;
void init(int n) {
    parent = new int[n]; rank = new int[n];
    for (int i = 0; i < n; i++) parent[i] = i;
}
int find(int x) {
    if (parent[x] != x) parent[x] = find(parent[x]);
    return parent[x];
}
boolean union(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return false;
    if (rank[ra] < rank[rb]) {
        int t = ra; ra = rb; rb = t;
    }
    parent[rb] = ra;
    if (rank[ra] == rank[rb]) rank[ra]++;
    return true;
}` },
    ],
  },
  {
    id: "dp", title: "Dynamic Programming", section: "X",
    lead: "Overlapping subproblems, optimal substructure. Build solutions bottom-up from base cases. Space-optimize where possible.",
    snippets: [
      { name: "1D DP \u2014 Climbing Stairs / Fibonacci", code:
`int[] dp = new int[n + 1];
dp[0] = 1; dp[1] = 1;
for (int i = 2; i <= n; i++)
    dp[i] = dp[i - 1] + dp[i - 2];

// Space-optimized:
int a = 1, b = 1;
for (int i = 2; i <= n; i++) {
    int tmp = a + b; a = b; b = tmp;
}` },
      { name: "0/1 Knapsack", code:
`int[] dp = new int[capacity + 1];
for (int i = 0; i < n; i++) {
    for (int w = capacity; w >= weight[i]; w--) {
        dp[w] = Math.max(dp[w], dp[w - weight[i]] + value[i]);
    }
}
// Traverse BACKWARDS to avoid reusing item` },
      { name: "Unbounded Knapsack / Coin Change", code:
`int[] dp = new int[amount + 1];
Arrays.fill(dp, Integer.MAX_VALUE);
dp[0] = 0;
for (int coin : coins) {
    for (int a = coin; a <= amount; a++) {
        if (dp[a - coin] != Integer.MAX_VALUE)
            dp[a] = Math.min(dp[a], dp[a - coin] + 1);
    }
}` },
      { name: "Longest Common Subsequence", code:
`int m = s1.length(), n = s2.length();
int[][] dp = new int[m + 1][n + 1];
for (int i = 1; i <= m; i++)
    for (int j = 1; j <= n; j++)
        dp[i][j] = (s1.charAt(i-1) == s2.charAt(j-1))
            ? dp[i-1][j-1] + 1
            : Math.max(dp[i-1][j], dp[i][j-1]);` },
      { name: "Longest Increasing Subsequence", code:
`// O(n log n) patience sorting
List<Integer> tails = new ArrayList<>();
for (int num : nums) {
    int pos = Collections.binarySearch(tails, num);
    if (pos < 0) pos = -(pos + 1);
    if (pos == tails.size()) tails.add(num);
    else tails.set(pos, num);
}
return tails.size();` },
      { name: "2D Grid DP (Unique Paths)", code:
`int[][] dp = new int[m][n];
for (int i = 0; i < m; i++) dp[i][0] = 1;
for (int j = 0; j < n; j++) dp[0][j] = 1;
for (int i = 1; i < m; i++)
    for (int j = 1; j < n; j++)
        dp[i][j] = dp[i-1][j] + dp[i][j-1];` },
    ],
  },
  {
    id: "backtrack", title: "Backtracking", section: "XI",
    lead: "Explore all candidates, prune early. The choose\u2013explore\u2013unchoose template generates subsets, permutations, and combinations.",
    snippets: [
      { name: "Subsets / Power Set", code:
`List<List<Integer>> res = new ArrayList<>();
void backtrack(int[] nums, int start, List<Integer> path) {
    res.add(new ArrayList<>(path));
    for (int i = start; i < nums.length; i++) {
        path.add(nums[i]);
        backtrack(nums, i + 1, path);
        path.remove(path.size() - 1);
    }
}` },
      { name: "Permutations", code:
`void permute(int[] nums, boolean[] used,
             List<Integer> path, List<List<Integer>> res) {
    if (path.size() == nums.length) {
        res.add(new ArrayList<>(path)); return;
    }
    for (int i = 0; i < nums.length; i++) {
        if (used[i]) continue;
        used[i] = true; path.add(nums[i]);
        permute(nums, used, path, res);
        path.remove(path.size() - 1); used[i] = false;
    }
}` },
      { name: "Combination Sum (Reuse Allowed)", code:
`void combo(int[] cands, int target, int start,
           List<Integer> path, List<List<Integer>> res) {
    if (target == 0) {
        res.add(new ArrayList<>(path)); return;
    }
    for (int i = start; i < cands.length; i++) {
        if (cands[i] > target) break; // sort first
        path.add(cands[i]);
        combo(cands, target - cands[i], i, path, res);
        path.remove(path.size() - 1);
    }
}` },
    ],
  },
  {
    id: "intervals", title: "Intervals & Greedy", section: "XII",
    lead: "Sort by start or end, then sweep. Greedy choices on intervals often yield provably optimal solutions.",
    snippets: [
      { name: "Merge Intervals", code:
`Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
List<int[]> merged = new ArrayList<>();
for (int[] iv : intervals) {
    if (!merged.isEmpty()
        && merged.get(merged.size()-1)[1] >= iv[0]) {
        merged.get(merged.size()-1)[1] =
            Math.max(merged.get(merged.size()-1)[1], iv[1]);
    } else {
        merged.add(iv.clone());
    }
}` },
      { name: "Insert Interval", code:
`List<int[]> res = new ArrayList<>();
int i = 0, n = intervals.length;
while (i < n && intervals[i][1] < newInterval[0])
    res.add(intervals[i++]);
while (i < n && intervals[i][0] <= newInterval[1]) {
    newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
    newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
    i++;
}
res.add(newInterval);
while (i < n) res.add(intervals[i++]);` },
      { name: "Non-Overlapping Intervals (Greedy)", code:
`// Sort by end time: classic activity selection
Arrays.sort(intervals, (a, b) -> a[1] - b[1]);
int end = Integer.MIN_VALUE, remove = 0;
for (int[] iv : intervals) {
    if (iv[0] >= end) end = iv[1];
    else remove++;
}` },
    ],
  },
  {
    id: "trie", title: "Trie & Bit Manipulation", section: "XIII",
    lead: "Prefix trees for string lookups, and bitwise tricks that replace arithmetic with blazing-fast operations.",
    snippets: [
      { name: "Trie Insert & Search", code:
`class TrieNode {
    TrieNode[] children = new TrieNode[26];
    boolean isEnd;
}
void insert(String word) {
    TrieNode cur = root;
    for (char c : word.toCharArray()) {
        int i = c - 'a';
        if (cur.children[i] == null)
            cur.children[i] = new TrieNode();
        cur = cur.children[i];
    }
    cur.isEnd = true;
}
boolean search(String word) {
    TrieNode cur = root;
    for (char c : word.toCharArray()) {
        cur = cur.children[c - 'a'];
        if (cur == null) return false;
    }
    return cur.isEnd;
}` },
      { name: "Common Bit Tricks", code:
`// Check if power of 2
(n & (n - 1)) == 0

// Count set bits
Integer.bitCount(n)

// Get / Set / Clear bit
boolean get = (n >> i & 1) == 1;
int set   = n | (1 << i);
int clear = n & ~(1 << i);

// XOR: find single number
int single = 0;
for (int num : nums) single ^= num;` },
    ],
  },
  {
    id: "misc", title: "Essential Java Idioms", section: "XIV",
    lead: "The scaffolding that holds your solutions together. Comparators, collections, string ops, and grid traversal utilities.",
    snippets: [
      { name: "Sorting Comparators", code:
`// Sort 2D array by first element
Arrays.sort(arr, (a, b) -> a[0] - b[0]);

// Sort by multiple criteria
Arrays.sort(arr, (a, b) -> a[0] != b[0]
    ? a[0] - b[0] : a[1] - b[1]);

// Reverse sort (descending)
Arrays.sort(arr, (a, b) -> b[0] - a[0]);

// For large values use Integer.compare (no overflow)
Arrays.sort(arr, (a, b) -> Integer.compare(a[0], b[0]));` },
      { name: "Collections Cheatsheet", code:
`// Stack: use Deque (NOT the Stack class)
Deque<Integer> stack = new ArrayDeque<>();
stack.push(x); stack.pop(); stack.peek();

// Queue: LinkedList or ArrayDeque
Queue<Integer> q = new LinkedList<>();
q.offer(x); q.poll(); q.peek();

// TreeMap (sorted map, O(log n) ops)
TreeMap<Integer, Integer> tm = new TreeMap<>();
tm.floorKey(k);    // greatest key <= k
tm.ceilingKey(k);  // smallest key >= k` },
      { name: "String Manipulation", code:
`// StringBuilder for O(n) string building
StringBuilder sb = new StringBuilder();
sb.append(c); sb.insert(0, c); sb.reverse();
String result = sb.toString();

// char array for in-place mutation
char[] chars = s.toCharArray();
new String(chars);

// Split and join
String[] parts = s.split(",");
String joined = String.join(",", parts);` },
      { name: "Grid Traversal & Utilities", code:
`// 2D directions (4-directional)
int[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}};
for (int[] d : dirs) {
    int nr = r + d[0], nc = c + d[1];
    if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
        // process neighbor
    }
}

// Quick max/min of array
int max = Integer.MIN_VALUE;
for (int x : arr) max = Math.max(max, x);

// Fill 2D array
for (int[] row : dp) Arrays.fill(row, -1);` },
    ],
  },
];

const TOTAL = patterns.reduce((s, p) => s + p.snippets.length, 0);
const ORNAMENT = "\u2766";

export default function App() {
  const [activeId, setActiveId] = useState(patterns[0].id);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return patterns;
    const q = search.toLowerCase();
    return patterns.map(p => ({
      ...p,
      snippets: p.snippets.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q)
      ),
    })).filter(p => p.snippets.length > 0);
  }, [search]);

  const active = filtered.find(p => p.id === activeId) || filtered[0];

  const copy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1400);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0ebe3", color: "#2c2418" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400;1,500&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=JetBrains+Mono:wght@400;500&family=DM+Sans:wght@400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #c8b99a; border-radius: 3px; }

        body { background: #f0ebe3; }

        .paper {
          max-width: 900px;
          margin: 0 auto;
          background: #f7f3ec;
          min-height: 100vh;
          box-shadow: 0 0 60px rgba(80,60,30,0.08);
          position: relative;
        }
        .paper::before {
          content: '';
          position: absolute; inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }
        .paper > * { position: relative; z-index: 1; }

        .nav-scroll {
          display: flex; gap: 0; overflow-x: auto;
          border-bottom: 1px solid #d5cdbf;
          border-top: 1px solid #d5cdbf;
          background: #f3ede4;
        }
        .nav-item {
          padding: 9px 14px; border: none; border-bottom: 2px solid transparent;
          background: none; color: #998a6e; cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-size: 10.5px; font-weight: 600;
          letter-spacing: 0.07em; text-transform: uppercase; white-space: nowrap;
          transition: all 0.2s;
        }
        .nav-item:hover { color: #2c2418; }
        .nav-item.active { color: #2c2418; border-bottom-color: #2c2418; }
        .nav-section {
          font-family: 'Playfair Display', serif; font-style: italic; font-weight: 400;
          color: #bfae8e; font-size: 10px; margin-right: 3px;
          text-transform: none; letter-spacing: 0;
        }

        .snippet-card {
          border-radius: 5px; overflow: hidden;
          border: 1px solid #ddd5c5;
          background: #f7f3ec;
        }
        .snippet-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 9px 18px; background: #353b45;
        }
        .snippet-name {
          font-family: 'DM Sans', sans-serif; font-weight: 500;
          font-size: 12px; color: #9da5b4;
        }
        .copy-btn {
          padding: 3px 10px; border: 1px solid #4b5263; border-radius: 4px;
          background: transparent; color: #7a8194; font-size: 10.5px;
          font-family: 'DM Sans', sans-serif; font-weight: 600;
          cursor: pointer; transition: all 0.15s; letter-spacing: 0.03em;
          text-transform: uppercase;
        }
        .copy-btn:hover { background: #4b5263; color: #abb2bf; }
        .copy-btn.copied { background: #98c379; color: #282c34; border-color: #98c379; }

        .search-box {
          width: 100%; max-width: 300px; padding: 8px 14px 8px 34px;
          border: 1px solid #d5cdbf; border-radius: 3px; background: #faf7f1;
          color: #2c2418; font-family: 'Lora', serif; font-size: 13px;
          outline: none; transition: border-color 0.2s;
        }
        .search-box:focus { border-color: #a0906e; }
        .search-box::placeholder { color: #b8a98a; font-style: italic; }

        .dateline {
          font-family: 'DM Sans', sans-serif; font-size: 10px; color: #a09478;
          letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600;
        }

        .thick-rule { border: none; border-top: 3px double #2c2418; }
        .thin-rule { border: none; border-top: 1px solid #d5cdbf; }
        .ornament-rule {
          text-align: center; color: #c8b99a; font-size: 16px;
          margin: 18px 0; line-height: 1; letter-spacing: 12px;
        }

        .drop-cap::first-letter {
          font-family: 'Playfair Display', serif;
          font-size: 3.2em; font-weight: 800;
          float: left; line-height: 0.75; margin: 4px 8px 0 0;
          color: #2c2418;
        }

        .lead-text {
          font-family: 'Lora', serif; font-size: 14.5px; line-height: 1.7;
          color: #5a4e3a; font-style: italic; margin-bottom: 20px;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .snippet-card { animation: fadeUp 0.3s ease both; }
      `}</style>

      <div className="paper">
        {/* Masthead */}
        <header style={{ padding: "28px 36px 0", textAlign: "center" }}>
          <p className="dateline" style={{ marginBottom: 10 }}>
            {"Pure Algorithmic Java \u00b7 " + patterns.length + " Patterns \u00b7 " + TOTAL + " Snippets"}
          </p>
          <hr className="thick-rule" />
          <div style={{ padding: "16px 0 8px" }}>
            <h1 style={{
              fontFamily: "'Playfair Display', serif", fontSize: 48,
              fontWeight: 900, letterSpacing: "-1px", lineHeight: 1,
              color: "#2c2418",
            }}>
              The Java DSA
            </h1>
            <h1 style={{
              fontFamily: "'Playfair Display', serif", fontSize: 48,
              fontWeight: 900, letterSpacing: "-1px", lineHeight: 1,
              color: "#2c2418", fontStyle: "italic",
            }}>
              Cheatsheet
            </h1>
          </div>
          <p style={{
            fontFamily: "'Lora', serif", fontStyle: "italic",
            fontSize: 14, color: "#8a7a5e", margin: "4px 0 10px",
          }}>
            Every pattern that repeats across top data structure &amp; algorithm problems, distilled into copy-paste ready Java.
          </p>
          <hr className="thick-rule" />

          {/* Info row */}
          <div style={{
            display: "flex", justifyContent: "center", gap: 28,
            padding: "10px 0", borderBottom: "1px solid #d5cdbf",
            flexWrap: "wrap",
          }}>
          </div>
        </header>

        {/* Search */}
        <div style={{ padding: "14px 36px 0", display: "flex", justifyContent: "center" }}>
          <div style={{ position: "relative", width: "100%", maxWidth: 300 }}>
            <span style={{
              position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
              color: "#b8a98a", fontSize: 13, fontFamily: "'DM Sans', sans-serif",
            }}>{"\u2315"}</span>
            <input className="search-box" placeholder="Search patterns or code snippets..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {/* Nav */}
        <nav className="nav-scroll" style={{ margin: "14px 36px 0", borderRadius: "3px 3px 0 0" }}>
          {filtered.map(p => (
            <button key={p.id}
              className={"nav-item" + (active && active.id === p.id ? " active" : "")}
              onClick={() => setActiveId(p.id)}>
              <span className="nav-section">{p.section}.</span>{p.title}
            </button>
          ))}
        </nav>

        {/* Content */}
        <main style={{ padding: "28px 36px 52px" }}>
          {!active ? (
            <p style={{
              textAlign: "center", color: "#998a6e", padding: 60,
              fontFamily: "'Lora', serif", fontStyle: "italic",
            }}>
              {"No patterns found for \u201c" + search + "\u201d"}
            </p>
          ) : (
            <>
              {/* Section header */}
              <div style={{ marginBottom: 6 }}>
                <p className="dateline" style={{ marginBottom: 6 }}>
                  {"Section " + active.section + " \u00b7 " + active.snippets.length + " snippet" + (active.snippets.length > 1 ? "s" : "")}
                </p>
                <h2 style={{
                  fontFamily: "'Playfair Display', serif", fontSize: 32,
                  fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.1,
                  color: "#2c2418",
                }}>
                  {active.title}
                </h2>
                <hr className="thin-rule" style={{ margin: "12px 0 16px" }} />
              </div>

              {/* Lead paragraph with drop cap */}
              {active.lead && (
                <p className="lead-text drop-cap">{active.lead}</p>
              )}

              {/* Snippets */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {active.snippets.map((s, idx) => {
                  const uid = active.id + "-" + idx;
                  return (
                    <div className="snippet-card" key={uid} style={{ animationDelay: (idx * 0.06) + "s" }}>
                      <div className="snippet-header">
                        <span className="snippet-name">{s.name}</span>
                        <button
                          className={"copy-btn" + (copiedId === uid ? " copied" : "")}
                          onClick={() => copy(s.code, uid)}>
                          {copiedId === uid ? "\u2713 Copied" : "Copy"}
                        </button>
                      </div>
                      <CodeBlock code={s.code} />
                    </div>
                  );
                })}
              </div>

              {/* Section end ornament */}
              <div className="ornament-rule">
                {ORNAMENT + " " + ORNAMENT + " " + ORNAMENT}
              </div>
            </>
          )}
        </main>

        {/* Footer */}
        <footer style={{
          borderTop: "3px double #2c2418", padding: "16px 36px",
          textAlign: "center", background: "#f3ede4",
        }}>
          <p style={{
            fontFamily: "'Playfair Display', serif", fontStyle: "italic",
            fontSize: 13, color: "#8a7a5e",
          }}>
            {"Compiled for interview preparation \u00b7 Copy-paste ready \u00b7 No Streams, no fluff"}
          </p>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 9,
            color: "#b8a98a", letterSpacing: "0.1em", textTransform: "uppercase",
            marginTop: 6,
          }}>
            {"\u00a9 The Java DSA Cheatsheet \u00b7 All patterns. No noise."}
          </p>
        </footer>
      </div>
    </div>
  );
}
