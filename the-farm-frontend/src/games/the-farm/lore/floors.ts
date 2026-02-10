export type FloorDesign = {
  id: number;
  title: string;
  proofStack: "circom" | "noir" | "risc0" | "mixed";
  coOp: boolean;
  miniGame: string;
  playerArc: string;
  copy: string;
};

export const FLOOR_DESIGNS: FloorDesign[] = [
  {
    id: 1,
    title: "Customs Gate",
    proofStack: "circom",
    coOp: false,
    miniGame: "Rune Stencil Rush — both players race to stamp the correct rune; first accurate stamp advances, second gets a hint.",
    playerArc: "You learn to act fast under scrutiny, defining your call-sign.",
    copy: "Your manifest must be sealed; the checkpoint AI only respects clean stencils.",
  },
  {
    id: 2,
    title: "Freight Scales",
    proofStack: "circom",
    coOp: false,
    miniGame: "Weight Bluff — choose cargo crates; one is real weight, others decoys. Bluffing logged; truth advances.",
    playerArc: "You realize honesty is an accelerator when the ledger is the judge.",
    copy: "Scales hum; only truthful weight unlocks the lift.",
  },
  {
    id: 3,
    title: "Vault Ledger",
    proofStack: "circom",
    coOp: false,
    miniGame: "Ledger Slots — line up sigils to match the ledger checksum; wrong aligns trigger sand traps.",
    playerArc: "You start treating each attempt as part of your legend, not a mistake.",
    copy: "Notary lights flicker as your entry etches into stone.",
  },
  {
    id: 4,
    title: "Mirror of Intent",
    proofStack: "noir",
    coOp: false,
    miniGame: "Echo Whisper — speak a rune pattern; mirror judges sincerity via rhythm matching.",
    playerArc: "You learn that cadence and intent outweigh volume.",
    copy: "The mirror remembers tone, not words.",
  },
  {
    id: 5,
    title: "Twin Locks",
    proofStack: "noir",
    coOp: true,
    miniGame: "Sync Keys — two players must press paired glyphs within a heartbeat window; desync logs but doesn’t open.",
    playerArc: "Trust forms; your partner becomes part of your toolkit.",
    copy: "Two turns, one gate; harmony or halt.",
  },
  {
    id: 6,
    title: "Labyrinth Map",
    proofStack: "noir",
    coOp: false,
    miniGame: "Path Sketch — draw a flight vector on a hologrid; correct vector opens a corridor. Paths hidden from opponent, only success signal shown.",
    playerArc: "You master planning under secrecy.",
    copy: "Mission control only needs your checksum.",
  },
  {
    id: 7,
    title: "Resonance Choir",
    proofStack: "noir",
    coOp: false,
    miniGame: "Pitch Duel — choose a tone; engine hum responds. Matching the harmonic raises the platform. Opponent sees your hum state only.",
    playerArc: "Precision over force; your confidence hardens.",
    copy: "Engines purr when truth is on key.",
  },
  {
    id: 8,
    title: "Blackbox Furnace",
    proofStack: "risc0",
    coOp: false,
    miniGame: "Forge Run — feed ingredients to a sealed crucible; receipt proves the recipe. Wrong mix vents steam but still logs.",
    playerArc: "You entrust work to the machine and accept the delay of heavy proof.",
    copy: "The furnace signs your attempt; the bridge lowers only for the right alloy.",
  },
  {
    id: 9,
    title: "Time Dilation Test",
    proofStack: "risc0",
    coOp: false,
    miniGame: "Playback Pilot — replay your path in a slowed-down sim; sealed recorder signs it. Correct replay synchronizes the wormhole ring.",
    playerArc: "You reconcile memory with evidence; discipline peaks.",
    copy: "The recorder believes only what it signs.",
  },
  {
    id: 10,
    title: "Stellar Confluence",
    proofStack: "mixed",
    coOp: true,
    miniGame: "Final Braid — weave your manifests, oaths, and blackbox receipts into a final codeword; submit together. First to weave right triggers end_game.",
    playerArc: "You and your rival-ally conclude the saga: respect through evidence.",
    copy: "All seals converge; the Archive crowns the one who braids cleanest.",
  },
];
