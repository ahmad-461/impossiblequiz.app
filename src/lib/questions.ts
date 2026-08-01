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
  },

  // ==================== NEW BUSINESS SECTOR QUESTIONS ====================
  // Marketing
  {
    id: "bus_mkt_easy",
    category: "business_marketing",
    difficulty: "easy",
    questionText: "Which of the '4 Ps' of marketing represents the channels through which a product is distributed to consumers?",
    options: ["Price", "Product", "Promotion", "Place"],
    correctAnswerIndex: 3
  },
  {
    id: "bus_mkt_med",
    category: "business_marketing",
    difficulty: "medium",
    questionText: "What marketing metric is calculated by dividing total campaign spend by the number of new customers acquired?",
    options: ["Return on Ad Spend (ROAS)", "Customer Acquisition Cost (CAC)", "Customer Lifetime Value (LTV)", "Click-Through Rate (CTR)"],
    correctAnswerIndex: 1
  },
  {
    id: "bus_mkt_hard",
    category: "business_marketing",
    difficulty: "hard",
    questionText: "Which psychological phenomenon explains why consumers perceive a product as higher quality simply because it is priced higher?",
    options: ["Price-Quality Association (Veblen Effect)", "Decoy Effect", "Anchoring Bias", "Confirmation Bias"],
    correctAnswerIndex: 0
  },
  {
    id: "bus_mkt_impossible",
    category: "business_marketing",
    difficulty: "impossible",
    questionText: "Under the Bass Diffusion Model, what does the coefficient of imitation (q) represent in relation to the adopter pool?",
    options: [
      "The rate of adoption driven strictly by mass media external advertising.",
      "The rate of adoption driven by word-of-mouth or social contagion from existing adopters.",
      "The price-elasticity coefficient of early-majority users.",
      "The decay factor of technical superiority over a product lifecycle."
    ],
    correctAnswerIndex: 1
  },

  // Finance
  {
    id: "bus_fin_easy",
    category: "business_finance",
    difficulty: "easy",
    questionText: "Which financial statement shows a company's revenues, expenses, and net income over a specific period?",
    options: ["Balance Sheet", "Income Statement", "Statement of Cash Flows", "Statement of Retained Earnings"],
    correctAnswerIndex: 1
  },
  {
    id: "bus_fin_med",
    category: "business_finance",
    difficulty: "medium",
    questionText: "What is the Capital Asset Pricing Model (CAPM) primarily used to calculate?",
    options: [
      "The debt-to-equity ratio of leverage.",
      "The expected return on an asset given its systematic risk (beta).",
      "The terminal growth rate of free cash flows.",
      "The cash conversion cycle of working capital."
    ],
    correctAnswerIndex: 1
  },
  {
    id: "bus_fin_hard",
    category: "business_finance",
    difficulty: "hard",
    questionText: "In options trading, which 'Greek' measures the sensitivity of an option's price to changes in the volatility of the underlying asset?",
    options: ["Delta", "Gamma", "Vega", "Theta"],
    correctAnswerIndex: 2
  },
  {
    id: "bus_fin_impossible",
    category: "business_finance",
    difficulty: "impossible",
    questionText: "Under the Black-Scholes-Merton option pricing model, how is the d1 parameter mathematically interpreted in replicating portfolios?",
    options: [
      "The exact probability that the option will expire in-the-money.",
      "The risk-neutral probability of stock price escalation.",
      "The delta/hedge ratio of shares needed in the replicating portfolio to hedge the option.",
      "The discount factor of the option premium over continuous time."
    ],
    correctAnswerIndex: 2
  },

  // Accounting
  {
    id: "bus_act_easy",
    category: "business_accounting",
    difficulty: "easy",
    questionText: "According to the fundamental accounting equation, Assets must always equal Liabilities plus what?",
    options: ["Net Income", "Retained Earnings", "Shareholders' Equity", "Operating Cash Flow"],
    correctAnswerIndex: 2
  },
  {
    id: "bus_act_med",
    category: "business_accounting",
    difficulty: "medium",
    questionText: "Which depreciation method results in higher depreciation expenses in the early years of an asset's useful life?",
    options: ["Straight-Line Method", "Units of Production Method", "Double-Declining Balance Method", "First-In, First-Out Method"],
    correctAnswerIndex: 2
  },
  {
    id: "bus_act_hard",
    category: "business_accounting",
    difficulty: "hard",
    questionText: "Under both US GAAP and IFRS, how should research costs be treated during the research phase?",
    options: [
      "Capitalized as intangible assets and amortized.",
      "Expensed immediately as incurred in the period.",
      "Deferred until the product generates positive operating cash flow.",
      "Allocated to Goodwill on the Balance Sheet."
    ],
    correctAnswerIndex: 1
  },
  {
    id: "bus_act_impossible",
    category: "business_accounting",
    difficulty: "impossible",
    questionText: "How does a company account for hyperinflationary economies under IAS 29 regarding non-monetary items on the balance sheet?",
    options: [
      "They are restated using a general price index from the date of acquisition.",
      "They are automatically depreciated to zero value on the reporting period.",
      "They are converted using the spot exchange rate of a stable currency.",
      "They must be reclassified as short-term liquid cash equivalents."
    ],
    correctAnswerIndex: 0
  },

  // Entrepreneurship
  {
    id: "bus_ent_easy",
    category: "business_entrepreneurship",
    difficulty: "easy",
    questionText: "What is the 'Minimum Viable Product' (MVP) in lean startup methodology?",
    options: [
      "The cheapest possible version of a product made with low-grade materials.",
      "A complete product with all envisioned features built in.",
      "A version of a new product that allows a team to collect the maximum validated learning with the least effort.",
      "An internal design mock-up that is never released to consumers."
    ],
    correctAnswerIndex: 2
  },
  {
    id: "bus_ent_med",
    category: "business_entrepreneurship",
    difficulty: "medium",
    questionText: "What is a 'cap table' (capitalization table) primarily used to track?",
    options: [
      "Monthly operating expenditures and revenue targets.",
      "The equity ownership percentages, dilution, and value of securities.",
      "The capital depreciation schedule of physical assets.",
      "The manufacturing capacity constraints of factory production."
    ],
    correctAnswerIndex: 1
  },
  {
    id: "bus_ent_hard",
    category: "business_entrepreneurship",
    difficulty: "hard",
    questionText: "Which financing instrument allows startups to delay valuation until a future priced equity round, converting debt directly into equity?",
    options: ["SAFE (Simple Agreement for Future Equity)", "Commercial Paper", "Revolving Line of Credit", "Series A Preferred Stock"],
    correctAnswerIndex: 0
  },
  {
    id: "bus_ent_impossible",
    category: "business_entrepreneurship",
    difficulty: "impossible",
    questionText: "In a venture capital term sheet, how does a 'participating double-dip' liquidation preference affect common shareholders during an exit?",
    options: [
      "It allows common shareholders to receive twice their investment before preferred holders.",
      "Preferred holders receive their return preference first, then share pro-rata in remaining proceeds, heavily diluting common holders.",
      "It allows preferred holders to convert debt into a permanent double dividend structure.",
      "It guarantees common shareholders are fully immune to any downside liquidation event."
    ],
    correctAnswerIndex: 1
  },

  // Management
  {
    id: "bus_mgt_easy",
    category: "business_management",
    difficulty: "easy",
    questionText: "Which organizational structure groups employees based on specialized skills or roles (e.g., Sales, HR, Engineering)?",
    options: ["Functional Structure", "Divisional Structure", "Matrix Structure", "Flat Structure"],
    correctAnswerIndex: 0
  },
  {
    id: "bus_mgt_med",
    category: "business_management",
    difficulty: "medium",
    questionText: "What does Herzberg's Two-Factor Theory identify as 'hygiene factors' that do not motivate but prevent dissatisfaction?",
    options: [
      "Achievement, recognition, and the work itself.",
      "Salary, working conditions, and company policies.",
      "Personal growth, career advancement, and autonomy.",
      "Stock options, executive bonuses, and vacation days."
    ],
    correctAnswerIndex: 1
  },
  {
    id: "bus_mgt_hard",
    category: "business_management",
    difficulty: "hard",
    questionText: "Under the VRIO framework, what must a resource be in order to provide a sustained competitive advantage?",
    options: [
      "Valuable, Rapidly reproducible, and Internationally outsourced.",
      "Valuable, Rare, Inimitable, and Organized to exploit value.",
      "Variable, Robust, Integrated, and Optimized.",
      "Volatile, Risk-mitigated, Innovative, and Outperforming."
    ],
    correctAnswerIndex: 1
  },
  {
    id: "bus_mgt_impossible",
    category: "business_management",
    difficulty: "impossible",
    questionText: "According to Henry Mintzberg's managerial roles, which role fits under the Decisional category when a manager mediates a resource bottleneck?",
    options: [
      "Disturbance Handler",
      "Spokesperson",
      "Liaison",
      "Disseminator"
    ],
    correctAnswerIndex: 0
  },

  // Economics
  {
    id: "bus_eco_easy",
    category: "business_economics",
    difficulty: "easy",
    questionText: "What economic law states that, all else being equal, as the price of a good increases, the quantity demanded decreases?",
    options: ["Law of Supply", "Law of Demand", "Law of Diminishing Returns", "Law of One Price"],
    correctAnswerIndex: 1
  },
  {
    id: "bus_eco_med",
    category: "business_economics",
    difficulty: "medium",
    questionText: "What is the primary difference between Real GDP and Nominal GDP?",
    options: [
      "Nominal GDP includes services, while Real GDP only counts manufacturing.",
      "Real GDP is adjusted for inflation/deflation, while Nominal GDP is not.",
      "Real GDP is calculated using international dollar rates, while Nominal uses domestic currencies.",
      "Nominal GDP is always negative during a recession."
    ],
    correctAnswerIndex: 1
  },
  {
    id: "bus_eco_hard",
    category: "business_economics",
    difficulty: "hard",
    questionText: "Which market structure is characterized by a few dominant firms, high barriers to entry, and mutual strategic interdependence?",
    options: ["Monopolistic Competition", "Oligopoly", "Perfect Competition", "Monopsony"],
    correctAnswerIndex: 1
  },
  {
    id: "bus_eco_impossible",
    category: "business_economics",
    difficulty: "impossible",
    questionText: "Under the Mundell-Fleming model, what is the consequence of expansionary fiscal policy in an open economy with perfect capital mobility and floating exchange rates?",
    options: [
      "It is highly effective as consumption and interest rates soar.",
      "It is completely ineffective as exchange rate appreciation crowds out net exports.",
      "It causes hyperinflation and immediate contraction of capital inflows.",
      "It triggers currency depreciation, sparking a massive trade surplus."
    ],
    correctAnswerIndex: 1
  },

  // Business Strategy
  {
    id: "bus_stg_easy",
    category: "business_business-strategy",
    difficulty: "easy",
    questionText: "What does the 'SWOT' acronym stand for in strategic planning?",
    options: [
      "Strengths, Weaknesses, Operations, Tactics",
      "Strengths, Weaknesses, Opportunities, Threats",
      "System, Workforce, Objectives, Timelines",
      "Sales, Waste, Overhead, Taxes"
    ],
    correctAnswerIndex: 1
  },
  {
    id: "bus_stg_med",
    category: "business_business-strategy",
    difficulty: "medium",
    questionText: "Which of Michael Porter's Five Forces assesses how easy it is for buyers to drive down prices?",
    options: [
      "Threat of New Entrants",
      "Bargaining Power of Buyers",
      "Bargaining Power of Suppliers",
      "Threat of Substitute Products"
    ],
    correctAnswerIndex: 1
  },
  {
    id: "bus_stg_hard",
    category: "business_business-strategy",
    difficulty: "hard",
    questionText: "What strategic concept advocates for creating uncontested market space rather than competing in bloody, crowded industries?",
    options: ["Red Ocean Strategy", "Blue Ocean Strategy", "Disruptive Innovation", "First-Mover Advantage"],
    correctAnswerIndex: 1
  },
  {
    id: "bus_stg_impossible",
    category: "business_business-strategy",
    difficulty: "impossible",
    questionText: "According to the Resource-Based View (RBV) of the firm, how does causal ambiguity serve as an isolating mechanism for competitive advantage?",
    options: [
      "By preventing the firm's own executives from understanding cost structures.",
      "By making it impossible for competitors to understand the link between resources and performance, preventing replication.",
      "By legally protecting trade secrets through patents.",
      "By keeping corporate structures highly decentralized."
    ],
    correctAnswerIndex: 1
  },

  // ==================== NEW ENGLISH SECTOR QUESTIONS ====================
  // Grammar
  {
    id: "eng_grm_easy",
    category: "english_grammar",
    difficulty: "easy",
    questionText: "Which of the following is a coordinating conjunction used to join words, phrases, or clauses?",
    options: ["But", "Because", "Although", "Since"],
    correctAnswerIndex: 0
  },
  {
    id: "eng_grm_med",
    category: "english_grammar",
    difficulty: "medium",
    questionText: "What type of pronoun is used in the sentence: 'The book *that* you gave me was fascinating'?",
    options: ["Personal pronoun", "Possessive pronoun", "Relative pronoun", "Demonstrative pronoun"],
    correctAnswerIndex: 2
  },
  {
    id: "eng_grm_hard",
    category: "english_grammar",
    difficulty: "hard",
    questionText: "Identify the pronoun-antecedent agreement error in traditional prescriptive grammar:",
    options: [
      "Everyone must bring his or her pencil to the exam.",
      "Each of the candidates must submit their application by Friday.",
      "Neither of the boys completed his homework on time.",
      "Both sisters brought their instruments to practice."
    ],
    correctAnswerIndex: 1
  },
  {
    id: "eng_grm_impossible",
    category: "english_grammar",
    difficulty: "impossible",
    questionText: "In English syntax, what syntactic phenomenon is demonstrated when an auxiliary verb moves to the left of the subject in non-subject wh-questions?",
    options: [
      "Subject-auxiliary inversion",
      "Complementizer deletion",
      "Cliticization",
      "Pronominalization"
    ],
    correctAnswerIndex: 0
  },

  // Vocabulary
  {
    id: "eng_voc_easy",
    category: "english_vocabulary",
    difficulty: "easy",
    questionText: "Choose the word that means 'extremely large in size or scale':",
    options: ["Minuscule", "Ephemeral", "Gargantuan", "Trivial"],
    correctAnswerIndex: 2
  },
  {
    id: "eng_voc_med",
    category: "english_vocabulary",
    difficulty: "medium",
    questionText: "What is the definition of the word 'ephemeral'?",
    options: [
      "Lasting for a very short time; transient.",
      "Having a deep, profound meaning.",
      "Showing extreme greed or avarice.",
      "Extremely clean, pure, or spotless."
    ],
    correctAnswerIndex: 0
  },
  {
    id: "eng_voc_hard",
    category: "english_vocabulary",
    difficulty: "hard",
    questionText: "What does the word 'recondite' mean?",
    options: [
      "Abstruse, obscure, or little known.",
      "Stubbornly refuse to obey authority.",
      "Extremely cheerful and friendly.",
      "Having a sweet or pleasant smell."
    ],
    correctAnswerIndex: 0
  },
  {
    id: "eng_voc_impossible",
    category: "english_vocabulary",
    difficulty: "impossible",
    questionText: "What is the etymological meaning of the word 'sesquipedalian'?",
    options: [
      "Having exactly six feet or limbs.",
      "Latin for 'a foot and a half long', referring to very long words.",
      "Characterized by constant, rhythmic repeating patterns.",
      "The state of being highly allergic to foot apparel."
    ],
    correctAnswerIndex: 1
  },

  // Synonyms & Antonyms
  {
    id: "eng_syn_easy",
    category: "english_synonyms-antonyms",
    difficulty: "easy",
    questionText: "What is a synonym for the word 'jubilant'?",
    options: ["Melancholy", "Hostile", "Thrilled / Happy", "Apprehensive"],
    correctAnswerIndex: 2
  },
  {
    id: "eng_syn_med",
    category: "english_synonyms-antonyms",
    difficulty: "medium",
    questionText: "What is an antonym for the word 'loquacious'?",
    options: ["Garrulous", "Taciturn", "Eloquent", "Articulate"],
    correctAnswerIndex: 1
  },
  {
    id: "eng_syn_hard",
    category: "english_synonyms-antonyms",
    difficulty: "hard",
    questionText: "Which of the following is a synonym for 'fastidious'?",
    options: ["Meticulous", "Indifferent", "Slapdash", "Apathetic"],
    correctAnswerIndex: 0
  },
  {
    id: "eng_syn_impossible",
    category: "english_synonyms-antonyms",
    difficulty: "impossible",
    questionText: "Which pair of words represents a relationship of 'enantiosemy' (contronymy)?",
    options: [
      "Flout / Flaunt",
      "Cleave / Cleave (to split apart vs. to cling together)",
      "Empathy / Sympathy",
      "Accept / Except"
    ],
    correctAnswerIndex: 1
  },

  // Tenses
  {
    id: "eng_ten_easy",
    category: "english_tenses",
    difficulty: "easy",
    questionText: "Which sentence is written in the Present Perfect tense?",
    options: [
      "I write three essays today.",
      "I will write three essays today.",
      "I have written three essays today.",
      "I was writing three essays today."
    ],
    correctAnswerIndex: 2
  },
  {
    id: "eng_ten_med",
    category: "english_tenses",
    difficulty: "medium",
    questionText: "Identify the tense used in: 'By next June, she will have been working here for five years.'",
    options: [
      "Future Perfect",
      "Future Continuous",
      "Future Perfect Continuous",
      "Future Simple"
    ],
    correctAnswerIndex: 2
  },
  {
    id: "eng_ten_hard",
    category: "english_tenses",
    difficulty: "hard",
    questionText: "In conditional sentences, which tense combination is strictly required to form a 'Third Conditional' statement?",
    options: [
      "Simple Past in the if-clause, and 'would' + infinitive in the main clause.",
      "Past Perfect in the if-clause, and 'would have' + past participle in the main clause.",
      "Present Simple in the if-clause, and Future Simple in the main clause.",
      "Past Perfect in the if-clause, and 'would' + infinitive in the main clause."
    ],
    correctAnswerIndex: 1
  },
  {
    id: "eng_ten_impossible",
    category: "english_tenses",
    difficulty: "impossible",
    questionText: "Which aspectual distinction is highlighted when contrasting 'I wrote a letter' with 'I was writing a letter' in functional linguistics?",
    options: [
      "Habitual vs. Iterative aspect.",
      "Perfective vs. Imperfective aspect (telic vs. atelic boundary realization).",
      "Inchoative vs. Cessative transition.",
      "Static vs. Dynamic thematic assignment."
    ],
    correctAnswerIndex: 1
  },

  // Sentence Correction
  {
    id: "eng_snt_easy",
    category: "english_sentence-correction",
    difficulty: "easy",
    questionText: "Which of the following sentences is grammatically correct?",
    options: [
      "The dog chased it's tail.",
      "The dog chased its tail.",
      "The dog chased its' tail.",
      "The dog chased its's tail."
    ],
    correctAnswerIndex: 1
  },
  {
    id: "eng_snt_med",
    category: "english_sentence-correction",
    difficulty: "medium",
    questionText: "Correct the dangling modifier in this sentence: 'Walking down the street, the trees were beautiful.'",
    options: [
      "Walking down the street, the trees looked beautiful.",
      "Walking down the street, I saw beautiful trees.",
      "While walking down the street, the trees were seen by me.",
      "Dangling down the street, the trees were beautiful."
    ],
    correctAnswerIndex: 1
  },
  {
    id: "eng_snt_hard",
    category: "english_sentence-correction",
    difficulty: "hard",
    questionText: "Which sentence resolves the subjunctive mood correctly?",
    options: [
      "I wish I was a bit taller.",
      "I wish I am a bit taller.",
      "I wish I were a bit taller.",
      "I wish I would be a bit taller."
    ],
    correctAnswerIndex: 2
  },
  {
    id: "eng_snt_impossible",
    category: "english_sentence-correction",
    difficulty: "impossible",
    questionText: "Which sentence correctly avoids both a split infinitive and a terminal preposition according to prescriptive rules?",
    options: [
      "This is the document about which I was instructed to write.",
      "This is the document I was instructed to write about.",
      "I was instructed to write about this document immediately.",
      "This is the document about which I was instructed to immediately write."
    ],
    correctAnswerIndex: 0
  },

  // Idioms & Phrases
  {
    id: "eng_idm_easy",
    category: "english_idioms-phrases",
    difficulty: "easy",
    questionText: "What does the idiom 'break a leg' mean?",
    options: ["An angry threat", "A severe medical emergency", "Good luck in a performance", "A clumsy dance move"],
    correctAnswerIndex: 2
  },
  {
    id: "eng_idm_med",
    category: "english_idioms-phrases",
    difficulty: "medium",
    questionText: "What is the meaning of the idiom 'burn the midnight oil'?",
    options: [
      "To waste expensive resources.",
      "To study or work late into the night.",
      "To cause an accidental structure fire.",
      "To wake up early before sunrise."
    ],
    correctAnswerIndex: 1
  },
  {
    id: "eng_idm_hard",
    category: "english_idioms-phrases",
    difficulty: "hard",
    questionText: "What is the origin and meaning of 'to bite the bullet'?",
    options: [
      "To purchase munitions; originating from colonial military procurement.",
      "To endure a painful situation with courage; originating from soldiers biting lead bullets during surgery.",
      "To make a sudden reckless decision; originating from duels.",
      "To be severely scolded; originating from targeting practice."
    ],
    correctAnswerIndex: 1
  },
  {
    id: "eng_idm_impossible",
    category: "english_idioms-phrases",
    difficulty: "impossible",
    questionText: "What is the historic reference and meaning of 'to read the Riot Act'?",
    options: [
      "To recite political theory; originating from the French Revolution.",
      "To issue a final severe warning to disperse; originating from a British Act read to unlawful assemblies in 1715.",
      "To perform theater; originating from early Shakespearean protests.",
      "To document labor disputes; originating from US labor unionization."
    ],
    correctAnswerIndex: 1
  },

  // Reading Comprehension
  {
    id: "eng_rdg_easy",
    category: "english_reading-comprehension",
    difficulty: "easy",
    questionText: "In reading comprehension, what is the primary purpose of a 'topic sentence' in a paragraph?",
    options: [
      "To provide a concluding rhetorical question.",
      "To state the main idea of the paragraph.",
      "To list all supporting bibliography citations.",
      "To transition to an unrelated subject."
    ],
    correctAnswerIndex: 1
  },
  {
    id: "eng_rdg_med",
    category: "english_reading-comprehension",
    difficulty: "medium",
    questionText: "What is the difference between an 'inference' and a 'direct statement' in a text?",
    options: [
      "An inference is a logical conclusion drawn from evidence, whereas a direct statement is explicitly written.",
      "An inference is always false, whereas direct statements are always true.",
      "Inferences are only used in poetry; direct statements are used in science.",
      "Direct statements are subjective; inferences are objective facts."
    ],
    correctAnswerIndex: 0
  },
  {
    id: "eng_rdg_hard",
    category: "english_reading-comprehension",
    difficulty: "hard",
    questionText: "In literary analysis, which of the following terms describes the final resolution of a complex plot or mystery in a drama?",
    options: ["Exposition", "Climax", "Denouement", "Anagnorisis"],
    correctAnswerIndex: 2
  },
  {
    id: "eng_rdg_impossible",
    category: "english_reading-comprehension",
    difficulty: "impossible",
    questionText: "In literary criticism, which hermeneutic school focuses on the 'intentional fallacy' to assert that an author's intent cannot define a text's meaning?",
    options: [
      "Reader-Response Criticism",
      "New Criticism",
      "Marxist Literary Theory",
      "Psychoanalytic Criticism"
    ],
    correctAnswerIndex: 1
  }
];
