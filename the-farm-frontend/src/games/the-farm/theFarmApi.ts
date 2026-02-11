import { Client } from "../../bindings/the_farm/src/index";
import { NETWORK_PASSPHRASE, RPC_URL, DEFAULT_METHOD_OPTIONS } from "@/utils/constants";
import type { contract } from "@stellar/stellar-sdk";
import { Buffer } from "buffer";

const contractId = import.meta.env.VITE_THE_FARM_CONTRACT_ID;

const readonlyClient = new Client({
  contractId,
  networkPassphrase: NETWORK_PASSPHRASE,
  rpcUrl: RPC_URL,
});

type Signer = Pick<contract.ClientOptions, "signTransaction"> &
  Partial<Pick<contract.ClientOptions, "signAuthEntry">>;

function signingClient(publicKey: string, signer: Signer) {
  return new Client({
    contractId,
    networkPassphrase: NETWORK_PASSPHRASE,
    rpcUrl: RPC_URL,
    publicKey,
    ...signer,
  });
}

export async function fetchLobby(lobbyId: number) {
  const tx = await readonlyClient.get_lobby({ lobby_id: lobbyId });
  const sim = await tx.simulate();
  if (sim.result.isOk()) {
    return sim.result.unwrap();
  }
  return null;
}

export async function createLobby(player: string, signer: Signer) {
  const client = signingClient(player, signer);
  const tx = await client.create_lobby({ player1: player }, DEFAULT_METHOD_OPTIONS);
  const sim = await tx.simulate();
  if (!sim.result.isOk()) throw new Error("Simulation failed");
  const sent = await tx.signAndSend();
  return { lobbyId: sim.result.unwrap(), hash: sent.hash };
}

export async function joinLobby(lobbyId: number, player: string, signer: Signer) {
  const client = signingClient(player, signer);
  const tx = await client.join_lobby(
    { lobby_id: lobbyId, player2: player },
    DEFAULT_METHOD_OPTIONS
  );
  await tx.simulate();
  const sent = await tx.signAndSend();
  return { hash: sent.hash };
}

export async function attemptDoor(
  lobbyId: number,
  floor: number,
  nonce: number,
  player: string,
  isCorrect: boolean,
  signer: Signer
) {
  const client = signingClient(player, signer);
  const tx = await client.attempt_door(
    {
      lobby_id: lobbyId,
      floor,
      attempt_nonce: nonce,
      is_correct: isCorrect,
    },
    DEFAULT_METHOD_OPTIONS
  );

  await tx.simulate();
  const sent = await tx.signAndSend();
  return { hash: sent.hash };
}

export async function setCommit(lobbyId: number, commit: Buffer, player: string, signer: Signer) {
  const client = signingClient(player, signer);
  const tx = await client.set_commit(
    { lobby_id: lobbyId, commit },
    DEFAULT_METHOD_OPTIONS
  );
  await tx.simulate();
  const sent = await tx.signAndSend();
  return { hash: sent.hash };
}
