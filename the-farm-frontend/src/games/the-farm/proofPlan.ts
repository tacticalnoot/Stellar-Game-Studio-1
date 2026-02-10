export type ProofStack = "circom" | "noir" | "risc0";

// Intent: rotate proof systems across the run.
// Floors 1-3: Circom/Groth16 (fast)
// Floors 4-7: Noir/Ultrahonk (mid)
// Floor 8-9: RISC Zero (heavy)
// Floor 10: Mixed attest (aggregated)
export const floorProofPlan: Record<number, ProofStack> = {
  1: "circom",
  2: "circom",
  3: "circom",
  4: "noir",
  5: "noir",
  6: "noir",
  7: "noir",
  8: "risc0",
  9: "risc0",
  10: "noir",
};
