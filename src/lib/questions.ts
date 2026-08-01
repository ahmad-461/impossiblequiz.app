export interface Question {
  id: string;
  category: string;
  difficulty: "easy" | "medium" | "hard" | "impossible";
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

  // ==================== NEW LANGUAGE-SPECIFIC PROGRAMMING QUESTIONS ====================
  // Python
  {
    id: "prog_py_easy",
    category: "programming_python",
    difficulty: "easy",
    questionText: "In Python, which of the following is used to add an item to the end of a list?",
    options: ["add()", "push()", "append()", "insert()"],
    correctAnswerIndex: 2
  },
  {
    id: "prog_py_med",
    category: "programming_python",
    difficulty: "medium",
    questionText: "What is the result of type((1,)) in Python?",
    options: ["<class 'int'>", "<class 'tuple'>", "<class 'list'>", "SyntaxError"],
    correctAnswerIndex: 1
  },
  {
    id: "prog_py_hard",
    category: "programming_python",
    difficulty: "hard",
    questionText: "What is the output of bool([]) or bool([0]) in Python?",
    options: ["False", "True", "TypeError", "0"],
    correctAnswerIndex: 1
  },
  {
    id: "prog_py_impossible",
    category: "programming_python",
    difficulty: "impossible",
    questionText: "Under Python's GIL, what happens to thread execution during blocking memory or socket I/O operations?",
    options: [
      "The GIL is released, allowing other threads to run concurrently.",
      "The entire process freezes until the I/O block is resolved.",
      "The thread undergoes a hard OS interrupt and is terminated.",
      "The interpreter duplicates the stack using an implicit fork."
    ],
    correctAnswerIndex: 0
  },

  // Java
  {
    id: "prog_java_easy",
    category: "programming_java",
    difficulty: "easy",
    questionText: "Which keyword is used to prevent a class from being inherited in Java?",
    options: ["static", "abstract", "final", "private"],
    correctAnswerIndex: 2
  },
  {
    id: "prog_java_med",
    category: "programming_java",
    difficulty: "medium",
    questionText: "In Java, what is the size of a standard 'int' primitive data type in bits?",
    options: ["8", "16", "32", "64"],
    correctAnswerIndex: 2
  },
  {
    id: "prog_java_hard",
    category: "programming_java",
    difficulty: "hard",
    questionText: "What is the primary difference between HashMap and ConcurrentHashMap in Java?",
    options: [
      "ConcurrentHashMap is immutable.",
      "ConcurrentHashMap allows concurrent read/write without locking the entire map.",
      "HashMap throws a checked SQLException during multi-threaded access.",
      "HashMap automatically caches historical key garbage collection traces."
    ],
    correctAnswerIndex: 1
  },
  {
    id: "prog_java_impossible",
    category: "programming_java",
    difficulty: "impossible",
    questionText: "How does the Java Virtual Machine (JVM) handle biased locking optimizations during safepoint synchronization?",
    options: [
      "It revokes biased locks of all threads synchronously, causing minor GC pause overheads.",
      "It converts biased locks to lock-free spin-locks using hardware-level transactional memory.",
      "It promotes biased locks immediately to a global monitor on the first thread-local execution cycle.",
      "It delegates the task to the host OS kernel scheduler via pthread_mutex_t structures."
    ],
    correctAnswerIndex: 0
  },

  // JavaScript
  {
    id: "prog_js_easy",
    category: "programming_javascript",
    difficulty: "easy",
    questionText: "Which company originally developed JavaScript in 1995?",
    options: ["Microsoft", "Netscape", "Sun Microsystems", "Oracle"],
    correctAnswerIndex: 1
  },
  {
    id: "prog_js_med",
    category: "programming_javascript",
    difficulty: "medium",
    questionText: "What is the output of [] == ![] in JavaScript?",
    options: ["true", "false", "undefined", "TypeError"],
    correctAnswerIndex: 0
  },
  {
    id: "prog_js_hard",
    category: "programming_javascript",
    difficulty: "hard",
    questionText: "What is the purpose of the 'WeakMap' object in JavaScript?",
    options: [
      "It allows garbage collecting keys (which must be objects) if they are not referenced elsewhere.",
      "It prevents prototype inheritance of stored primitives.",
      "It performs lazy evaluations of keys using a built-in cryptographic seed.",
      "It keeps references to properties of objects to speed up array filtering."
    ],
    correctAnswerIndex: 0
  },
  {
    id: "prog_js_impossible",
    category: "programming_javascript",
    difficulty: "impossible",
    questionText: "In V8, what is the primary consequence of changing an object's prototype link (__proto__) after its instantiation?",
    options: [
      "It triggers transition path de-optimization and completely invalidates its Hidden Class (Shape).",
      "It compiles the modified prototype into a global system buffer, boosting function execution.",
      "The engine throws an irreversible ExecutionContextError and halts current events.",
      "It invokes an asynchronous background sweep to clone all properties onto the heap."
    ],
    correctAnswerIndex: 0
  },

  // C
  {
    id: "prog_c_easy",
    category: "programming_c",
    difficulty: "easy",
    questionText: "In C, which header file must be included to use the standard printf function?",
    options: ["<stdlib.h>", "<conio.h>", "<stdio.h>", "<string.h>"],
    correctAnswerIndex: 2
  },
  {
    id: "prog_c_med",
    category: "programming_c",
    difficulty: "medium",
    questionText: "What does the sizeof operator return for a pointer to an integer on a 64-bit architecture?",
    options: ["2", "4", "8", "16"],
    correctAnswerIndex: 2
  },
  {
    id: "prog_c_hard",
    category: "programming_c",
    difficulty: "hard",
    questionText: "Which of the following causes undefined behavior in standard C99?",
    options: [
      "Using a union to type-pun a float to an integer.",
      "Modifying a string literal in-place.",
      "Declaring a variable length array of size 100 on the stack.",
      "Casting a double pointer to a void pointer."
    ],
    correctAnswerIndex: 1
  },
  {
    id: "prog_c_impossible",
    category: "programming_c",
    difficulty: "impossible",
    questionText: "What does the 'restrict' pointer qualifier guarantee to the compiler optimizer in C99?",
    options: [
      "The pointed-to memory is not aliased by any other pointer within that function scope.",
      "The value of the variable is stored strictly in a CPU register rather than system RAM.",
      "Accessing the pointer requires thread-safe mutex protection from the runtime library.",
      "The pointer cannot undergo pointer-arithmetic modifications during iterations."
    ],
    correctAnswerIndex: 0
  },

  // C++
  {
    id: "prog_cpp_easy",
    category: "programming_cpp",
    difficulty: "easy",
    questionText: "Which C++ keyword is used to allocate memory dynamically on the heap?",
    options: ["malloc", "new", "alloc", "create"],
    correctAnswerIndex: 1
  },
  {
    id: "prog_cpp_med",
    category: "programming_cpp",
    difficulty: "medium",
    questionText: "What is a 'vtable' (virtual method table) primarily used for in C++?",
    options: [
      "To store inline class configuration templates.",
      "To resolve virtual function calls dynamically at runtime.",
      "To map member variable positions during virtual block alignment.",
      "To automatically release standard stack pointers at block scopes."
    ],
    correctAnswerIndex: 1
  },
  {
    id: "prog_cpp_hard",
    category: "programming_cpp",
    difficulty: "hard",
    questionText: "In C++11, what does std::move actually do?",
    options: [
      "It actively copies heap blocks to a new thread safety boundary.",
      "It performs a static_cast to an rvalue reference, enabling move semantics.",
      "It frees the source pointer immediately to prevent memory leaks.",
      "It forces the CPU to execute a thread switch operation."
    ],
    correctAnswerIndex: 1
  },
  {
    id: "prog_cpp_impossible",
    category: "programming_cpp",
    difficulty: "impossible",
    questionText: "Under the C++ One Definition Rule (ODR), what happens if a non-inline template function is defined identically in two different translation units?",
    options: [
      "It is resolved by the linker without error, but violating ODR otherwise causes undefined behavior.",
      "The compiler halts compilation immediately with a redefinition syntax error.",
      "The standard library duplicates the symbol using randomized runtime namespaces.",
      "The virtual destructor invokes a double-free on heap-allocated objects."
    ],
    correctAnswerIndex: 0
  },

  // C#
  {
    id: "prog_csharp_easy",
    category: "programming_csharp",
    difficulty: "easy",
    questionText: "Which of the following is the ultimate base class for all types in the C# type system?",
    options: ["System.Type", "System.Object", "System.ValueType", "System.String"],
    correctAnswerIndex: 1
  },
  {
    id: "prog_csharp_med",
    category: "programming_csharp",
    difficulty: "medium",
    questionText: "What does the using statement in C# guarantee for an object that implements IDisposable?",
    options: [
      "It runs the object in an isolated sandboxed thread context.",
      "The Dispose method is called automatically even if an exception occurs.",
      "The object is serialized and saved in local app settings.",
      "It converts the class to an immutable struct."
    ],
    correctAnswerIndex: 1
  },
  {
    id: "prog_csharp_hard",
    category: "programming_csharp",
    difficulty: "hard",
    questionText: "What is the key functional difference between IEnumerable and IQueryable in C#?",
    options: [
      "IEnumerable performs in-memory filtering; IQueryable executes queries provider-side using Expression Trees.",
      "IEnumerable supports asynchronous streaming; IQueryable is strictly synchronous.",
      "IEnumerable is exclusive to local files; IQueryable is exclusive to SQLite.",
      "IQueryable bypasses garbage collection tracking entirely."
    ],
    correctAnswerIndex: 0
  },
  {
    id: "prog_csharp_impossible",
    category: "programming_csharp",
    difficulty: "impossible",
    questionText: "How does the .NET Garbage Collector (GC) optimize memory allocation in Generation 0?",
    options: [
      "By using a bump pointer on a thread-local allocation context (TLAC) without global lock overhead.",
      "By copying objects synchronously to the Large Object Heap (LOH) on every thread switch.",
      "By executing reference counting sweeps on the CPU's background vector registers.",
      "By writing object layout structures to active system swap space."
    ],
    correctAnswerIndex: 0
  },

  // PHP
  {
    id: "prog_php_easy",
    category: "programming_php",
    difficulty: "easy",
    questionText: "Which character is used to denote a variable prefix in PHP?",
    options: ["#", "$", "@", "&"],
    correctAnswerIndex: 1
  },
  {
    id: "prog_php_med",
    category: "programming_php",
    difficulty: "medium",
    questionText: "What is the difference between == and === operators in PHP?",
    options: [
      "=== compares values after type coercion; == checks identical reference positions.",
      "=== compares both value and data type, while == performs type coercion.",
      "== is strictly for strings; === is strictly for arrays and objects.",
      "There is no difference since PHP 7.4."
    ],
    correctAnswerIndex: 1
  },
  {
    id: "prog_php_hard",
    category: "programming_php",
    difficulty: "hard",
    questionText: "What is the purpose of the 'opcache' extension in PHP?",
    options: [
      "It stores precompiled script bytecode in shared memory, eliminating file parsing overhead.",
      "It compresses HTTP responses before transmitting them to the server.",
      "It replicates database query results across multiple worker clusters.",
      "It enforces strict typing limits on standard library parameters."
    ],
    correctAnswerIndex: 0
  },
  {
    id: "prog_php_impossible",
    category: "programming_php",
    difficulty: "impossible",
    questionText: "How does PHP 8's Just-In-Time (JIT) compiler manage instruction generation for hot execution paths?",
    options: [
      "By compiling trace-based or function-based VM bytecode directly into native x86/ARM machine code.",
      "By delegating compilation processes to the host web server's CGI daemon.",
      "By translating arrays to WebAssembly files on client-side requests.",
      "By locking the global VM registers during complex mathematical loops."
    ],
    correctAnswerIndex: 0
  },

  // TypeScript
  {
    id: "prog_typescript_easy",
    category: "programming_typescript",
    difficulty: "easy",
    questionText: "Which command-line compiler command is used to compile TypeScript projects?",
    options: ["ts-node", "tsc", "compile-ts", "typescript"],
    correctAnswerIndex: 1
  },
  {
    id: "prog_typescript_med",
    category: "programming_typescript",
    difficulty: "medium",
    questionText: "What is a key difference between a TypeScript 'interface' and a 'type' alias?",
    options: [
      "Interfaces can be extended or merged via declaration merging, whereas type aliases cannot.",
      "Type aliases support inheritance via 'extends'; interfaces do not.",
      "Interfaces are preserved as runtime classes; type aliases are compiled away.",
      "Type aliases can only contain primitive data types."
    ],
    correctAnswerIndex: 0
  },
  {
    id: "prog_typescript_hard",
    category: "programming_typescript",
    difficulty: "hard",
    questionText: "What does the keyof operator do in TypeScript?",
    options: [
      "It returns a string array of an object's keys at runtime.",
      "It produces a union type of all known keys of an object type at compile time.",
      "It unlocks read-only properties of a compiled interface.",
      "It checks if a specified string key exists inside a Map object."
    ],
    correctAnswerIndex: 1
  },
  {
    id: "prog_typescript_impossible",
    category: "programming_typescript",
    difficulty: "impossible",
    questionText: "What is the fundamental mechanism behind TypeScript's structural typing assignability for contra-variant function arguments?",
    options: [
      "Arguments are checked in reverse order (contravariant), ensuring safer parameter substitution.",
      "Function arguments undergo strict runtime checking via high-order proxy decorators.",
      "It forces any inherited argument type to be cast to a union type of all subclass fields.",
      "It compiles arguments into inline tuples to bypass lexical scope validations."
    ],
    correctAnswerIndex: 0
  },

  // Go
  {
    id: "prog_go_easy",
    category: "programming_go",
    difficulty: "easy",
    questionText: "Which keyword is used to initiate a concurrent goroutine in Go?",
    options: ["goroutine", "go", "thread", "spawn"],
    correctAnswerIndex: 1
  },
  {
    id: "prog_go_med",
    category: "programming_go",
    difficulty: "medium",
    questionText: "In Go, what is the default zero-value of an uninitialized interface?",
    options: ["nil", "undefined", "empty struct", "false"],
    correctAnswerIndex: 0
  },
  {
    id: "prog_go_hard",
    category: "programming_go",
    difficulty: "hard",
    questionText: "What is the primary difference between a Go 'channel' and a 'mutex'?",
    options: [
      "Channels communicate by sharing memory; mutexes share memory by locking access.",
      "Channels require manual garbage collection; mutexes are self-destructing.",
      "Mutexes only work in the main goroutine; channels work across threads.",
      "Channels are exclusive to network sockets."
    ],
    correctAnswerIndex: 0
  },
  {
    id: "prog_go_impossible",
    category: "programming_go",
    difficulty: "impossible",
    questionText: "How does the Go runtime scheduler (GMP model) handle system calls that block a goroutine?",
    options: [
      "It detaches the OS thread (M) from the logical processor (P), letting another thread execute remaining goroutines.",
      "It kills the logical processor (P) and reallocates memory to a new virtual core.",
      "It pauses all other goroutines until the OS signal returns success.",
      "It converts the blocking call into a series of non-blocking lock-free CAS operations."
    ],
    correctAnswerIndex: 0
  },

  // Rust
  {
    id: "prog_rust_easy",
    category: "programming_rust",
    difficulty: "easy",
    questionText: "Which keyword is used to declare an immutable variable in Rust by default?",
    options: ["const", "let", "imm", "val"],
    correctAnswerIndex: 1
  },
  {
    id: "prog_rust_med",
    category: "programming_rust",
    difficulty: "medium",
    questionText: "What is the primary purpose of the 'Option' type in Rust?",
    options: [
      "To configure compiler optimization profiles.",
      "To represent a value that can be either something or nothing without using null.",
      "To define optional fields inside a macro definition.",
      "To execute fallback command-line argument matches."
    ],
    correctAnswerIndex: 1
  },
  {
    id: "prog_rust_hard",
    category: "programming_rust",
    difficulty: "hard",
    questionText: "In Rust, what does the 'RefCell' type provide?",
    options: [
      "Thread-safe atomic reference count updates.",
      "Interior mutability with dynamically enforced borrowing rules at runtime.",
      "Zero-cost static dispatch for trait objects.",
      "Asynchronous lock-free message passing channels."
    ],
    correctAnswerIndex: 1
  },
  {
    id: "prog_rust_impossible",
    category: "programming_rust",
    difficulty: "impossible",
    questionText: "How does the Rust compiler evaluate lifetime subtyping when a function accepts a contravariant lifetime reference?",
    options: [
      "It allows a longer lifetime to be used where a shorter lifetime is expected, except in invariant positions like mutable pointers.",
      "It strictly truncates all lifetimes to the scope of the local stack frame.",
      "It enforces a compiler warning requiring explicit unsafe blocks.",
      "It maps both lifetimes to static at runtime using an implicit borrow sweep."
    ],
    correctAnswerIndex: 0
  },

  // Kotlin
  {
    id: "prog_kotlin_easy",
    category: "programming_kotlin",
    difficulty: "easy",
    questionText: "Which keyword is used to declare a read-only (immutable) variable in Kotlin?",
    options: ["var", "val", "const", "let"],
    correctAnswerIndex: 1
  },
  {
    id: "prog_kotlin_med",
    category: "programming_kotlin",
    difficulty: "medium",
    questionText: "What is the purpose of 'smart casts' in Kotlin?",
    options: [
      "To copy object properties asynchronously.",
      "To automatically cast a variable after verifying its type with 'is'.",
      "To dynamically convert integers to floats during division.",
      "To run Kotlin scripts in Java packages."
    ],
    correctAnswerIndex: 1
  },
  {
    id: "prog_kotlin_hard",
    category: "programming_kotlin",
    difficulty: "hard",
    questionText: "What is the key difference between 'launch' and 'async' in Kotlin coroutines?",
    options: [
      "launch returns a Job and does not carry a result; async returns a Deferred carrying a result.",
      "launch is thread-safe; async is not.",
      "async can only run on the main UI thread; launch is background-only.",
      "launch is deprecated in favor of async since coroutines 1.6."
    ],
    correctAnswerIndex: 0
  },
  {
    id: "prog_kotlin_impossible",
    category: "programming_kotlin",
    difficulty: "impossible",
    questionText: "How does Kotlin's compiler implement inline functions with 'reified' type parameters?",
    options: [
      "By copying the function bytecode directly to call sites, replacing type parameters with concrete class objects.",
      "By executing reflection lookups at runtime and throwing a NullPointerException.",
      "By compiling class types into an abstract global registry on JVM startup.",
      "By replacing generic placeholders with a custom void* type inside compiled classes."
    ],
    correctAnswerIndex: 0
  },

  // Swift
  {
    id: "prog_swift_easy",
    category: "programming_swift",
    difficulty: "easy",
    questionText: "Which keyword is used to define a constant in Swift?",
    options: ["var", "let", "const", "val"],
    correctAnswerIndex: 1
  },
  {
    id: "prog_swift_med",
    category: "programming_swift",
    difficulty: "medium",
    questionText: "What is 'Optional Binding' in Swift?",
    options: [
      "Mapping multiple keys to the same dictionary object.",
      "Safely unwrapping an optional value using if let or guard let.",
      "Binding a text field to a state variable in SwiftUI.",
      "Implicitly casting an optional class reference to an AnyObject."
    ],
    correctAnswerIndex: 1
  },
  {
    id: "prog_swift_hard",
    category: "programming_swift",
    difficulty: "hard",
    questionText: "What is the primary difference between a 'class' and a 'struct' in Swift?",
    options: [
      "Classes are reference types passed by reference; structs are value types passed by copying.",
      "Structs support multiple inheritance; classes do not.",
      "Classes are allocated on the stack; structs are allocated on the heap.",
      "There is no difference since Swift 5."
    ],
    correctAnswerIndex: 0
  },
  {
    id: "prog_swift_impossible",
    category: "programming_swift",
    difficulty: "impossible",
    questionText: "Under Swift's Automatic Reference Counting (ARC), how is an unowned reference handled when its target object is deallocated?",
    options: [
      "It retains a dangling trap pointer; accessing it triggers a runtime crash (unlike weak, which becomes nil).",
      "It is automatically set to nil on the next run loop sweep.",
      "It holds a strong reference, preventing memory deallocation forever.",
      "It copies the deallocated object's stack to a system cache."
    ],
    correctAnswerIndex: 0
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
