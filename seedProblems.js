const mongoose = require("mongoose");
require("dotenv").config();
const Problem = require("./src/models/problem.model");
const User = require("./src/models/user.model");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  let adminUser = await User.findOne({ role: "admin" });
  if (!adminUser) {
    adminUser = await User.findOne({});
  }
  const authorId = adminUser ? adminUser._id : new mongoose.Types.ObjectId();

  const problemsData = [
    {
      title: "Two Sum",
      description: `<p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.</p><p>You may assume that each input would have exactly one solution, and you may not use the same element twice.</p>`,
      difficulty: "easy",
      constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9"],
      tags: ["array", "hashing"],
      visibleTestCases: [
        { input: "4\n2 7 11 15\n9", output: "0 1", explanation: "nums[0] + nums[1] = 2 + 7 = 9" },
        { input: "3\n3 2 4\n6", output: "1 2", explanation: "nums[1] + nums[2] = 2 + 4 = 6" }
      ],
      hiddenTestCases: [
        { input: "2\n3 3\n6", output: "0 1" },
        { input: "5\n-1 -2 -3 -4 -5\n-8", output: "2 4" },
        { input: "6\n1 5 8 10 13 15\n25", output: "3 5" }
      ],
      boilerPlate: [
        {
          language: "cpp",
          initialCode: `#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};`,
          driverCode: `#include <bits/stdc++.h>\nusing namespace std;\n\n{{USER_CODE}}\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int n;\n    if(!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for(int i = 0; i < n; i++) cin >> nums[i];\n    int target;\n    cin >> target;\n    Solution obj;\n    vector<int> ans = obj.twoSum(nums, target);\n    for(int i = 0; i < ans.size(); i++) {\n        cout << ans[i];\n        if(i != ans.size() - 1) cout << ' ';\n    }\n    return 0;\n}`
        },
        {
          language: "java",
          initialCode: `import java.util.*;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}`,
          driverCode: `import java.util.*;\n\n{{USER_CODE}}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for(int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int target = sc.nextInt();\n        Solution obj = new Solution();\n        int[] ans = obj.twoSum(nums, target);\n        for(int i = 0; i < ans.length; i++) {\n            System.out.print(ans[i]);\n            if(i != ans.length - 1) System.out.print(" ");\n        }\n    }\n}`
        },
        {
          language: "python",
          initialCode: `class Solution:\n    def twoSum(self, nums, target):\n        pass`,
          driverCode: `import sys\n\n{{USER_CODE}}\n\nlines = sys.stdin.read().split()\nif lines:\n    n = int(lines[0])\n    nums = [int(x) for x in lines[1:n+1]]\n    target = int(lines[n+1])\n    obj = Solution()\n    ans = obj.twoSum(nums, target)\n    print(*ans)`
        },
        {
          language: "javascript",
          initialCode: `class Solution {\n    twoSum(nums, target) {\n        \n    }\n}`,
          driverCode: `{{USER_CODE}}\n\nconst fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\nif(input.length >= 3) {\n    let idx = 0;\n    const n = parseInt(input[idx++]);\n    const nums = [];\n    for(let i = 0; i < n; i++) nums.push(parseInt(input[idx++]));\n    const target = parseInt(input[idx++]);\n    const obj = new Solution();\n    const ans = obj.twoSum(nums, target);\n    console.log(ans.join(' '));\n}`
        }
      ],
      referenceSolution: [
        { language: "cpp", completeCode: `#include <vector>\n#include <unordered_map>\nusing namespace std;\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int,int> mp;\n        for(int i = 0; i < nums.size(); i++) {\n            int rem = target - nums[i];\n            if(mp.count(rem)) return {mp[rem], i};\n            mp[nums[i]] = i;\n        }\n        return {};\n    }\n};` },
        { language: "java", completeCode: `import java.util.*;\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        HashMap<Integer,Integer> map = new HashMap<>();\n        for(int i = 0; i < nums.length; i++) {\n            int rem = target - nums[i];\n            if(map.containsKey(rem)) return new int[]{map.get(rem), i};\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}` },
        { language: "python", completeCode: `class Solution:\n    def twoSum(self, nums, target):\n        mp = {}\n        for i in range(len(nums)):\n            rem = target - nums[i]\n            if rem in mp: return [mp[rem], i]\n            mp[nums[i]] = i\n        return []` },
        { language: "javascript", completeCode: `class Solution {\n    twoSum(nums, target) {\n        const map = new Map();\n        for(let i = 0; i < nums.length; i++) {\n            const rem = target - nums[i];\n            if(map.has(rem)) return [map.get(rem), i];\n            map.set(nums[i], i);\n        }\n        return [];\n    }\n}` }
      ]
    },
    {
      title: "Reverse String",
      description: `<p>Write a function that reverses a string.</p>`,
      difficulty: "easy",
      constraints: ["1 <= s.length <= 10^5", "s consists of printable ASCII characters."],
      tags: ["string", "two_pointers"],
      visibleTestCases: [
        { input: "hello", output: "olleh", explanation: "Reversing 'hello' gives 'olleh'" },
        { input: "Hannah", output: "hannaH", explanation: "Reversing 'Hannah' gives 'hannaH'" }
      ],
      hiddenTestCases: [
        { input: "leetcode", output: "edocteel" },
        { input: "a", output: "a" }
      ],
      boilerPlate: [
        {
          language: "cpp",
          initialCode: `#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    string reverseString(string s) {\n        \n    }\n};`,
          driverCode: `#include <bits/stdc++.h>\nusing namespace std;\n\n{{USER_CODE}}\n\nint main() {\n    string s;\n    if(cin >> s) {\n        Solution obj;\n        cout << obj.reverseString(s);\n    }\n    return 0;\n}`
        },
        {
          language: "java",
          initialCode: `import java.util.*;\n\nclass Solution {\n    public String reverseString(String s) {\n        \n    }\n}`,
          driverCode: `import java.util.*;\n\n{{USER_CODE}}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(sc.hasNext()) {\n            String s = sc.next();\n            Solution obj = new Solution();\n            System.out.print(obj.reverseString(s));\n        }\n    }\n}`
        },
        {
          language: "python",
          initialCode: `class Solution:\n    def reverseString(self, s: str) -> str:\n        pass`,
          driverCode: `import sys\n\n{{USER_CODE}}\n\ns = sys.stdin.read().strip()\nif s:\n    obj = Solution()\n    print(obj.reverseString(s))`
        },
        {
          language: "javascript",
          initialCode: `class Solution {\n    reverseString(s) {\n        \n    }\n}`,
          driverCode: `{{USER_CODE}}\n\nconst fs = require('fs');\nconst s = fs.readFileSync(0, 'utf-8').trim();\nif(s) {\n    const obj = new Solution();\n    console.log(obj.reverseString(s));\n}`
        }
      ],
      referenceSolution: [
        { language: "cpp", completeCode: `#include <string>\n#include <algorithm>\nusing namespace std;\nclass Solution {\npublic:\n    string reverseString(string s) {\n        reverse(s.begin(), s.end());\n        return s;\n    }\n};` },
        { language: "java", completeCode: `class Solution {\n    public String reverseString(String s) {\n        return new StringBuilder(s).reverse().toString();\n    }\n}` },
        { language: "python", completeCode: `class Solution:\n    def reverseString(self, s: str) -> str:\n        return s[::-1]` },
        { language: "javascript", completeCode: `class Solution {\n    reverseString(s) {\n        return s.split('').reverse().join('');\n    }\n}` }
      ]
    },
    {
      title: "Palindrome Number",
      description: `<p>Given an integer <code>x</code>, return <code>true</code> if <code>x</code> is a palindrome, and <code>false</code> otherwise.</p>`,
      difficulty: "easy",
      constraints: ["-2^31 <= x <= 2^31 - 1"],
      tags: ["math"],
      visibleTestCases: [
        { input: "121", output: "true", explanation: "121 reads as 121 from left to right and from right to left." },
        { input: "-121", output: "false", explanation: "From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome." }
      ],
      hiddenTestCases: [
        { input: "10", output: "false" },
        { input: "0", output: "true" },
        { input: "12321", output: "true" }
      ],
      boilerPlate: [
        {
          language: "cpp",
          initialCode: `#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isPalindrome(int x) {\n        \n    }\n};`,
          driverCode: `#include <bits/stdc++.h>\nusing namespace std;\n\n{{USER_CODE}}\n\nint main() {\n    int x;\n    if(cin >> x) {\n        Solution obj;\n        cout << (obj.isPalindrome(x) ? "true" : "false");\n    }\n    return 0;\n}`
        },
        {
          language: "java",
          initialCode: `import java.util.*;\n\nclass Solution {\n    public boolean isPalindrome(int x) {\n        \n    }\n}`,
          driverCode: `import java.util.*;\n\n{{USER_CODE}}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(sc.hasNextInt()) {\n            int x = sc.nextInt();\n            Solution obj = new Solution();\n            System.out.print(obj.isPalindrome(x) ? "true" : "false");\n        }\n    }\n}`
        },
        {
          language: "python",
          initialCode: `class Solution:\n    def isPalindrome(self, x: int) -> bool:\n        pass`,
          driverCode: `import sys\n\n{{USER_CODE}}\n\nline = sys.stdin.read().strip()\nif line:\n    x = int(line)\n    obj = Solution()\n    print("true" if obj.isPalindrome(x) else "false")`
        },
        {
          language: "javascript",
          initialCode: `class Solution {\n    isPalindrome(x) {\n        \n    }\n}`,
          driverCode: `{{USER_CODE}}\n\nconst fs = require('fs');\nconst line = fs.readFileSync(0, 'utf-8').trim();\nif(line) {\n    const x = parseInt(line);\n    const obj = new Solution();\n    console.log(obj.isPalindrome(x) ? "true" : "false");\n}`
        }
      ],
      referenceSolution: [
        { language: "cpp", completeCode: `#include <string>\n#include <algorithm>\nusing namespace std;\nclass Solution {\npublic:\n    bool isPalindrome(int x) {\n        if (x < 0) return false;\n        string s = to_string(x);\n        string rev = s;\n        reverse(rev.begin(), rev.end());\n        return s == rev;\n    }\n};` },
        { language: "java", completeCode: `class Solution {\n    public boolean isPalindrome(int x) {\n        if(x < 0) return false;\n        String s = String.valueOf(x);\n        return s.equals(new StringBuilder(s).reverse().toString());\n    }\n}` },
        { language: "python", completeCode: `class Solution:\n    def isPalindrome(self, x: int) -> bool:\n        if x < 0: return False\n        s = str(x)\n        return s == s[::-1]` },
        { language: "javascript", completeCode: `class Solution {\n    isPalindrome(x) {\n        if (x < 0) return false;\n        const s = String(x);\n        return s === s.split('').reverse().join('');\n    }\n}` }
      ]
    },
    {
      title: "Valid Parentheses",
      description: `<p>Given a string <code>s</code> containing just the characters <code>'('</code>, <code>')'</code>, <code>'{'</code>, <code>'}'</code>, <code>'['</code> and <code>']'</code>, determine if the input string is valid.</p>`,
      difficulty: "easy",
      constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'."],
      tags: ["stack", "string"],
      visibleTestCases: [
        { input: "()", output: "true", explanation: "Valid bracket sequence" },
        { input: "()[]{}", output: "true", explanation: "Valid bracket sequences" },
        { input: "(]", output: "false", explanation: "Mismatched bracket pair" }
      ],
      hiddenTestCases: [
        { input: "([)]", output: "false" },
        { input: "{[]}", output: "true" }
      ],
      boilerPlate: [
        {
          language: "cpp",
          initialCode: `#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isValid(string s) {\n        \n    }\n};`,
          driverCode: `#include <bits/stdc++.h>\nusing namespace std;\n\n{{USER_CODE}}\n\nint main() {\n    string s;\n    if(cin >> s) {\n        Solution obj;\n        cout << (obj.isValid(s) ? "true" : "false");\n    }\n    return 0;\n}`
        },
        {
          language: "java",
          initialCode: `import java.util.*;\n\nclass Solution {\n    public boolean isValid(String s) {\n        \n    }\n}`,
          driverCode: `import java.util.*;\n\n{{USER_CODE}}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(sc.hasNext()) {\n            String s = sc.next();\n            Solution obj = new Solution();\n            System.out.print(obj.isValid(s) ? "true" : "false");\n        }\n    }\n}`
        },
        {
          language: "python",
          initialCode: `class Solution:\n    def isValid(self, s: str) -> bool:\n        pass`,
          driverCode: `import sys\n\n{{USER_CODE}}\n\ns = sys.stdin.read().strip()\nif s:\n    obj = Solution()\n    print("true" if obj.isValid(s) else "false")`
        },
        {
          language: "javascript",
          initialCode: `class Solution {\n    isValid(s) {\n        \n    }\n}`,
          driverCode: `{{USER_CODE}}\n\nconst fs = require('fs');\nconst s = fs.readFileSync(0, 'utf-8').trim();\nif(s) {\n    const obj = new Solution();\n    console.log(obj.isValid(s) ? "true" : "false");\n}`
        }
      ],
      referenceSolution: [
        { language: "cpp", completeCode: `#include <string>\n#include <stack>\nusing namespace std;\nclass Solution {\npublic:\n    bool isValid(string s) {\n        stack<char> st;\n        for(char c : s) {\n            if(c == '(' || c == '{' || c == '[') st.push(c);\n            else {\n                if(st.empty()) return false;\n                if(c == ')' && st.top() != '(') return false;\n                if(c == '}' && st.top() != '{') return false;\n                if(c == ']' && st.top() != '[') return false;\n                st.pop();\n            }\n        }\n        return st.empty();\n    }\n};` },
        { language: "java", completeCode: `import java.util.*;\nclass Solution {\n    public boolean isValid(String s) {\n        Stack<Character> st = new Stack<>();\n        for(char c : s.toCharArray()) {\n            if(c == '(' || c == '{' || c == '[') st.push(c);\n            else {\n                if(st.isEmpty()) return false;\n                char top = st.pop();\n                if(c == ')' && top != '(') return false;\n                if(c == '}' && top != '{') return false;\n                if(c == ']' && top != '[') return false;\n            }\n        }\n        return st.isEmpty();\n    }\n}` },
        { language: "python", completeCode: `class Solution:\n    def isValid(self, s: str) -> bool:\n        st = []\n        mp = {')': '(', '}': '{', ']': '['}\n        for c in s:\n            if c in mp:\n                if not st or st[-1] != mp[c]: return False\n                st.pop()\n            else: st.append(c)\n        return len(st) == 0` },
        { language: "javascript", completeCode: `class Solution {\n    isValid(s) {\n        const st = [];\n        const mp = {')': '(', '}': '{', ']': '['};\n        for(let c of s) {\n            if(mp[c]) {\n                if(st.length === 0 || st[st.length - 1] !== mp[c]) return false;\n                st.pop();\n            } else {\n                st.push(c);\n            }\n        }\n        return st.length === 0;\n    }\n}` }
      ]
    },
    {
      title: "Climbing Stairs",
      description: `<p>You are climbing a staircase. It takes <code>n</code> steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?</p>`,
      difficulty: "easy",
      constraints: ["1 <= n <= 45"],
      tags: ["dynamic_programming", "math"],
      visibleTestCases: [
        { input: "2", output: "2", explanation: "1. 1 step + 1 step\n2. 2 steps" },
        { input: "3", output: "3", explanation: "1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step" }
      ],
      hiddenTestCases: [
        { input: "1", output: "1" },
        { input: "5", output: "8" },
        { input: "10", output: "89" }
      ],
      boilerPlate: [
        {
          language: "cpp",
          initialCode: `#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    int climbStairs(int n) {\n        \n    }\n};`,
          driverCode: `#include <bits/stdc++.h>\nusing namespace std;\n\n{{USER_CODE}}\n\nint main() {\n    int n;\n    if(cin >> n) {\n        Solution obj;\n        cout << obj.climbStairs(n);\n    }\n    return 0;\n}`
        },
        {
          language: "java",
          initialCode: `import java.util.*;\n\nclass Solution {\n    public int climbStairs(int n) {\n        \n    }\n}`,
          driverCode: `import java.util.*;\n\n{{USER_CODE}}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(sc.hasNextInt()) {\n            int n = sc.nextInt();\n            Solution obj = new Solution();\n            System.out.print(obj.climbStairs(n));\n        }\n    }\n}`
        },
        {
          language: "python",
          initialCode: `class Solution:\n    def climbStairs(self, n: int) -> int:\n        pass`,
          driverCode: `import sys\n\n{{USER_CODE}}\n\nline = sys.stdin.read().strip()\nif line:\n    n = int(line)\n    obj = Solution()\n    print(obj.climbStairs(n))`
        },
        {
          language: "javascript",
          initialCode: `class Solution {\n    climbStairs(n) {\n        \n    }\n}`,
          driverCode: `{{USER_CODE}}\n\nconst fs = require('fs');\nconst line = fs.readFileSync(0, 'utf-8').trim();\nif(line) {\n    const n = parseInt(line);\n    const obj = new Solution();\n    console.log(obj.climbStairs(n));\n}`
        }
      ],
      referenceSolution: [
        { language: "cpp", completeCode: `class Solution {\npublic:\n    int climbStairs(int n) {\n        if (n <= 2) return n;\n        int a = 1, b = 2;\n        for (int i = 3; i <= n; i++) {\n            int c = a + b;\n            a = b;\n            b = c;\n        }\n        return b;\n    }\n};` },
        { language: "java", completeCode: `class Solution {\n    public int climbStairs(int n) {\n        if (n <= 2) return n;\n        int a = 1, b = 2;\n        for (int i = 3; i <= n; i++) {\n            int c = a + b;\n            a = b;\n            b = c;\n        }\n        return b;\n    }\n}` },
        { language: "python", completeCode: `class Solution:\n    def climbStairs(self, n: int) -> int:\n        if n <= 2: return n\n        a, b = 1, 2\n        for _ in range(3, n + 1):\n            a, b = b, a + b\n        return b` },
        { language: "javascript", completeCode: `class Solution {\n    climbStairs(n) {\n        if (n <= 2) return n;\n        let a = 1, b = 2;\n        for (let i = 3; i <= n; i++) {\n            let c = a + b;\n            a = b;\n            b = c;\n        }\n        return b;\n    }\n}` }
      ]
    },
    {
      title: "Maximum Subarray",
      description: `<p>Given an integer array <code>nums</code>, find the subarray with the largest sum, and return <em>its sum</em>.</p>`,
      difficulty: "medium",
      constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
      tags: ["array", "dynamic_programming"],
      visibleTestCases: [
        { input: "9\n-2 1 -3 4 -1 2 1 -5 4", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." },
        { input: "1\n1", output: "1", explanation: "The subarray [1] has the largest sum 1." }
      ],
      hiddenTestCases: [
        { input: "5\n5 4 -1 7 8", output: "23" },
        { input: "3\n-3 -2 -1", output: "-1" }
      ],
      boilerPlate: [
        {
          language: "cpp",
          initialCode: `#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        \n    }\n};`,
          driverCode: `#include <bits/stdc++.h>\nusing namespace std;\n\n{{USER_CODE}}\n\nint main() {\n    int n;\n    if(cin >> n) {\n        vector<int> nums(n);\n        for(int i = 0; i < n; i++) cin >> nums[i];\n        Solution obj;\n        cout << obj.maxSubArray(nums);\n    }\n    return 0;\n}`
        },
        {
          language: "java",
          initialCode: `import java.util.*;\n\nclass Solution {\n    public int maxSubArray(int[] nums) {\n        \n    }\n}`,
          driverCode: `import java.util.*;\n\n{{USER_CODE}}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(sc.hasNextInt()) {\n            int n = sc.nextInt();\n            int[] nums = new int[n];\n            for(int i = 0; i < n; i++) nums[i] = sc.nextInt();\n            Solution obj = new Solution();\n            System.out.print(obj.maxSubArray(nums));\n        }\n    }\n}`
        },
        {
          language: "python",
          initialCode: `class Solution:\n    def maxSubArray(self, nums) -> int:\n        pass`,
          driverCode: `import sys\n\n{{USER_CODE}}\n\nlines = sys.stdin.read().split()\nif lines:\n    n = int(lines[0])\n    nums = [int(x) for x in lines[1:n+1]]\n    obj = Solution()\n    print(obj.maxSubArray(nums))`
        },
        {
          language: "javascript",
          initialCode: `class Solution {\n    maxSubArray(nums) {\n        \n    }\n}`,
          driverCode: `{{USER_CODE}}\n\nconst fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\nif(input.length >= 2) {\n    let idx = 0;\n    const n = parseInt(input[idx++]);\n    const nums = [];\n    for(let i = 0; i < n; i++) nums.push(parseInt(input[idx++]));\n    const obj = new Solution();\n    console.log(obj.maxSubArray(nums));\n}`
        }
      ],
      referenceSolution: [
        { language: "cpp", completeCode: `#include <vector>\n#include <algorithm>\nusing namespace std;\nclass Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        int maxSum = nums[0], curr = nums[0];\n        for (size_t i = 1; i < nums.size(); i++) {\n            curr = max(nums[i], curr + nums[i]);\n            maxSum = max(maxSum, curr);\n        }\n        return maxSum;\n    }\n};` },
        { language: "java", completeCode: `class Solution {\n    public int maxSubArray(int[] nums) {\n        int maxSum = nums[0], curr = nums[0];\n        for (int i = 1; i < nums.length; i++) {\n            curr = Math.max(nums[i], curr + nums[i]);\n            maxSum = Math.max(maxSum, curr);\n        }\n        return maxSum;\n    }\n}` },
        { language: "python", completeCode: `class Solution:\n    def maxSubArray(self, nums) -> int:\n        max_sum = curr = nums[0]\n        for x in nums[1:]:\n            curr = max(x, curr + x)\n            max_sum = max(max_sum, curr)\n        return max_sum` },
        { language: "javascript", completeCode: `class Solution {\n    maxSubArray(nums) {\n        let maxSum = nums[0], curr = nums[0];\n        for (let i = 1; i < nums.length; i++) {\n            curr = Math.max(nums[i], curr + nums[i]);\n            maxSum = Math.max(maxSum, curr);\n        }\n        return maxSum;\n    }\n}` }
      ]
    },
    {
      title: "Container With Most Water",
      description: `<p>You are given an integer array <code>height</code> of length <code>n</code>. Find two lines that together with the x-axis form a container, such that the container contains the most water. Return <em>the maximum amount of water a container can store</em>.</p>`,
      difficulty: "medium",
      constraints: ["n == height.length", "2 <= n <= 10^5", "0 <= height[i] <= 10^4"],
      tags: ["two_pointers", "array"],
      visibleTestCases: [
        { input: "9\n1 8 6 2 5 4 8 3 7", output: "49", explanation: "The max area is between index 1 and 8 (height 8 and 7, width 7 => 7*7 = 49)" },
        { input: "2\n1 1", output: "1", explanation: "Area is 1 * 1 = 1" }
      ],
      hiddenTestCases: [
        { input: "5\n4 3 2 1 4", output: "16" },
        { input: "4\n1 2 1 1", output: "3" }
      ],
      boilerPlate: [
        {
          language: "cpp",
          initialCode: `#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        \n    }\n};`,
          driverCode: `#include <bits/stdc++.h>\nusing namespace std;\n\n{{USER_CODE}}\n\nint main() {\n    int n;\n    if(cin >> n) {\n        vector<int> height(n);\n        for(int i = 0; i < n; i++) cin >> height[i];\n        Solution obj;\n        cout << obj.maxArea(height);\n    }\n    return 0;\n}`
        },
        {
          language: "java",
          initialCode: `import java.util.*;\n\nclass Solution {\n    public int maxArea(int[] height) {\n        \n    }\n}`,
          driverCode: `import java.util.*;\n\n{{USER_CODE}}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(sc.hasNextInt()) {\n            int n = sc.nextInt();\n            int[] height = new int[n];\n            for(int i = 0; i < n; i++) height[i] = sc.nextInt();\n            Solution obj = new Solution();\n            System.out.print(obj.maxArea(height));\n        }\n    }\n}`
        },
        {
          language: "python",
          initialCode: `class Solution:\n    def maxArea(self, height) -> int:\n        pass`,
          driverCode: `import sys\n\n{{USER_CODE}}\n\nlines = sys.stdin.read().split()\nif lines:\n    n = int(lines[0])\n    h = [int(x) for x in lines[1:n+1]]\n    obj = Solution()\n    print(obj.maxArea(h))`
        },
        {
          language: "javascript",
          initialCode: `class Solution {\n    maxArea(height) {\n        \n    }\n}`,
          driverCode: `{{USER_CODE}}\n\nconst fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\nif(input.length >= 2) {\n    let idx = 0;\n    const n = parseInt(input[idx++]);\n    const height = [];\n    for(let i = 0; i < n; i++) height.push(parseInt(input[idx++]));\n    const obj = new Solution();\n    console.log(obj.maxArea(height));\n}`
        }
      ],
      referenceSolution: [
        { language: "cpp", completeCode: `#include <vector>\n#include <algorithm>\nusing namespace std;\nclass Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        int l = 0, r = height.size() - 1, max_a = 0;\n        while(l < r) {\n            int h = min(height[l], height[r]);\n            max_a = max(max_a, h * (r - l));\n            if(height[l] < height[r]) l++;\n            else r--;\n        }\n        return max_a;\n    }\n};` },
        { language: "java", completeCode: `class Solution {\n    public int maxArea(int[] height) {\n        int l = 0, r = height.length - 1, max_a = 0;\n        while(l < r) {\n            int h = Math.min(height[l], height[r]);\n            max_a = Math.max(max_a, h * (r - l));\n            if(height[l] < height[r]) l++;\n            else r--;\n        }\n        return max_a;\n    }\n}` },
        { language: "python", completeCode: `class Solution:\n    def maxArea(self, height) -> int:\n        l, r, max_a = 0, len(height) - 1, 0\n        while l < r:\n            h = min(height[l], height[r])\n            max_a = max(max_a, h * (r - l))\n            if height[l] < height[r]: l += 1\n            else: r -= 1\n        return max_a` },
        { language: "javascript", completeCode: `class Solution {\n    maxArea(height) {\n        let l = 0, r = height.length - 1, max_a = 0;\n        while(l < r) {\n            let h = Math.min(height[l], height[r]);\n            max_a = Math.max(max_a, h * (r - l));\n            if(height[l] < height[r]) l++;\n            else r--;\n        }\n        return max_a;\n    }\n}` }
      ]
    },
    {
      title: "Best Time to Buy and Sell Stock",
      description: `<p>You are given an array <code>prices</code> where <code>prices[i]</code> is the price of a given stock on the <code>i<sup>th</sup></code> day. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return <code>0</code>.</p>`,
      difficulty: "easy",
      constraints: ["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"],
      tags: ["array", "dynamic_programming"],
      visibleTestCases: [
        { input: "6\n7 1 5 3 6 4", output: "5", explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5." },
        { input: "5\n7 6 4 3 1", output: "0", explanation: "No transactions are done, max profit = 0." }
      ],
      hiddenTestCases: [
        { input: "2\n1 2", output: "1" },
        { input: "4\n3 3 5 0", output: "2" }
      ],
      boilerPlate: [
        {
          language: "cpp",
          initialCode: `#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        \n    }\n};`,
          driverCode: `#include <bits/stdc++.h>\nusing namespace std;\n\n{{USER_CODE}}\n\nint main() {\n    int n;\n    if(cin >> n) {\n        vector<int> prices(n);\n        for(int i = 0; i < n; i++) cin >> prices[i];\n        Solution obj;\n        cout << obj.maxProfit(prices);\n    }\n    return 0;\n}`
        },
        {
          language: "java",
          initialCode: `import java.util.*;\n\nclass Solution {\n    public int maxProfit(int[] prices) {\n        \n    }\n}`,
          driverCode: `import java.util.*;\n\n{{USER_CODE}}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(sc.hasNextInt()) {\n            int n = sc.nextInt();\n            int[] prices = new int[n];\n            for(int i = 0; i < n; i++) prices[i] = sc.nextInt();\n            Solution obj = new Solution();\n            System.out.print(obj.maxProfit(prices));\n        }\n    }\n}`
        },
        {
          language: "python",
          initialCode: `class Solution:\n    def maxProfit(self, prices) -> int:\n        pass`,
          driverCode: `import sys\n\n{{USER_CODE}}\n\nlines = sys.stdin.read().split()\nif lines:\n    n = int(lines[0])\n    prices = [int(x) for x in lines[1:n+1]]\n    obj = Solution()\n    print(obj.maxProfit(prices))`
        },
        {
          language: "javascript",
          initialCode: `class Solution {\n    maxProfit(prices) {\n        \n    }\n}`,
          driverCode: `{{USER_CODE}}\n\nconst fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\nif(input.length >= 2) {\n    let idx = 0;\n    const n = parseInt(input[idx++]);\n    const prices = [];\n    for(let i = 0; i < n; i++) prices.push(parseInt(input[idx++]));\n    const obj = new Solution();\n    console.log(obj.maxProfit(prices));\n}`
        }
      ],
      referenceSolution: [
        { language: "cpp", completeCode: `#include <vector>\n#include <algorithm>\nusing namespace std;\nclass Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        int minP = 1e9, maxP = 0;\n        for(int p : prices) {\n            minP = min(minP, p);\n            maxP = max(maxP, p - minP);\n        }\n        return maxP;\n    }\n};` },
        { language: "java", completeCode: `class Solution {\n    public int maxProfit(int[] prices) {\n        int minP = Integer.MAX_VALUE, maxP = 0;\n        for(int p : prices) {\n            minP = Math.min(minP, p);\n            maxP = Math.max(maxP, p - minP);\n        }\n        return maxP;\n    }\n}` },
        { language: "python", completeCode: `class Solution:\n    def maxProfit(self, prices) -> int:\n        min_p, max_p = float('inf'), 0\n        for p in prices:\n            min_p = min(min_p, p)\n            max_p = max(max_p, p - min_p)\n        return max_p` },
        { language: "javascript", completeCode: `class Solution {\n    maxProfit(prices) {\n        let minP = Infinity, maxP = 0;\n        for(let p of prices) {\n            minP = Math.min(minP, p);\n            maxP = Math.max(maxP, p - minP);\n        }\n        return maxP;\n    }\n}` }
      ]
    },
    {
      title: "Search in Rotated Sorted Array",
      description: `<p>Given the array <code>nums</code> after the possible rotation and an integer <code>target</code>, return <em>the index of </em><code>target</code><em> if it is in </em><code>nums</code><em>, or </em><code>-1</code><em> if it is not in </em><code>nums</code>.</p>`,
      difficulty: "medium",
      constraints: ["1 <= nums.length <= 5000", "-10^4 <= nums[i] <= 10^4"],
      tags: ["array", "binary_search"],
      visibleTestCases: [
        { input: "7\n4 5 6 7 0 1 2\n0", output: "4", explanation: "Target 0 is at index 4." },
        { input: "7\n4 5 6 7 0 1 2\n3", output: "-1", explanation: "Target 3 is not in array." }
      ],
      hiddenTestCases: [
        { input: "1\n1\n0", output: "-1" },
        { input: "3\n1 3 5\n5", output: "2" }
      ],
      boilerPlate: [
        {
          language: "cpp",
          initialCode: `#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        \n    }\n};`,
          driverCode: `#include <bits/stdc++.h>\nusing namespace std;\n\n{{USER_CODE}}\n\nint main() {\n    int n;\n    if(cin >> n) {\n        vector<int> nums(n);\n        for(int i = 0; i < n; i++) cin >> nums[i];\n        int target;\n        cin >> target;\n        Solution obj;\n        cout << obj.search(nums, target);\n    }\n    return 0;\n}`
        },
        {
          language: "java",
          initialCode: `import java.util.*;\n\nclass Solution {\n    public int search(int[] nums, int target) {\n        \n    }\n}`,
          driverCode: `import java.util.*;\n\n{{USER_CODE}}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(sc.hasNextInt()) {\n            int n = sc.nextInt();\n            int[] nums = new int[n];\n            for(int i = 0; i < n; i++) nums[i] = sc.nextInt();\n            int target = sc.nextInt();\n            Solution obj = new Solution();\n            System.out.print(obj.search(nums, target));\n        }\n    }\n}`
        },
        {
          language: "python",
          initialCode: `class Solution:\n    def search(self, nums, target: int) -> int:\n        pass`,
          driverCode: `import sys\n\n{{USER_CODE}}\n\nlines = sys.stdin.read().split()\nif lines:\n    n = int(lines[0])\n    nums = [int(x) for x in lines[1:n+1]]\n    target = int(lines[n+1])\n    obj = Solution()\n    print(obj.search(nums, target))`
        },
        {
          language: "javascript",
          initialCode: `class Solution {\n    search(nums, target) {\n        \n    }\n}`,
          driverCode: `{{USER_CODE}}\n\nconst fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\nif(input.length >= 3) {\n    let idx = 0;\n    const n = parseInt(input[idx++]);\n    const nums = [];\n    for(let i = 0; i < n; i++) nums.push(parseInt(input[idx++]));\n    const target = parseInt(input[idx++]);\n    const obj = new Solution();\n    console.log(obj.search(nums, target));\n}`
        }
      ],
      referenceSolution: [
        { language: "cpp", completeCode: `#include <vector>\nusing namespace std;\nclass Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        int l = 0, r = nums.size() - 1;\n        while(l <= r) {\n            int mid = l + (r - l) / 2;\n            if(nums[mid] == target) return mid;\n            if(nums[l] <= nums[mid]) {\n                if(nums[l] <= target && target < nums[mid]) r = mid - 1;\n                else l = mid + 1;\n            } else {\n                if(nums[mid] < target && target <= nums[r]) l = mid + 1;\n                else r = mid - 1;\n            }\n        }\n        return -1;\n    }\n};` },
        { language: "java", completeCode: `class Solution {\n    public int search(int[] nums, int target) {\n        int l = 0, r = nums.length - 1;\n        while(l <= r) {\n            int mid = l + (r - l) / 2;\n            if(nums[mid] == target) return mid;\n            if(nums[l] <= nums[mid]) {\n                if(nums[l] <= target && target < nums[mid]) r = mid - 1;\n                else l = mid + 1;\n            } else {\n                if(nums[mid] < target && target <= nums[r]) l = mid + 1;\n                else r = mid - 1;\n            }\n        }\n        return -1;\n    }\n}` },
        { language: "python", completeCode: `class Solution:\n    def search(self, nums, target: int) -> int:\n        l, r = 0, len(nums) - 1\n        while l <= r:\n            mid = (l + r) // 2\n            if nums[mid] == target: return mid\n            if nums[l] <= nums[mid]:\n                if nums[l] <= target < nums[mid]: r = mid - 1\n                else: l = mid + 1\n            else:\n                if nums[mid] < target <= nums[r]: l = mid + 1\n                else: r = mid - 1\n        return -1` },
        { language: "javascript", completeCode: `class Solution {\n    search(nums, target) {\n        let l = 0, r = nums.length - 1;\n        while(l <= r) {\n            let mid = Math.floor((l + r) / 2);\n            if(nums[mid] === target) return mid;\n            if(nums[l] <= nums[mid]) {\n                if(nums[l] <= target && target < nums[mid]) r = mid - 1;\n                else l = mid + 1;\n            } else {\n                if(nums[mid] < target && target <= nums[r]) l = mid + 1;\n                else r = mid - 1;\n            }\n        }\n        return -1;\n    }\n}` }
      ]
    },
    {
      title: "Coin Change",
      description: `<p>You are given an integer array <code>coins</code> representing coins of different denominations and an integer <code>amount</code> representing a total amount of money. Return <em>the fewest number of coins that you need to make up that amount</em>. If that amount cannot be made up, return <code>-1</code>.</p>`,
      difficulty: "medium",
      constraints: ["1 <= coins.length <= 12", "1 <= coins[i] <= 2^31 - 1", "0 <= amount <= 10^4"],
      tags: ["dynamic_programming"],
      visibleTestCases: [
        { input: "3\n1 2 5\n11", output: "3", explanation: "11 = 5 + 5 + 1" },
        { input: "1\n2\n3", output: "-1", explanation: "Cannot make 3 using coins of denomination 2." }
      ],
      hiddenTestCases: [
        { input: "1\n1\n0", output: "0" },
        { input: "4\n1 3 4 5\n7", output: "2" }
      ],
      boilerPlate: [
        {
          language: "cpp",
          initialCode: `#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        \n    }\n};`,
          driverCode: `#include <bits/stdc++.h>\nusing namespace std;\n\n{{USER_CODE}}\n\nint main() {\n    int n;\n    if(cin >> n) {\n        vector<int> coins(n);\n        for(int i = 0; i < n; i++) cin >> coins[i];\n        int amount;\n        cin >> amount;\n        Solution obj;\n        cout << obj.coinChange(coins, amount);\n    }\n    return 0;\n}`
        },
        {
          language: "java",
          initialCode: `import java.util.*;\n\nclass Solution {\n    public int coinChange(int[] coins, int amount) {\n        \n    }\n}`,
          driverCode: `import java.util.*;\n\n{{USER_CODE}}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(sc.hasNextInt()) {\n            int n = sc.nextInt();\n            int[] coins = new int[n];\n            for(int i = 0; i < n; i++) coins[i] = sc.nextInt();\n            int amount = sc.nextInt();\n            Solution obj = new Solution();\n            System.out.print(obj.coinChange(coins, amount));\n        }\n    }\n}`
        },
        {
          language: "python",
          initialCode: `class Solution:\n    def coinChange(self, coins, amount: int) -> int:\n        pass`,
          driverCode: `import sys\n\n{{USER_CODE}}\n\nlines = sys.stdin.read().split()\nif lines:\n    n = int(lines[0])\n    coins = [int(x) for x in lines[1:n+1]]\n    amount = int(lines[n+1])\n    obj = Solution()\n    print(obj.coinChange(coins, amount))`
        },
        {
          language: "javascript",
          initialCode: `class Solution {\n    coinChange(coins, amount) {\n        \n    }\n}`,
          driverCode: `{{USER_CODE}}\n\nconst fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\nif(input.length >= 3) {\n    let idx = 0;\n    const n = parseInt(input[idx++]);\n    const coins = [];\n    for(let i = 0; i < n; i++) coins.push(parseInt(input[idx++]));\n    const amount = parseInt(input[idx++]);\n    const obj = new Solution();\n    console.log(obj.coinChange(coins, amount));\n}`
        }
      ],
      referenceSolution: [
        { language: "cpp", completeCode: `#include <vector>\n#include <algorithm>\nusing namespace std;\nclass Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        vector<int> dp(amount + 1, amount + 1);\n        dp[0] = 0;\n        for (int i = 1; i <= amount; i++) {\n            for (int c : coins) {\n                if (i >= c) dp[i] = min(dp[i], dp[i - c] + 1);\n            }\n        }\n        return dp[amount] > amount ? -1 : dp[amount];\n    }\n};` },
        { language: "java", completeCode: `import java.util.*;\nclass Solution {\n    public int coinChange(int[] coins, int amount) {\n        int[] dp = new int[amount + 1];\n        Arrays.fill(dp, amount + 1);\n        dp[0] = 0;\n        for (int i = 1; i <= amount; i++) {\n            for (int c : coins) {\n                if (i >= c) dp[i] = Math.min(dp[i], dp[i - c] + 1);\n            }\n        }\n        return dp[amount] > amount ? -1 : dp[amount];\n    }\n}` },
        { language: "python", completeCode: `class Solution:\n    def coinChange(self, coins, amount: int) -> int:\n        dp = [amount + 1] * (amount + 1)\n        dp[0] = 0\n        for i in range(1, amount + 1):\n            for c in coins:\n                if i >= c: dp[i] = min(dp[i], dp[i - c] + 1)\n        return dp[amount] if dp[amount] <= amount else -1` },
        { language: "javascript", completeCode: `class Solution {\n    coinChange(coins, amount) {\n        const dp = new Array(amount + 1).fill(amount + 1);\n        dp[0] = 0;\n        for (let i = 1; i <= amount; i++) {\n            for (let c of coins) {\n                if (i >= c) dp[i] = Math.min(dp[i], dp[i - c] + 1);\n            }\n        }\n        return dp[amount] > amount ? -1 : dp[amount];\n    }\n}` }
      ]
    },
    {
      title: "Trapping Rain Water",
      description: `<p>Given <code>n</code> non-negative integers representing an elevation map where the width of each bar is <code>1</code>, compute how much water it can trap after raining.</p>`,
      difficulty: "hard",
      constraints: ["n == height.length", "1 <= n <= 2 * 10^4", "0 <= height[i] <= 10^5"],
      tags: ["two_pointers", "stack", "array"],
      visibleTestCases: [
        { input: "12\n0 1 0 2 1 0 1 3 2 1 2 1", output: "6", explanation: "6 units of rain water are trapped." },
        { input: "6\n4 2 0 3 2 5", output: "9", explanation: "9 units of rain water are trapped." }
      ],
      hiddenTestCases: [
        { input: "3\n2 0 2", output: "2" },
        { input: "4\n3 0 0 20", output: "6" }
      ],
      boilerPlate: [
        {
          language: "cpp",
          initialCode: `#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    int trap(vector<int>& height) {\n        \n    }\n};`,
          driverCode: `#include <bits/stdc++.h>\nusing namespace std;\n\n{{USER_CODE}}\n\nint main() {\n    int n;\n    if(cin >> n) {\n        vector<int> height(n);\n        for(int i = 0; i < n; i++) cin >> height[i];\n        Solution obj;\n        cout << obj.trap(height);\n    }\n    return 0;\n}`
        },
        {
          language: "java",
          initialCode: `import java.util.*;\n\nclass Solution {\n    public int trap(int[] height) {\n        \n    }\n}`,
          driverCode: `import java.util.*;\n\n{{USER_CODE}}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(sc.hasNextInt()) {\n            int n = sc.nextInt();\n            int[] height = new int[n];\n            for(int i = 0; i < n; i++) height[i] = sc.nextInt();\n            Solution obj = new Solution();\n            System.out.print(obj.trap(height));\n        }\n    }\n}`
        },
        {
          language: "python",
          initialCode: `class Solution:\n    def trap(self, height) -> int:\n        pass`,
          driverCode: `import sys\n\n{{USER_CODE}}\n\nlines = sys.stdin.read().split()\nif lines:\n    n = int(lines[0])\n    height = [int(x) for x in lines[1:n+1]]\n    obj = Solution()\n    print(obj.trap(height))`
        },
        {
          language: "javascript",
          initialCode: `class Solution {\n    trap(height) {\n        \n    }\n}`,
          driverCode: `{{USER_CODE}}\n\nconst fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\nif(input.length >= 2) {\n    let idx = 0;\n    const n = parseInt(input[idx++]);\n    const height = [];\n    for(let i = 0; i < n; i++) height.push(parseInt(input[idx++]));\n    const obj = new Solution();\n    console.log(obj.trap(height));\n}`
        }
      ],
      referenceSolution: [
        { language: "cpp", completeCode: `#include <vector>\n#include <algorithm>\nusing namespace std;\nclass Solution {\npublic:\n    int trap(vector<int>& height) {\n        int l = 0, r = height.size() - 1, leftMax = 0, rightMax = 0, res = 0;\n        while(l < r) {\n            if(height[l] < height[r]) {\n                if(height[l] >= leftMax) leftMax = height[l];\n                else res += leftMax - height[l];\n                l++;\n            } else {\n                if(height[r] >= rightMax) rightMax = height[r];\n                else res += rightMax - height[r];\n                r--;\n            }\n        }\n        return res;\n    }\n};` },
        { language: "java", completeCode: `class Solution {\n    public int trap(int[] height) {\n        int l = 0, r = height.length - 1, leftMax = 0, rightMax = 0, res = 0;\n        while(l < r) {\n            if(height[l] < height[r]) {\n                if(height[l] >= leftMax) leftMax = height[l];\n                else res += leftMax - height[l];\n                l++;\n            } else {\n                if(height[r] >= rightMax) rightMax = height[r];\n                else res += rightMax - height[r];\n                r--;\n            }\n        }\n        return res;\n    }\n}` },
        { language: "python", completeCode: `class Solution:\n    def trap(self, height) -> int:\n        l, r, leftMax, rightMax, res = 0, len(height) - 1, 0, 0, 0\n        while l < r:\n            if height[l] < height[r]:\n                if height[l] >= leftMax: leftMax = height[l]\n                else: res += leftMax - height[l]\n                l += 1\n            else:\n                if height[r] >= rightMax: rightMax = height[r]\n                else: res += rightMax - height[r]\n                r -= 1\n        return res` },
        { language: "javascript", completeCode: `class Solution {\n    trap(height) {\n        let l = 0, r = height.length - 1, leftMax = 0, rightMax = 0, res = 0;\n        while(l < r) {\n            if(height[l] < height[r]) {\n                if(height[l] >= leftMax) leftMax = height[l];\n                else res += leftMax - height[l];\n                l++;\n            } else {\n                if(height[r] >= rightMax) rightMax = height[r];\n                else res += rightMax - height[r];\n                r--;\n            }\n        }\n        return res;\n    }\n}` }
      ]
    },
    {
      title: "Longest Substring Without Repeating Characters",
      description: `<p>Given a string <code>s</code>, find the length of the <strong>longest substring</strong> without repeating characters.</p>`,
      difficulty: "medium",
      constraints: ["0 <= s.length <= 5 * 10^4", "s consists of English letters, digits, symbols and spaces."],
      tags: ["string", "sliding_window", "hashing"],
      visibleTestCases: [
        { input: "abcabcbb", output: "3", explanation: "The answer is 'abc', with the length of 3." },
        { input: "bbbbb", output: "1", explanation: "The answer is 'b', with the length of 1." }
      ],
      hiddenTestCases: [
        { input: "pwwkew", output: "3" },
        { input: "a", output: "1" }
      ],
      boilerPlate: [
        {
          language: "cpp",
          initialCode: `#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        \n    }\n};`,
          driverCode: `#include <bits/stdc++.h>\nusing namespace std;\n\n{{USER_CODE}}\n\nint main() {\n    string s;\n    if(cin >> s) {\n        Solution obj;\n        cout << obj.lengthOfLongestSubstring(s);\n    } else {\n        cout << 0;\n    }\n    return 0;\n}`
        },
        {
          language: "java",
          initialCode: `import java.util.*;\n\nclass Solution {\n    public int lengthOfLongestSubstring(String s) {\n        \n    }\n}`,
          driverCode: `import java.util.*;\n\n{{USER_CODE}}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(sc.hasNext()) {\n            String s = sc.next();\n            Solution obj = new Solution();\n            System.out.print(obj.lengthOfLongestSubstring(s));\n        } else {\n            System.out.print(0);\n        }\n    }\n}`
        },
        {
          language: "python",
          initialCode: `class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        pass`,
          driverCode: `import sys\n\n{{USER_CODE}}\n\ns = sys.stdin.read().strip()\nobj = Solution()\nprint(obj.lengthOfLongestSubstring(s))`
        },
        {
          language: "javascript",
          initialCode: `class Solution {\n    lengthOfLongestSubstring(s) {\n        \n    }\n}`,
          driverCode: `{{USER_CODE}}\n\nconst fs = require('fs');\nconst s = fs.readFileSync(0, 'utf-8').trim();\nconst obj = new Solution();\nconsole.log(obj.lengthOfLongestSubstring(s));`
        }
      ],
      referenceSolution: [
        { language: "cpp", completeCode: `#include <string>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nclass Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        vector<int> last(256, -1);\n        int left = 0, maxLen = 0;\n        for(int right = 0; right < s.length(); right++) {\n            if(last[(unsigned char)s[right]] >= left) {\n                left = last[(unsigned char)s[right]] + 1;\n            }\n            last[(unsigned char)s[right]] = right;\n            maxLen = max(maxLen, right - left + 1);\n        }\n        return maxLen;\n    }\n};` },
        { language: "java", completeCode: `import java.util.*;\nclass Solution {\n    public int lengthOfLongestSubstring(String s) {\n        int[] last = new int[256];\n        Arrays.fill(last, -1);\n        int left = 0, maxLen = 0;\n        for(int right = 0; right < s.length(); right++) {\n            if(last[s.charAt(right)] >= left) {\n                left = last[s.charAt(right)] + 1;\n            }\n            last[s.charAt(right)] = right;\n            maxLen = Math.max(maxLen, right - left + 1);\n        }\n        return maxLen;\n    }\n}` },
        { language: "python", completeCode: `class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        mp = {}\n        left = max_len = 0\n        for right, char in enumerate(s):\n            if char in mp and mp[char] >= left:\n                left = mp[char] + 1\n            mp[char] = right\n            max_len = max(max_len, right - left + 1)\n        return max_len` },
        { language: "javascript", completeCode: `class Solution {\n    lengthOfLongestSubstring(s) {\n        const mp = new Map();\n        let left = 0, maxLen = 0;\n        for (let right = 0; right < s.length; right++) {\n            const char = s[right];\n            if (mp.has(char) && mp.get(char) >= left) {\n                left = mp.get(char) + 1;\n            }\n            mp.set(char, right);\n            maxLen = Math.max(maxLen, right - left + 1);\n        }\n        return maxLen;\n    }\n}` }
      ]
    },
    {
      title: "3Sum",
      description: `<p>Given an integer array <code>nums</code>, return all the triplets <code>[nums[i], nums[j], nums[k]]</code> such that <code>i != j</code>, <code>i != k</code>, and <code>j != k</code>, and <code>nums[i] + nums[j] + nums[k] == 0</code>.</p>`,
      difficulty: "medium",
      constraints: ["3 <= nums.length <= 3000", "-10^5 <= nums[i] <= 10^5"],
      tags: ["array", "two_pointers", "sorting"],
      visibleTestCases: [
        { input: "6\n-1 0 1 2 -1 -4", output: "-1 -1 2\n-1 0 1", explanation: "Triplets adding to 0 are [-1, -1, 2] and [-1, 0, 1]" }
      ],
      hiddenTestCases: [
        { input: "3\n0 0 0", output: "0 0 0" },
        { input: "4\n-2 0 1 1", output: "-2 0 2" }
      ],
      boilerPlate: [
        {
          language: "cpp",
          initialCode: `#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        \n    }\n};`,
          driverCode: `#include <bits/stdc++.h>\nusing namespace std;\n\n{{USER_CODE}}\n\nint main() {\n    int n;\n    if(cin >> n) {\n        vector<int> nums(n);\n        for(int i = 0; i < n; i++) cin >> nums[i];\n        Solution obj;\n        auto ans = obj.threeSum(nums);\n        for(int i = 0; i < ans.size(); i++) {\n            cout << ans[i][0] << ' ' << ans[i][1] << ' ' << ans[i][2];\n            if(i != ans.size() - 1) cout << '\\n';\n        }\n    }\n    return 0;\n}`
        },
        {
          language: "java",
          initialCode: `import java.util.*;\n\nclass Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        \n    }\n}`,
          driverCode: `import java.util.*;\n\n{{USER_CODE}}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(sc.hasNextInt()) {\n            int n = sc.nextInt();\n            int[] nums = new int[n];\n            for(int i = 0; i < n; i++) nums[i] = sc.nextInt();\n            Solution obj = new Solution();\n            List<List<Integer>> ans = obj.threeSum(nums);\n            for(int i = 0; i < ans.size(); i++) {\n                System.out.print(ans.get(i).get(0) + " " + ans.get(i).get(1) + " " + ans.get(i).get(2));\n                if(i != ans.size() - 1) System.out.println();\n            }\n        }\n    }\n}`
        },
        {
          language: "python",
          initialCode: `class Solution:\n    def threeSum(self, nums):\n        pass`,
          driverCode: `import sys\n\n{{USER_CODE}}\n\nlines = sys.stdin.read().split()\nif lines:\n    n = int(lines[0])\n    nums = [int(x) for x in lines[1:n+1]]\n    obj = Solution()\n    ans = obj.threeSum(nums)\n    for row in ans:\n        print(*row)`
        },
        {
          language: "javascript",
          initialCode: `class Solution {\n    threeSum(nums) {\n        \n    }\n}`,
          driverCode: `{{USER_CODE}}\n\nconst fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\nif(input.length >= 2) {\n    let idx = 0;\n    const n = parseInt(input[idx++]);\n    const nums = [];\n    for(let i = 0; i < n; i++) nums.push(parseInt(input[idx++]));\n    const obj = new Solution();\n    const ans = obj.threeSum(nums);\n    console.log(ans.map(row => row.join(' ')).join('\\n'));\n}`
        }
      ],
      referenceSolution: [
        { language: "cpp", completeCode: `#include <vector>\n#include <algorithm>\nusing namespace std;\nclass Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        sort(nums.begin(), nums.end());\n        vector<vector<int>> res;\n        for (int i = 0; i < (int)nums.size() - 2; i++) {\n            if (i > 0 && nums[i] == nums[i - 1]) continue;\n            int l = i + 1, r = nums.size() - 1;\n            while (l < r) {\n                int sum = nums[i] + nums[l] + nums[r];\n                if (sum == 0) {\n                    res.push_back({nums[i], nums[l], nums[r]});\n                    while (l < r && nums[l] == nums[l + 1]) l++;\n                    while (l < r && nums[r] == nums[r - 1]) r--;\n                    l++; r--;\n                } else if (sum < 0) l++;\n                else r--;\n            }\n        }\n        return res;\n    }\n};` },
        { language: "java", completeCode: `import java.util.*;\nclass Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        Arrays.sort(nums);\n        List<List<Integer>> res = new ArrayList<>();\n        for (int i = 0; i < nums.length - 2; i++) {\n            if (i > 0 && nums[i] == nums[i - 1]) continue;\n            int l = i + 1, r = nums.length - 1;\n            while (l < r) {\n                int sum = nums[i] + nums[l] + nums[r];\n                if (sum == 0) {\n                    res.add(Arrays.asList(nums[i], nums[l], nums[r]));\n                    while (l < r && nums[l] == nums[l + 1]) l++;\n                    while (l < r && nums[r] == nums[r - 1]) r--;\n                    l++; r--;\n                } else if (sum < 0) l++;\n                else r--;\n            }\n        }\n        return res;\n    }\n}` },
        { language: "python", completeCode: `class Solution:\n    def threeSum(self, nums):\n        nums.sort()\n        res = []\n        for i in range(len(nums) - 2):\n            if i > 0 and nums[i] == nums[i - 1]: continue\n            l, r = i + 1, len(nums) - 1\n            while l < r:\n                s = nums[i] + nums[l] + nums[r]\n                if s == 0:\n                    res.append([nums[i], nums[l], nums[r]])\n                    while l < r and nums[l] == nums[l + 1]: l += 1\n                    while l < r and nums[r] == nums[r - 1]: r -= 1\n                    l += 1; r -= 1\n                elif s < 0: l += 1\n                else: r -= 1\n        return res` },
        { language: "javascript", completeCode: `class Solution {\n    threeSum(nums) {\n        nums.sort((a, b) => a - b);\n        const res = [];\n        for (let i = 0; i < nums.length - 2; i++) {\n            if (i > 0 && nums[i] === nums[i - 1]) continue;\n            let l = i + 1, r = nums.length - 1;\n            while (l < r) {\n                const sum = nums[i] + nums[l] + nums[r];\n                if (sum === 0) {\n                    res.push([nums[i], nums[l], nums[r]]);\n                    while (l < r && nums[l] === nums[l + 1]) l++;\n                    while (l < r && nums[r] === nums[r - 1]) r--;\n                    l++; r--;\n                } else if (sum < 0) l++;\n                else r--;\n            }\n        }\n        return res;\n    }\n}` }
      ]
    },
    {
      title: "Product of Array Except Self",
      description: `<p>Given an integer array <code>nums</code>, return <em>an array</em> <code>answer</code> <em>such that</em> <code>answer[i]</code> <em>is equal to the product of all the elements of</em> <code>nums</code> <em>except</em> <code>nums[i]</code>.</p>`,
      difficulty: "medium",
      constraints: ["2 <= nums.length <= 10^5", "-30 <= nums[i] <= 30"],
      tags: ["array", "prefix_sum"],
      visibleTestCases: [
        { input: "4\n1 2 3 4", output: "24 12 8 6", explanation: "Product except 1 is 24, except 2 is 12, except 3 is 8, except 4 is 6." },
        { input: "5\n-1 1 0 -3 3", output: "0 0 9 0 0", explanation: "Product except 0 is 9, all others involve multiplying by 0." }
      ],
      hiddenTestCases: [
        { input: "2\n5 10", output: "10 5" }
      ],
      boilerPlate: [
        {
          language: "cpp",
          initialCode: `#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> productExceptSelf(vector<int>& nums) {\n        \n    }\n};`,
          driverCode: `#include <bits/stdc++.h>\nusing namespace std;\n\n{{USER_CODE}}\n\nint main() {\n    int n;\n    if(cin >> n) {\n        vector<int> nums(n);\n        for(int i = 0; i < n; i++) cin >> nums[i];\n        Solution obj;\n        vector<int> ans = obj.productExceptSelf(nums);\n        for(int i = 0; i < ans.size(); i++) {\n            cout << ans[i];\n            if(i != ans.size() - 1) cout << ' ';\n        }\n    }\n    return 0;\n}`
        },
        {
          language: "java",
          initialCode: `import java.util.*;\n\nclass Solution {\n    public int[] productExceptSelf(int[] nums) {\n        \n    }\n}`,
          driverCode: `import java.util.*;\n\n{{USER_CODE}}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(sc.hasNextInt()) {\n            int n = sc.nextInt();\n            int[] nums = new int[n];\n            for(int i = 0; i < n; i++) nums[i] = sc.nextInt();\n            Solution obj = new Solution();\n            int[] ans = obj.productExceptSelf(nums);\n            for(int i = 0; i < ans.length; i++) {\n                System.out.print(ans[i]);\n                if(i != ans.length - 1) System.out.print(" ");\n            }\n        }\n    }\n}`
        },
        {
          language: "python",
          initialCode: `class Solution:\n    def productExceptSelf(self, nums):\n        pass`,
          driverCode: `import sys\n\n{{USER_CODE}}\n\nlines = sys.stdin.read().split()\nif lines:\n    n = int(lines[0])\n    nums = [int(x) for x in lines[1:n+1]]\n    obj = Solution()\n    ans = obj.productExceptSelf(nums)\n    print(*ans)`
        },
        {
          language: "javascript",
          initialCode: `class Solution {\n    productExceptSelf(nums) {\n        \n    }\n}`,
          driverCode: `{{USER_CODE}}\n\nconst fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\nif(input.length >= 2) {\n    let idx = 0;\n    const n = parseInt(input[idx++]);\n    const nums = [];\n    for(let i = 0; i < n; i++) nums.push(parseInt(input[idx++]));\n    const obj = new Solution();\n    const ans = obj.productExceptSelf(nums);\n    console.log(ans.join(' '));\n}`
        }
      ],
      referenceSolution: [
        { language: "cpp", completeCode: `#include <vector>\nusing namespace std;\nclass Solution {\npublic:\n    vector<int> productExceptSelf(vector<int>& nums) {\n        int n = nums.size();\n        vector<int> ans(n, 1);\n        int left = 1;\n        for (int i = 0; i < n; i++) {\n            ans[i] = left;\n            left *= nums[i];\n        }\n        int right = 1;\n        for (int i = n - 1; i >= 0; i--) {\n            ans[i] *= right;\n            right *= nums[i];\n        }\n        return ans;\n    }\n};` },
        { language: "java", completeCode: `class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        int n = nums.length;\n        int[] ans = new int[n];\n        ans[0] = 1;\n        for (int i = 1; i < n; i++) ans[i] = ans[i - 1] * nums[i - 1];\n        int right = 1;\n        for (int i = n - 1; i >= 0; i--) {\n            ans[i] *= right;\n            right *= nums[i];\n        }\n        return ans;\n    }\n}` },
        { language: "python", completeCode: `class Solution:\n    def productExceptSelf(self, nums):\n        n = len(nums)\n        ans = [1] * n\n        left = 1\n        for i in range(n):\n            ans[i] = left\n            left *= nums[i]\n        right = 1\n        for i in range(n - 1, -1, -1):\n            ans[i] *= right\n            right *= nums[i]\n        return ans` },
        { language: "javascript", completeCode: `class Solution {\n    productExceptSelf(nums) {\n        const n = nums.length;\n        const ans = new Array(n).fill(1);\n        let left = 1;\n        for (let i = 0; i < n; i++) {\n            ans[i] = left;\n            left *= nums[i];\n        }\n        let right = 1;\n        for (let i = n - 1; i >= 0; i--) {\n            ans[i] *= right;\n            right *= nums[i];\n        }\n        return ans;\n    }\n}` }
      ]
    },
    {
      title: "Spiral Matrix",
      description: `<p>Given an <code>m x n</code> <code>matrix</code>, return <em>all elements of the</em> <code>matrix</code> <em>in spiral order</em>.</p>`,
      difficulty: "medium",
      constraints: ["m == matrix.length", "n == matrix[i].length", "1 <= m, n <= 10"],
      tags: ["matrix", "simulation"],
      visibleTestCases: [
        { input: "3 3\n1 2 3\n4 5 6\n7 8 9", output: "1 2 3 6 9 8 7 4 5", explanation: "Spiral order of 3x3 matrix." }
      ],
      hiddenTestCases: [
        { input: "3 4\n1 2 3 4\n5 6 7 8\n9 10 11 12", output: "1 2 3 4 8 12 11 10 9 5 6 7" }
      ],
      boilerPlate: [
        {
          language: "cpp",
          initialCode: `#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> spiralOrder(vector<vector<int>>& matrix) {\n        \n    }\n};`,
          driverCode: `#include <bits/stdc++.h>\nusing namespace std;\n\n{{USER_CODE}}\n\nint main() {\n    int m, n;\n    if(cin >> m >> n) {\n        vector<vector<int>> matrix(m, vector<int>(n));\n        for(int i = 0; i < m; i++)\n            for(int j = 0; j < n; j++) cin >> matrix[i][j];\n        Solution obj;\n        vector<int> ans = obj.spiralOrder(matrix);\n        for(int i = 0; i < ans.size(); i++) {\n            cout << ans[i];\n            if(i != ans.size() - 1) cout << ' ';\n        }\n    }\n    return 0;\n}`
        },
        {
          language: "java",
          initialCode: `import java.util.*;\n\nclass Solution {\n    public List<Integer> spiralOrder(int[][] matrix) {\n        \n    }\n}`,
          driverCode: `import java.util.*;\n\n{{USER_CODE}}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(sc.hasNextInt()) {\n            int m = sc.nextInt();\n            int n = sc.nextInt();\n            int[][] matrix = new int[m][n];\n            for(int i = 0; i < m; i++)\n                for(int j = 0; j < n; j++) matrix[i][j] = sc.nextInt();\n            Solution obj = new Solution();\n            List<Integer> ans = obj.spiralOrder(matrix);\n            for(int i = 0; i < ans.size(); i++) {\n                System.out.print(ans.get(i));\n                if(i != ans.size() - 1) System.out.print(" ");\n            }\n        }\n    }\n}`
        },
        {
          language: "python",
          initialCode: `class Solution:\n    def spiralOrder(self, matrix):\n        pass`,
          driverCode: `import sys\n\n{{USER_CODE}}\n\nlines = sys.stdin.read().split()\nif lines:\n    m, n = int(lines[0]), int(lines[1])\n    idx = 2\n    matrix = []\n    for _ in range(m):\n        matrix.append([int(x) for x in lines[idx:idx+n]])\n        idx += n\n    obj = Solution()\n    ans = obj.spiralOrder(matrix)\n    print(*ans)`
        },
        {
          language: "javascript",
          initialCode: `class Solution {\n    spiralOrder(matrix) {\n        \n    }\n}`,
          driverCode: `{{USER_CODE}}\n\nconst fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\nif(input.length >= 3) {\n    let idx = 0;\n    const m = parseInt(input[idx++]);\n    const n = parseInt(input[idx++]);\n    const matrix = [];\n    for(let i = 0; i < m; i++) {\n        const row = [];\n        for(let j = 0; j < n; j++) row.push(parseInt(input[idx++]));\n        matrix.push(row);\n    }\n    const obj = new Solution();\n    const ans = obj.spiralOrder(matrix);\n    console.log(ans.join(' '));\n}`
        }
      ],
      referenceSolution: [
        { language: "cpp", completeCode: `#include <vector>\nusing namespace std;\nclass Solution {\npublic:\n    vector<int> spiralOrder(vector<vector<int>>& matrix) {\n        vector<int> res;\n        if(matrix.empty()) return res;\n        int top = 0, bottom = matrix.size() - 1;\n        int left = 0, right = matrix[0].size() - 1;\n        while(top <= bottom && left <= right) {\n            for(int j = left; j <= right; j++) res.push_back(matrix[top][j]);\n            top++;\n            for(int i = top; i <= bottom; i++) res.push_back(matrix[i][right]);\n            right--;\n            if(top <= bottom) {\n                for(int j = right; j >= left; j--) res.push_back(matrix[bottom][j]);\n                bottom--;\n            }\n            if(left <= right) {\n                for(int i = bottom; i >= top; i--) res.push_back(matrix[i][left]);\n                left++;\n            }\n        }\n        return res;\n    }\n};` },
        { language: "java", completeCode: `import java.util.*;\nclass Solution {\n    public List<Integer> spiralOrder(int[][] matrix) {\n        List<Integer> res = new ArrayList<>();\n        if(matrix.length == 0) return res;\n        int top = 0, bottom = matrix.length - 1;\n        int left = 0, right = matrix[0].length - 1;\n        while(top <= bottom && left <= right) {\n            for(int j = left; j <= right; j++) res.add(matrix[top][j]);\n            top++;\n            for(int i = top; i <= bottom; i++) res.add(matrix[i][right]);\n            right--;\n            if(top <= bottom) {\n                for(int j = right; j >= left; j--) res.add(matrix[bottom][j]);\n                bottom--;\n            }\n            if(left <= right) {\n                for(int i = bottom; i >= top; i--) res.add(matrix[i][left]);\n                left++;\n            }\n        }\n        return res;\n    }\n}` },
        { language: "python", completeCode: `class Solution:\n    def spiralOrder(self, matrix):\n        res = []\n        if not matrix: return res\n        top, bottom, left, right = 0, len(matrix) - 1, 0, len(matrix[0]) - 1\n        while top <= bottom and left <= right:\n            for j in range(left, right + 1): res.append(matrix[top][j])\n            top += 1\n            for i in range(top, bottom + 1): res.append(matrix[i][right])\n            right -= 1\n            if top <= bottom:\n                for j in range(right, left - 1, -1): res.append(matrix[bottom][j])\n                bottom -= 1\n            if left <= right:\n                for i in range(bottom, top - 1, -1): res.append(matrix[i][left])\n                left += 1\n        return res` },
        { language: "javascript", completeCode: `class Solution {\n    spiralOrder(matrix) {\n        const res = [];\n        if(!matrix.length) return res;\n        let top = 0, bottom = matrix.length - 1;\n        let left = 0, right = matrix[0].length - 1;\n        while(top <= bottom && left <= right) {\n            for(let j = left; j <= right; j++) res.push(matrix[top][j]);\n            top++;\n            for(let i = top; i <= bottom; i++) res.push(matrix[i][right]);\n            right--;\n            if(top <= bottom) {\n                for(let j = right; j >= left; j--) res.push(matrix[bottom][j]);\n                bottom--;\n            }\n            if(left <= right) {\n                for(let i = bottom; i >= top; i--) res.push(matrix[i][left]);\n                left++;\n            }\n        }\n        return res;\n    }\n}` }
      ]
    },
    {
      title: "Rotate Image",
      description: `<p>You are given an <code>n x n</code> 2D <code>matrix</code> representing an image, rotate the image by 90 degrees (clockwise).</p>`,
      difficulty: "medium",
      constraints: ["n == matrix.length == matrix[i].length", "1 <= n <= 20"],
      tags: ["matrix", "two_pointers"],
      visibleTestCases: [
        { input: "3\n1 2 3\n4 5 6\n7 8 9", output: "7 4 1\n8 5 2\n9 6 3", explanation: "3x3 matrix rotated 90 deg clockwise." }
      ],
      hiddenTestCases: [
        { input: "4\n5 1 9 11\n2 4 8 10\n13 3 6 7\n15 14 12 16", output: "15 13 2 5\n14 3 4 1\n12 6 8 9\n16 7 10 11" }
      ],
      boilerPlate: [
        {
          language: "cpp",
          initialCode: `#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    void rotate(vector<vector<int>>& matrix) {\n        \n    }\n};`,
          driverCode: `#include <bits/stdc++.h>\nusing namespace std;\n\n{{USER_CODE}}\n\nint main() {\n    int n;\n    if(cin >> n) {\n        vector<vector<int>> matrix(n, vector<int>(n));\n        for(int i = 0; i < n; i++)\n            for(int j = 0; j < n; j++) cin >> matrix[i][j];\n        Solution obj;\n        obj.rotate(matrix);\n        for(int i = 0; i < n; i++) {\n            for(int j = 0; j < n; j++) {\n                cout << matrix[i][j];\n                if(j != n - 1) cout << ' ';\n            }\n            if(i != n - 1) cout << '\\n';\n        }\n    }\n    return 0;\n}`
        },
        {
          language: "java",
          initialCode: `import java.util.*;\n\nclass Solution {\n    public void rotate(int[][] matrix) {\n        \n    }\n}`,
          driverCode: `import java.util.*;\n\n{{USER_CODE}}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(sc.hasNextInt()) {\n            int n = sc.nextInt();\n            int[][] matrix = new int[n][n];\n            for(int i = 0; i < n; i++)\n                for(int j = 0; j < n; j++) matrix[i][j] = sc.nextInt();\n            Solution obj = new Solution();\n            obj.rotate(matrix);\n            for(int i = 0; i < n; i++) {\n                for(int j = 0; j < n; j++) {\n                    System.out.print(matrix[i][j]);\n                    if(j != n - 1) System.out.print(" ");\n                }\n                if(i != n - 1) System.out.println();\n            }\n        }\n    }\n}`
        },
        {
          language: "python",
          initialCode: `class Solution:\n    def rotate(self, matrix) -> None:\n        pass`,
          driverCode: `import sys\n\n{{USER_CODE}}\n\nlines = sys.stdin.read().split()\nif lines:\n    n = int(lines[0])\n    idx = 1\n    matrix = []\n    for _ in range(n):\n        matrix.append([int(x) for x in lines[idx:idx+n]])\n        idx += n\n    obj = Solution()\n    obj.rotate(matrix)\n    for row in matrix:\n        print(*row)`
        },
        {
          language: "javascript",
          initialCode: `class Solution {\n    rotate(matrix) {\n        \n    }\n}`,
          driverCode: `{{USER_CODE}}\n\nconst fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\nif(input.length >= 2) {\n    let idx = 0;\n    const n = parseInt(input[idx++]);\n    const matrix = [];\n    for(let i = 0; i < n; i++) {\n        const row = [];\n        for(let j = 0; j < n; j++) row.push(parseInt(input[idx++]));\n        matrix.push(row);\n    }\n    const obj = new Solution();\n    obj.rotate(matrix);\n    console.log(matrix.map(row => row.join(' ')).join('\\n'));\n}`
        }
      ],
      referenceSolution: [
        { language: "cpp", completeCode: `#include <vector>\n#include <algorithm>\nusing namespace std;\nclass Solution {\npublic:\n    void rotate(vector<vector<int>>& matrix) {\n        int n = matrix.size();\n        for(int i = 0; i < n; i++) {\n            for(int j = i + 1; j < n; j++) swap(matrix[i][j], matrix[j][i]);\n        }\n        for(int i = 0; i < n; i++) reverse(matrix[i].begin(), matrix[i].end());\n    }\n};` },
        { language: "java", completeCode: `class Solution {\n    public void rotate(int[][] matrix) {\n        int n = matrix.length;\n        for(int i = 0; i < n; i++) {\n            for(int j = i + 1; j < n; j++) {\n                int temp = matrix[i][j];\n                matrix[i][j] = matrix[j][i];\n                matrix[j][i] = temp;\n            }\n        }\n        for(int i = 0; i < n; i++) {\n            for(int j = 0; j < n / 2; j++) {\n                int temp = matrix[i][j];\n                matrix[i][j] = matrix[i][n - 1 - j];\n                matrix[i][n - 1 - j] = temp;\n            }\n        }\n    }\n}` },
        { language: "python", completeCode: `class Solution:\n    def rotate(self, matrix) -> None:\n        n = len(matrix)\n        for i in range(n):\n            for j in range(i + 1, n):\n                matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]\n        for i in range(n):\n            matrix[i].reverse()` },
        { language: "javascript", completeCode: `class Solution {\n    rotate(matrix) {\n        const n = matrix.length;\n        for(let i = 0; i < n; i++) {\n            for(let j = i + 1; j < n; j++) {\n                const temp = matrix[i][j];\n                matrix[i][j] = matrix[j][i];\n                matrix[j][i] = temp;\n            }\n        }\n        for(let i = 0; i < n; i++) matrix[i].reverse();\n    }\n}` }
      ]
    },
    {
      title: "Group Anagrams",
      description: `<p>Given an array of strings <code>strs</code>, group the anagrams together. You can return the answer in <strong>any order</strong>.</p>`,
      difficulty: "medium",
      constraints: ["1 <= strs.length <= 10^4", "0 <= strs[i].length <= 100", "strs[i] consists of lowercase English letters."],
      tags: ["array", "hashing", "string", "sorting"],
      visibleTestCases: [
        { input: "6\neat tea tan ate nat bat", output: "ate eat tea\nnat tan\nbat", explanation: "Anagrams grouped together." }
      ],
      hiddenTestCases: [
        { input: "1\na", output: "a" }
      ],
      boilerPlate: [
        {
          language: "cpp",
          initialCode: `#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<string>> groupAnagrams(vector<string>& strs) {\n        \n    }\n};`,
          driverCode: `#include <bits/stdc++.h>\nusing namespace std;\n\n{{USER_CODE}}\n\nint main() {\n    int n;\n    if(cin >> n) {\n        vector<string> strs(n);\n        for(int i = 0; i < n; i++) cin >> strs[i];\n        Solution obj;\n        auto ans = obj.groupAnagrams(strs);\n        for(auto& group : ans) sort(group.begin(), group.end());\n        sort(ans.begin(), ans.end());\n        for(int i = 0; i < ans.size(); i++) {\n            for(int j = 0; j < ans[i].size(); j++) {\n                cout << ans[i][j];\n                if(j != ans[i].size() - 1) cout << ' ';\n            }\n            if(i != ans.size() - 1) cout << '\\n';\n        }\n    }\n    return 0;\n}`
        },
        {
          language: "java",
          initialCode: `import java.util.*;\n\nclass Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        \n    }\n}`,
          driverCode: `import java.util.*;\n\n{{USER_CODE}}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(sc.hasNextInt()) {\n            int n = sc.nextInt();\n            String[] strs = new String[n];\n            for(int i = 0; i < n; i++) strs[i] = sc.next();\n            Solution obj = new Solution();\n            List<List<String>> ans = obj.groupAnagrams(strs);\n            for(List<String> g : ans) Collections.sort(g);\n            ans.sort((a, b) -> a.toString().compareTo(b.toString()));\n            for(int i = 0; i < ans.size(); i++) {\n                for(int j = 0; j < ans.get(i).size(); j++) {\n                    System.out.print(ans.get(i).get(j));\n                    if(j != ans.get(i).size() - 1) System.out.print(" ");\n                }\n                if(i != ans.size() - 1) System.out.println();\n            }\n        }\n    }\n}`
        },
        {
          language: "python",
          initialCode: `class Solution:\n    def groupAnagrams(self, strs):\n        pass`,
          driverCode: `import sys\n\n{{USER_CODE}}\n\nlines = sys.stdin.read().split()\nif lines:\n    n = int(lines[0])\n    strs = lines[1:n+1]\n    obj = Solution()\n    ans = obj.groupAnagrams(strs)\n    ans = [sorted(g) for g in ans]\n    ans.sort()\n    for g in ans:\n        print(*g)`
        },
        {
          language: "javascript",
          initialCode: `class Solution {\n    groupAnagrams(strs) {\n        \n    }\n}`,
          driverCode: `{{USER_CODE}}\n\nconst fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\nif(input.length >= 2) {\n    let idx = 0;\n    const n = parseInt(input[idx++]);\n    const strs = [];\n    for(let i = 0; i < n; i++) strs.push(input[idx++]);\n    const obj = new Solution();\n    let ans = obj.groupAnagrams(strs);\n    ans = ans.map(g => g.sort());\n    ans.sort((a, b) => a.join(' ').localeCompare(b.join(' ')));\n    console.log(ans.map(g => g.join(' ')).join('\\n'));\n}`
        }
      ],
      referenceSolution: [
        { language: "cpp", completeCode: `#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\nclass Solution {\npublic:\n    vector<vector<string>> groupAnagrams(vector<string>& strs) {\n        unordered_map<string, vector<string>> mp;\n        for(auto& s : strs) {\n            string key = s;\n            sort(key.begin(), key.end());\n            mp[key].push_back(s);\n        }\n        vector<vector<string>> res;\n        for(auto& p : mp) res.push_back(p.second);\n        return res;\n    }\n};` },
        { language: "java", completeCode: `import java.util.*;\nclass Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        Map<String, List<String>> map = new HashMap<>();\n        for(String s : strs) {\n            char[] ca = s.toCharArray();\n            Arrays.sort(ca);\n            String key = String.valueOf(ca);\n            map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);\n        }\n        return new ArrayList<>(map.values());\n    }\n}` },
        { language: "python", completeCode: `from collections import defaultdict\nclass Solution:\n    def groupAnagrams(self, strs):\n        mp = defaultdict(list)\n        for s in strs:\n            mp["".join(sorted(s))].append(s)\n        return list(mp.values())` },
        { language: "javascript", completeCode: `class Solution {\n    groupAnagrams(strs) {\n        const mp = new Map();\n        for(let s of strs) {\n            const key = s.split('').sort().join('');\n            if(!mp.has(key)) mp.set(key, []);\n            mp.get(key).push(s);\n        }\n        return Array.from(mp.values());\n    }\n}` }
      ]
    }
  ];

  for (const item of problemsData) {
    item.problemAuthor = authorId;
    const slug = require("slugify")(item.title, { lower: true, strict: true });
    item.slug = slug;
    
    await Problem.findOneAndUpdate(
      { slug },
      { $set: item },
      { upsert: true, new: true, runValidators: true }
    );
    console.log(`Seeded/Updated problem: ${item.title}`);
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch(err => {
  console.error("Seeding error:", err);
  process.exit(1);
});
