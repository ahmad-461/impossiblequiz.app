export interface EscapeRoomQuestion {
  id: string;
  roomNumber: number;
  narrative: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  difficulty: "easy" | "medium" | "hard" | "impossible";
}

export const escapeRoomQuestions: EscapeRoomQuestion[] = [
  {
    id: "esc_room_1",
    roomNumber: 1,
    narrative: "You wake up inside a dim terminal console. The primary sector's initialization vector is locked. Override the variable buffer to proceed.",
    questionText: "In JavaScript, which keyword is used to declare a block-scoped variable that cannot be reassigned?",
    options: ["var", "let", "const", "define"],
    correctAnswerIndex: 2,
    difficulty: "easy",
  },
  {
    id: "esc_room_2",
    roomNumber: 2,
    narrative: "The path is blocked by a recursive iterator firewall. Break the infinite sequence to unlock the first secure port.",
    questionText: "What is the output of the following Python expression? [x * 2 for x in range(3)]",
    options: ["[0, 2, 4]", "[2, 4, 6]", "[0, 1, 2]", "[1, 2, 3]"],
    correctAnswerIndex: 0,
    difficulty: "easy",
  },
  {
    id: "esc_room_3",
    roomNumber: 3,
    narrative: "A massive, humming cryptography core stands in your way. You must resolve a high-speed hashing conflict to sync the handshake keys.",
    questionText: "Which of the following hash algorithms is widely considered cryptographically broken and highly vulnerable to collision attacks?",
    options: ["SHA-256", "MD5", "SHA-512", "bcrypt"],
    correctAnswerIndex: 1,
    difficulty: "medium",
  },
  {
    id: "esc_room_4",
    roomNumber: 4,
    narrative: "The corridor narrows into a complex memory matrix. Watch your step: dereferencing an invalid memory address will trigger a kernel panic.",
    questionText: "In C, what is the behavior of dereferencing a NULL pointer?",
    options: [
      "It returns 0 safely.",
      "It raises a compile-time syntax warning.",
      "It triggers undefined behavior (often causing a segmentation fault).",
      "It automatically allocates a dynamic memory fallback."
    ],
    correctAnswerIndex: 2,
    difficulty: "medium",
  },
  {
    id: "esc_room_5",
    roomNumber: 5,
    narrative: "Multiple concurrent system threads are racing to lock the security valves. Eliminate the deadlock threat before the stack overflows.",
    questionText: "What condition occurs when two or more threads are blocked forever, each waiting for a resource or lock held by the other?",
    options: ["Race Condition", "Deadlock", "Livelock", "Starvation"],
    correctAnswerIndex: 1,
    difficulty: "hard",
  },
  {
    id: "esc_room_6",
    roomNumber: 6,
    narrative: "You stand before the Binary Tree of Despair. A high-priority lookup must traverse the nodes in O(log n) time, or the branch collapses.",
    questionText: "In a balanced Binary Search Tree containing 'n' elements, what is the worst-case time complexity of searching for a value?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswerIndex: 1,
    difficulty: "hard",
  },
  {
    id: "esc_room_7",
    roomNumber: 7,
    narrative: "The floor beneath you drops into a recursive depth-first stack. Declare the correct base condition before the process runs out of heap memory.",
    questionText: "What is the primary function of a base case in a recursive algorithm?",
    options: [
      "To optimize the space complexity of sequential loop loops.",
      "To terminate the recursion and prevent an infinite loop (stack overflow).",
      "To cache previous computation results dynamically.",
      "To allocate static variables in safe heap memory storage."
    ],
    correctAnswerIndex: 1,
    difficulty: "hard",
  },
  {
    id: "esc_room_8",
    roomNumber: 8,
    narrative: "The final door is sealed behind an NP-Complete algorithm. Decrypt the NP-Complete complexity model to escape the corrupted mainframe!",
    questionText: "If a decision problem is NP-Complete, which of the following is true?",
    options: [
      "It can be solved in polynomial time on any deterministic Turing machine.",
      "It belongs to the class NP, and every problem in NP can be reduced to it in polynomial time.",
      "It is mathematically proven to be completely unsolvable.",
      "It requires quantum superposition to verify its solution in logarithmic time."
    ],
    correctAnswerIndex: 1,
    difficulty: "impossible",
  },
];
