import { Client } from "../../../bindings/the_farm/src/index";
import { NETWORK_PASSPHRASE, RPC_URL } from "@/utils/constants";

const client = new Client({
  contractId: import.meta.env.VITE_THE_FARM_CONTRACT_ID,
  networkPassphrase: NETWORK_PASSPHRASE,
  rpcUrl: RPC_URL,
});

export async function fetchLobby(lobbyId: number) {
  const tx = await client.get_lobby({ lobby_id: lobbyId });
  const sim = await tx.simulate();
  if (sim.result.isOk()) {
    return sim.result.unwrap();
  }
  return null;
}
