export type FloorDesign = {
  id: number;
  title: string;
  proofStack: "circom" | "noir" | "risc0" | "mixed";
  coOp: boolean;
  miniGame: string;
  realWorldUse: string;
  playerArc: string;
  copy: string;
  question: string;
  hint?: string;
  options: { label: string; text: string }[];
  correctOptionIndex: number;
};

export const FLOOR_DESIGNS: FloorDesign[] = [
  {
    id: 1,
    title: "Customs Gate",
    proofStack: "circom",
    coOp: false,
    miniGame: "Rune Stencil Rush",
    realWorldUse: "Border declaration form verified without exposing cargo contents.",
    playerArc: "You learn to act fast under scrutiny, defining your call-sign.",
    copy: "Your manifest must be sealed; the checkpoint AI only respects clean stencils.",
    question: "The scanner demands a declaration of intent. Which rune matches the customs seal?",
    hint: "Hint: look for the option that signals lawful trade, not force.",
    options: [
      { label: "A", text: "The Broken Oar (Illicit)" },
      { label: "B", text: "The Gilded Scale (Merchant)" },
      { label: "C", text: "The Iron Gate (Official)" },
      { label: "D", text: "The Void Eye (Anonymous)" },
    ],
    correctOptionIndex: 1, // Merchant
  },
  {
    id: 2,
    title: "Freight Scales",
    proofStack: "circom",
    coOp: false,
    miniGame: "Weight Bluff",
    realWorldUse: "Truck weigh-station ticket proving compliance without revealing route.",
    playerArc: "You realize honesty is an accelerator when the ledger is the judge.",
    copy: "Scales hum; only truthful weight unlocks the lift.",
    question: "Your cargo is heavier than declared. How do you balance the scales?",
    hint: "Hint: calibration beats concealment.",
    options: [
      { label: "A", text: "Bribe the sensor ghost" },
      { label: "B", text: "Jettison the fuel reserves" },
      { label: "C", text: "Recalibrate the tare weight (Truth)" },
      { label: "D", text: "Mask the gravity signature" },
    ],
    correctOptionIndex: 2, // Truth
  },
  {
    id: 3,
    title: "Vault Ledger",
    proofStack: "circom",
    coOp: false,
    miniGame: "Ledger Slots",
    realWorldUse: "Notary-sealed timestamp anchoring a document hash.",
    playerArc: "You start treating each attempt as part of your legend, not a mistake.",
    copy: "Notary lights flicker as your entry etches into stone.",
    question: "The ledger requires a checksum to timestamp your arrival. Input the sequence:",
    hint: "Hint: the ledger certifies what exists now, not later.",
    options: [
      { label: "A", text: "Alpha-9-Zulu (Current Block)" },
      { label: "B", text: "Omega-0-Void (Future)" },
      { label: "C", text: "Beta-2-Echo (Past)" },
      { label: "D", text: "Delta-4-Root (Null)" },
    ],
    correctOptionIndex: 0, // Current Block
  },
  {
    id: 4,
    title: "Mirror of Intent",
    proofStack: "noir",
    coOp: false,
    miniGame: "Echo Whisper",
    realWorldUse: "Witness statement attested without revealing the secret testimony.",
    playerArc: "You learn that cadence and intent outweigh volume.",
    copy: "The mirror remembers tone, not words.",
    question: "The mirror reflects your true self. What do you whisper to pass?",
    hint: "Hint: intent outranks ego.",
    options: [
      { label: "A", text: "I seek power." },
      { label: "B", text: "I fear nothing." },
      { label: "C", text: "I carry the burden." },
      { label: "D", text: "I am the signal. (Intent)" },
    ],
    correctOptionIndex: 3, // Intent
  },
  {
    id: 5,
    title: "Twin Locks",
    proofStack: "noir",
    coOp: true,
    miniGame: "Sync Keys",
    realWorldUse: "Dual-control launch keys ensuring two parties consent to a transaction.",
    playerArc: "Trust forms; your partner becomes part of your toolkit.",
    copy: "Two turns, one gate; harmony or halt.",
    question: "A dual-key system. You must turn your key in sync with your partner. When?",
    hint: "Hint: the lock rewards simultaneous consent.",
    options: [
      { label: "A", text: "Before they signal" },
      { label: "B", text: "On the heartbeat (Sync)" },
      { label: "C", text: "After the click" },
      { label: "D", text: "When the light turns red" },
    ],
    correctOptionIndex: 1, // Sync
  },
  {
    id: 6,
    title: "Labyrinth Map",
    proofStack: "noir",
    coOp: false,
    miniGame: "Path Sketch",
    realWorldUse: "Signed flight plan / supply-chain route committed privately, validated publicly.",
    playerArc: "You master planning under secrecy.",
    copy: "Mission control only needs your checksum.",
    question: "The map shifts. You need to commit to a path without revealing it. Draw your vector:",
    hint: "Hint: the puzzle rewards deliberate structure.",
    options: [
      { label: "A", text: "North-North-West (The Shortcut)" },
      { label: "B", text: "East-South-East (The Scenic Route)" },
      { label: "C", text: "Straight Through (The Brute Force)" },
      { label: "D", text: "The Golden Ratio Spiral (Calculated)" },
    ],
    correctOptionIndex: 3, // Calculated
  },
  {
    id: 7,
    title: "Resonance Choir",
    proofStack: "noir",
    coOp: false,
    miniGame: "Pitch Duel",
    realWorldUse: "Access control where biometric liveness is proven without sharing the biometric sample.",
    playerArc: "Precision over force; your confidence hardens.",
    copy: "Engines purr when truth is on key.",
    question: "The engine hums a specific frequency. Match the pitch to stabilize the lift.",
    hint: "Hint: align with the target resonance.",
    options: [
      { label: "A", text: "432 Hz (Natural)" },
      { label: "B", text: "440 Hz (Standard)" },
      { label: "C", text: "50 Hz (Mains)" },
      { label: "D", text: "The Resonant Frequency (Match)" },
    ],
    correctOptionIndex: 3, // Match
  },
  {
    id: 8,
    title: "Blackbox Furnace",
    proofStack: "risc0",
    coOp: false,
    miniGame: "Forge Run",
    realWorldUse: "Tamper-proof computation of an ML model producing a signed receipt without revealing the model.",
    playerArc: "You entrust work to the machine and accept the delay of heavy proof.",
    copy: "The furnace signs your attempt; the bridge lowers only for the right alloy.",
    question: "Input the raw ore. The furnace needs the correct alloy mix ratio.",
    hint: "Hint: the right recipe is balanced, not arbitrary.",
    options: [
      { label: "A", text: "75% Iron, 25% Carbon" },
      { label: "B", text: "90% Copper, 10% Tin" },
      { label: "C", text: "The Golden Mean Mix (Perfect)" },
      { label: "D", text: "Random Scrap" },
    ],
    correctOptionIndex: 2, // Perfect
  },
  {
    id: 9,
    title: "Time Dilation Test",
    proofStack: "risc0",
    coOp: false,
    miniGame: "Playback Pilot",
    realWorldUse: "Blackbox flight recorder attesting to a vehicle’s path for insurance without sharing raw telemetry.",
    playerArc: "You reconcile memory with evidence; discipline peaks.",
    copy: "The recorder believes only what it signs.",
    question: "Relive your past moves. The simulation runs fast. When do you hit the brakes?",
    hint: "Hint: precision timing beats panic.",
    options: [
      { label: "A", text: "Before the crash" },
      { label: "B", text: "At the event horizon (Precision)" },
      { label: "C", text: "After the loop closes" },
      { label: "D", text: "Never" },
    ],
    correctOptionIndex: 1, // Precision
  },
  {
    id: 10,
    title: "Stellar Confluence",
    proofStack: "mixed",
    coOp: true,
    miniGame: "Final Braid",
    realWorldUse: "Compliance bundle: KYC attestation + transaction audit + compute receipt rolled into one escrow release.",
    playerArc: "You and your rival-ally conclude the saga: respect through evidence.",
    copy: "All seals converge; the Archive crowns the one who braids cleanest.",
    question: "The final seal. Merge your proof with your partner's. Bind the contract.",
    hint: "Hint: cooperation is the only valid closeout.",
    options: [
      { label: "A", text: "Submit alone" },
      { label: "B", text: "Overwrite their signature" },
      { label: "C", text: "Braid the signatures (Union)" },
      { label: "D", text: "Cancel the contract" },
    ],
    correctOptionIndex: 2, // Union
  },
];
