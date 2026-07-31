export interface Question {
  id: string;
  category: "programming" | "logic-algorithms" | "data-analytics" | "computer-science-fundamentals";
  difficulty: "easy" | "medium" | "hard";
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  isBossRound?: boolean;
}

export const staticQuestions: Question[] = [
  // ==================== PROGRAMMING ====================
  // Easy (4 questions)
  {
    id: "prog_easy_1",
    category: "programming",
    difficulty: "easy",
    questionText: "Which of the following is a primitive data type in JavaScript?",
    options: ["Array", "Object", "String", "Date"],
    correctAnswerIndex: 2
  },
  {
    id: "prog_easy_2",
    category: "programming",
    difficulty: "easy",
    questionText: "What does the 'typeof' operator return for 'null' in JavaScript?",
    options: ["'null'", "'undefined'", "'object'", "'string'"],
    correctAnswerIndex: 2
  },
  {
    id: "prog_easy_3",
    category: "programming",
    difficulty: "easy",
    questionText: "In Python, which keyword is used to define a function?",
    options: ["func", "def", "function", "lambda"],
    correctAnswerIndex: 1
  },
  {
    id: "prog_easy_4",
    category: "programming",
    difficulty: "easy",
    questionText: "Which HTTP method is typically used to update an existing resource completely?",
    options: ["GET", "POST", "PUT", "DELETE"],
    correctAnswerIndex: 2
  },
  // Medium (3 questions)
  {
    id: "prog_med_1",
    category: "programming",
    difficulty: "medium",
    questionText: "What is the primary difference between a 'Map' and a plain 'Object' in ES6+ JavaScript?",
    options: [
      "Objects only support string/symbol keys; Maps support keys of any type.",
      "Maps are automatically deep-frozen and immutable.",
      "Objects guarantee insertion order for all keys; Maps do not.",
      "Maps can only store primitive values."
    ],
    correctAnswerIndex: 0
  },
  {
    id: "prog_med_2",
    category: "programming",
    difficulty: "medium",
    questionText: "In Python, what is the output of [x for x in range(5) if x % 2 == 0]?",
    options: ["[1, 3]", "[0, 2, 4]", "[2, 4]", "[0, 1, 2, 3, 4]"],
    correctAnswerIndex: 1
  },
  {
    id: "prog_med_3",
    category: "programming",
    difficulty: "medium",
    questionText: "Which CSS display property establishes a formatting context where child boxes can be laid out in any direction?",
    options: ["block", "inline-block", "grid", "flex"],
    correctAnswerIndex: 3
  },
  // Hard (3 questions, 1 is boss round)
  {
    id: "prog_hard_1",
    category: "programming",
    difficulty: "hard",
    questionText: "Under JavaScript's strict mode, what is the value of 'this' when a function is invoked as a standalone function (not as a method)?",
    options: ["window / global object", "undefined", "null", "A reference to the enclosing lexical scope"],
    correctAnswerIndex: 1
  },
  {
    id: "prog_hard_2",
    category: "programming",
    difficulty: "hard",
    questionText: "Which of the following describes why 'double' representation can suffer from floating-point inaccuracy in IEEE 754 standards?",
    options: [
      "Fractional values are stored as base-10 mantissas which overflow.",
      "Many base-10 fractions cannot be represented exactly as terminal binary fractions.",
      "Computers truncate the sign bit on negative float overflows.",
      "The exponent field is too small to record decimals below 10^-5."
    ],
    correctAnswerIndex: 1
  },
  {
    id: "prog_hard_boss",
    category: "programming",
    difficulty: "hard",
    questionText: "What is the primary risk of using 'useMemo' or 'useCallback' excessively in a React application?",
    options: [
      "They permanently prevent React from garbage collecting the component's state.",
      "They bypass React's virtual DOM reconciliation, causing hydration errors.",
      "The overhead of dependency array comparison and closure allocation can outweigh the rendering savings.",
      "They force child components to re-render synchronously on every frame."
    ],
    correctAnswerIndex: 2,
    isBossRound: true
  },

  // ==================== LOGIC / ALGORITHMS ====================
  // Easy (4 questions)
  {
    id: "logic_easy_1",
    category: "logic-algorithms",
    difficulty: "easy",
    questionText: "What is the worst-case time complexity of finding an element in a balanced Binary Search Tree?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswerIndex: 1
  },
  {
    id: "logic_easy_2",
    category: "logic-algorithms",
    difficulty: "easy",
    questionText: "Which data structure operates on a Last-In, First-Out (LIFO) basis?",
    options: ["Queue", "Stack", "Heap", "Singly Linked List"],
    correctAnswerIndex: 1
  },
  {
    id: "logic_easy_3",
    category: "logic-algorithms",
    difficulty: "easy",
    questionText: "What is the time complexity of pushing an element onto a stack?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
    correctAnswerIndex: 0
  },
  {
    id: "logic_easy_4",
    category: "logic-algorithms",
    difficulty: "easy",
    questionText: "Which sorting algorithm is known for having a guaranteed O(n log n) worst-case time complexity?",
    options: ["Bubble Sort", "Quick Sort", "Insertion Sort", "Merge Sort"],
    correctAnswerIndex: 3
  },
  // Medium (3 questions)
  {
    id: "logic_med_1",
    category: "logic-algorithms",
    difficulty: "medium",
    questionText: "What is the worst-case time complexity of Quick Sort when picking the first element as the pivot?",
    options: ["O(n)", "O(n log n)", "O(n^2)", "O(2^n)"],
    correctAnswerIndex: 2
  },
  {
    id: "logic_med_2",
    category: "logic-algorithms",
    difficulty: "medium",
    questionText: "Which design paradigm does the Floyd-Warshall algorithm for all-pairs shortest paths belong to?",
    options: ["Greedy Approach", "Divide and Conquer", "Dynamic Programming", "Backtracking"],
    correctAnswerIndex: 2
  },
  {
    id: "logic_med_3",
    category: "logic-algorithms",
    difficulty: "medium",
    questionText: "Which graph traversal uses a FIFO queue to explore nodes level-by-level?",
    options: ["Depth First Search", "Breadth First Search", "Dijkstra's Algorithm", "Kruskal's Algorithm"],
    correctAnswerIndex: 1
  },
  // Hard (3 questions, 1 is boss round)
  {
    id: "logic_hard_1",
    category: "logic-algorithms",
    difficulty: "hard",
    questionText: "In a Red-Black Tree, what is the maximum ratio of the height of the longest path to the shortest path from the root to a leaf?",
    options: ["1.5", "2.0", "log_2(n)", "There is no bound"],
    correctAnswerIndex: 1
  },
  {
    id: "logic_hard_2",
    category: "logic-algorithms",
    difficulty: "hard",
    questionText: "What is the optimal average-case time complexity for finding the median of an unsorted array of size 'n'?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswerIndex: 2
  },
  {
    id: "logic_hard_boss",
    category: "logic-algorithms",
    difficulty: "hard",
    questionText: "If a problem is NP-Complete, which of the following statements must be true?",
    options: [
      "It can be solved in polynomial time on a deterministic Turing machine.",
      "It is in NP, and every other problem in NP can be reduced to it in polynomial time.",
      "It cannot be verified in polynomial time.",
      "It is strictly harder than any problem in NP-Hard."
    ],
    correctAnswerIndex: 1,
    isBossRound: true
  },

  // ==================== DATA ANALYTICS ====================
  // Easy (4 questions)
  {
    id: "data_easy_1",
    category: "data-analytics",
    difficulty: "easy",
    questionText: "Which SQL clause is used to filter records after they have been grouped using GROUP BY?",
    options: ["WHERE", "HAVING", "LIMIT", "FILTER"],
    correctAnswerIndex: 1
  },
  {
    id: "data_easy_2",
    category: "data-analytics",
    difficulty: "easy",
    questionText: "Which of the following is used to measure the spread of a set of data points around their mean?",
    options: ["Mean", "Median", "Standard Deviation", "Mode"],
    correctAnswerIndex: 2
  },
  {
    id: "data_easy_3",
    category: "data-analytics",
    difficulty: "easy",
    questionText: "In relational databases, what does the primary key guarantee?",
    options: ["Referential Integrity", "Nullability", "Uniqueness", "Cascade Updates"],
    correctAnswerIndex: 2
  },
  {
    id: "data_easy_4",
    category: "data-analytics",
    difficulty: "easy",
    questionText: "Which Python library is most commonly used for manipulating data tables or DataFrames?",
    options: ["NumPy", "Matplotlib", "Pandas", "Scikit-Learn"],
    correctAnswerIndex: 2
  },
  // Medium (3 questions)
  {
    id: "data_med_1",
    category: "data-analytics",
    difficulty: "medium",
    questionText: "In SQL, what is the difference between a LEFT JOIN and an INNER JOIN?",
    options: [
      "LEFT JOIN returns only matching rows; INNER JOIN returns all rows from both tables.",
      "LEFT JOIN returns all rows from the left table and matched rows from the right table; INNER JOIN returns only matching rows.",
      "INNER JOIN preserves unmatched records with NULLs; LEFT JOIN does not.",
      "They are identical in modern RDBMS optimizers."
    ],
    correctAnswerIndex: 1
  },
  {
    id: "data_med_2",
    category: "data-analytics",
    difficulty: "medium",
    questionText: "Which statistical phenomenon occurs when a trend appearing in different groups of data disappears or reverses when the groups are combined?",
    options: ["Simpson's Paradox", "Central Limit Theorem", "Regression to the Mean", "Law of Large Numbers"],
    correctAnswerIndex: 0
  },
  {
    id: "data_med_3",
    category: "data-analytics",
    difficulty: "medium",
    questionText: "Which database index structure is most optimal for range-based query scans?",
    options: ["Hash Index", "B+ Tree Index", "Inverted Index", "Bitmap Index"],
    correctAnswerIndex: 1
  },
  // Hard (3 questions, 1 is boss round)
  {
    id: "data_hard_1",
    category: "data-analytics",
    difficulty: "hard",
    questionText: "In the context of database transaction isolation levels, which level completely prevents 'Dirty Reads', 'Non-repeatable Reads', and 'Phantom Reads'?",
    options: ["Read Committed", "Read Uncommitted", "Repeatable Read", "Serializable"],
    correctAnswerIndex: 3
  },
  {
    id: "data_hard_2",
    category: "data-analytics",
    difficulty: "hard",
    questionText: "What is the primary mathematical objective of Principal Component Analysis (PCA)?",
    options: [
      "To maximize the classification accuracy using a kernel trick.",
      "To find a projection that maximizes the variance of the data along orthogonal axes.",
      "To model non-linear relationships using gradient boosting.",
      "To minimize the sum of squared distances to a set of k cluster centroids."
    ],
    correctAnswerIndex: 1
  },
  {
    id: "data_hard_boss",
    category: "data-analytics",
    difficulty: "hard",
    questionText: "In MapReduce architecture, what is the explicit purpose of the 'Shuffle and Sort' phase?",
    options: [
      "To distribute mapper inputs evenly across standard disks.",
      "To compress key-value pairs before writing them to the HDFS.",
      "To aggregate and route all values associated with the same key to a single reducer.",
      "To detect bad or corrupt chunks of intermediate data."
    ],
    correctAnswerIndex: 2,
    isBossRound: true
  },

  // ==================== CS FUNDAMENTALS ====================
  // Easy (4 questions)
  {
    id: "cs_easy_1",
    category: "computer-science-fundamentals",
    difficulty: "easy",
    questionText: "How many bits are in a single standard byte?",
    options: ["4", "8", "16", "32"],
    correctAnswerIndex: 1
  },
  {
    id: "cs_easy_2",
    category: "computer-science-fundamentals",
    difficulty: "easy",
    questionText: "What is the primary function of an Operating System's kernel?",
    options: [
      "Rendering graphics for user interfaces.",
      "Managing hardware resources and system memory.",
      "Sending emails across network networks.",
      "Compiling source code to assembly."
    ],
    correctAnswerIndex: 1
  },
  {
    id: "cs_easy_3",
    category: "computer-science-fundamentals",
    difficulty: "easy",
    questionText: "Which layer of the OSI model does the Internet Protocol (IP) operate on?",
    options: ["Data Link Layer", "Network Layer", "Transport Layer", "Application Layer"],
    correctAnswerIndex: 1
  },
  {
    id: "cs_easy_4",
    category: "computer-science-fundamentals",
    difficulty: "easy",
    questionText: "What does DNS stand for?",
    options: ["Data Network Security", "Domain Name System", "Digital Node Service", "Distributed Name Storage"],
    correctAnswerIndex: 1
  },
  // Medium (3 questions)
  {
    id: "cs_med_1",
    category: "computer-science-fundamentals",
    difficulty: "medium",
    questionText: "What is the primary difference between TCP and UDP protocols?",
    options: [
      "TCP is connectionless and fast; UDP is connection-oriented and reliable.",
      "TCP is connection-oriented and guarantees packet delivery; UDP is connectionless and does not guarantee delivery.",
      "TCP only works over fiber optic cables; UDP works over copper wires.",
      "TCP is used strictly for HTTP; UDP is used strictly for DNS."
    ],
    correctAnswerIndex: 1
  },
  {
    id: "cs_med_2",
    category: "computer-science-fundamentals",
    difficulty: "medium",
    questionText: "What is 'Thrashing' in an operating system?",
    options: [
      "A security technique to scramble memory registers.",
      "A condition where the CPU spends more time swapping pages in and out than executing actual instructions.",
      "A hardware failure in magnetic hard drives.",
      "An aggressive compiler optimization technique."
    ],
    correctAnswerIndex: 1
  },
  {
    id: "cs_med_3",
    category: "computer-science-fundamentals",
    difficulty: "medium",
    questionText: "What does the translation lookaside buffer (TLB) cache?",
    options: [
      "Frequent CPU register values",
      "Recent virtual-to-physical address translations",
      "Prefetched instruction streams",
      "Network routing tables"
    ],
    correctAnswerIndex: 1
  },
  // Hard (3 questions, 1 is boss round)
  {
    id: "cs_hard_1",
    category: "computer-science-fundamentals",
    difficulty: "hard",
    questionText: "Which of the following describes a 'race condition' in multithreading?",
    options: [
      "Two threads are suspended indefinitely waiting for each other's locks.",
      "The program execution time increases exponentially with the number of CPU cores.",
      "Multiple threads access and manipulate shared data concurrently, and the outcome depends on the order of execution.",
      "A thread consumes 100% of the CPU due to an infinite while loop."
    ],
    correctAnswerIndex: 2
  },
  {
    id: "cs_hard_2",
    category: "computer-science-fundamentals",
    difficulty: "hard",
    questionText: "Why is a context switch between threads of the same process generally cheaper than a context switch between different processes?",
    options: [
      "Threads do not require saving CPU register states.",
      "Threads of the same process share the same virtual address space, avoiding TLB flushes.",
      "Process context switches are handled in hardware, while thread context switches are virtual.",
      "Threads do not have execution stacks of their own."
    ],
    correctAnswerIndex: 1
  },
  {
    id: "cs_hard_boss",
    category: "computer-science-fundamentals",
    difficulty: "hard",
    questionText: "In cryptography, how does Diffie-Hellman Key Exchange establish a shared secret over an insecure channel?",
    options: [
      "By encrypting the secret key using the recipient's public RSA certificate.",
      "By utilizing the mathematical difficulty of computing discrete logarithms in a finite field.",
      "By hashing a symmetric key with SHA-256 multiple times.",
      "By sending key fragments over separate redundant physical channels."
    ],
    correctAnswerIndex: 1,
    isBossRound: true
  }
];
