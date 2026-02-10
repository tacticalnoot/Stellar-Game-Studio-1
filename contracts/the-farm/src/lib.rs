#![no_std]

//! The Farm – ZK Dungeon (scaffold)
//!
//! Minimal lobby + progression contract wired to the Game Hub.
//! ZK verification is stubbed for now (will be replaced by a Noir verifier call).

use soroban_sdk::{
    contract, contractclient, contracterror, contractimpl, contracttype, Address, BytesN, Env,
};

// ── Game Hub client (existing testnet hub) ────────────────────────────────────
#[contractclient(name = "GameHubClient")]
pub trait GameHub {
    fn start_game(
        env: Env,
        game_id: Address,
        session_id: u32,
        player1: Address,
        player2: Address,
        player1_points: i128,
        player2_points: i128,
    );
    fn end_game(env: Env, session_id: u32, player1_won: bool);
}

// ── Errors ───────────────────────────────────────────────────────────────────
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    LobbyNotFound = 1,
    LobbyInactive = 2,
    AlreadyJoined = 3,
    AlreadyCommitted = 4,
    NotPlayer = 5,
    WrongFloor = 6,
    BadNonce = 7,
    NotWaiting = 8,
    GameFinished = 9,
    MissingCommit = 10,
}

// ── Types ────────────────────────────────────────────────────────────────────
#[derive(Clone, Debug, Eq, PartialEq)]
#[contracttype]
pub enum Status {
    Waiting,
    Active,
    Finished,
}

#[derive(Clone, Debug, Eq, PartialEq)]
#[contracttype]
pub struct PlayerState {
    pub commit: Option<BytesN<32>>,
    pub floor: u32,
    pub last_nonce: u32,
    pub cleared_gate1: bool,
    pub cleared_gate5: bool,
}

#[derive(Clone, Debug, Eq, PartialEq)]
#[contracttype]
pub struct Lobby {
    pub status: Status,
    pub player1: Address,
    pub player2: Option<Address>,
    pub p1: PlayerState,
    pub p2: PlayerState,
    pub winner: Option<Address>,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Lobby(u32),
    Admin,
    Hub,
}

// ── Constants ────────────────────────────────────────────────────────────────
const MAX_FLOOR: u32 = 10;

// ── Contract ─────────────────────────────────────────────────────────────────
#[contract]
pub struct TheFarm;

#[contractimpl]
impl TheFarm {
    // Initialize with an admin; hub defaults to known address but can be changed.
    pub fn __constructor(env: Env, admin: Address, game_hub: Address) {
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage()
            .instance()
            .set(&DataKey::Hub, &game_hub);
    }

    // Create a lobby (session_id = current ledger sequence cast to u32).
    pub fn create_lobby(env: Env, player1: Address) -> u32 {
        player1.require_auth();

        let lobby_id: u32 = (env.ledger().sequence() & 0xFFFF_FFFF) as u32;
        let lobby = Lobby {
            status: Status::Waiting,
            player1: player1.clone(),
            player2: None,
            p1: PlayerState {
                commit: None,
                floor: 0,
                last_nonce: 0,
                cleared_gate1: false,
                cleared_gate5: false,
            },
            p2: PlayerState {
                commit: None,
                floor: 0,
                last_nonce: 0,
                cleared_gate1: false,
                cleared_gate5: false,
            },
            winner: None,
        };
        env.storage().temporary().set(&DataKey::Lobby(lobby_id), &lobby);
        lobby_id
    }

    pub fn join_lobby(env: Env, lobby_id: u32, player2: Address) -> Result<(), Error> {
        let mut lobby: Lobby = env
            .storage()
            .temporary()
            .get(&DataKey::Lobby(lobby_id))
            .ok_or(Error::LobbyNotFound)?;
        if lobby.status != Status::Waiting {
            return Err(Error::NotWaiting);
        }
        player2.require_auth();
        if lobby.player2.is_some() {
            return Err(Error::AlreadyJoined);
        }
        if player2 == lobby.player1 {
            return Err(Error::AlreadyJoined);
        }
        lobby.player2 = Some(player2);
        env.storage()
            .temporary()
            .set(&DataKey::Lobby(lobby_id), &lobby);
        Ok(())
    }

    // Store commitment; start game when both players + commits present.
    pub fn set_commit(
        env: Env,
        lobby_id: u32,
        player: Address,
        commit: BytesN<32>,
    ) -> Result<(), Error> {
        let mut lobby: Lobby = env
            .storage()
            .temporary()
            .get(&DataKey::Lobby(lobby_id))
            .ok_or(Error::LobbyNotFound)?;
        if lobby.status != Status::Waiting {
            return Err(Error::NotWaiting);
        }
        player.require_auth();
        if player == lobby.player1 {
            if lobby.p1.commit.is_some() {
                return Err(Error::AlreadyCommitted);
            }
            lobby.p1.commit = Some(commit);
        } else if Some(player.clone()) == lobby.player2 {
            if lobby.p2.commit.is_some() {
                return Err(Error::AlreadyCommitted);
            }
            lobby.p2.commit = Some(commit);
        } else {
            return Err(Error::NotPlayer);
        }

        // If ready, start game and call hub.start_game
        if lobby.player2.is_some() && lobby.p1.commit.is_some() && lobby.p2.commit.is_some() {
            lobby.status = Status::Active;
            lobby.p1.floor = 1;
            lobby.p2.floor = 1;
            let hub: Address = env.storage().instance().get(&DataKey::Hub).unwrap();
            let hub_client = GameHubClient::new(&env, &hub);
            // Points = 0 for now; ZK proof handles correctness, not wagering.
            hub_client.start_game(
                &env.current_contract_address(),
                &lobby_id,
                &lobby.player1,
                lobby.player2.as_ref().unwrap(),
                &0,
                &0,
            );
        }

        env.storage()
            .temporary()
            .set(&DataKey::Lobby(lobby_id), &lobby);
        Ok(())
    }

    /// Attempt a door. ZK proof verification is stubbed: caller passes `is_correct`
    /// which will be replaced by verifier output once integrated.
    pub fn attempt_door(
        env: Env,
        lobby_id: u32,
        player: Address,
        floor: u32,
        attempt_nonce: u32,
        is_correct: bool,
    ) -> Result<(), Error> {
        let mut lobby: Lobby = env
            .storage()
            .temporary()
            .get(&DataKey::Lobby(lobby_id))
            .ok_or(Error::LobbyNotFound)?;
        if lobby.status != Status::Active {
            return Err(Error::LobbyInactive);
        }
        if lobby.winner.is_some() {
            return Err(Error::GameFinished);
        }
        player.require_auth();

        let caller_is_p1 = player == lobby.player1;
        let mut p1 = lobby.p1.clone();
        let mut p2 = lobby.p2.clone();
        let (mut self_state, mut other_state) = if caller_is_p1 {
            (p1.clone(), p2.clone())
        } else if Some(player.clone()) == lobby.player2 {
            (p2.clone(), p1.clone())
        } else {
            return Err(Error::NotPlayer);
        };

        if self_state.commit.is_none() {
            return Err(Error::MissingCommit);
        }
        if self_state.floor != floor {
            return Err(Error::WrongFloor);
        }
        if attempt_nonce != self_state.last_nonce + 1 {
            return Err(Error::BadNonce);
        }
        self_state.last_nonce = attempt_nonce;

        if is_correct {
            let next_floor = floor + 1;

            // Gate floors 1 and 5 require both players.
            if floor == 1 {
                self_state.cleared_gate1 = true;
                if other_state.cleared_gate1 {
                    self_state.floor = next_floor;
                    other_state.floor = next_floor;
                }
            } else if floor == 5 {
                self_state.cleared_gate5 = true;
                if other_state.cleared_gate5 {
                    self_state.floor = next_floor;
                    other_state.floor = next_floor;
                }
            } else {
                self_state.floor = next_floor;
            }

            // Win condition
            if next_floor > MAX_FLOOR {
                lobby.status = Status::Finished;
                lobby.winner = Some(player.clone());
                let hub: Address = env.storage().instance().get(&DataKey::Hub).unwrap();
                let hub_client = GameHubClient::new(&env, &hub);
                let player1_won = player == lobby.player1;
                hub_client.end_game(&lobby_id, &player1_won);
            }
        }

        // Write back updated state
        if caller_is_p1 {
            p1 = self_state;
            p2 = other_state;
        } else {
            p2 = self_state;
            p1 = other_state;
        }
        lobby.p1 = p1;
        lobby.p2 = p2;

        env.storage()
            .temporary()
            .set(&DataKey::Lobby(lobby_id), &lobby);
        Ok(())
    }

    pub fn get_lobby(env: Env, lobby_id: u32) -> Option<Lobby> {
        env.storage().temporary().get(&DataKey::Lobby(lobby_id))
    }

    // Admin utilities
    pub fn get_admin(env: Env) -> Address {
        env.storage().instance().get(&DataKey::Admin).unwrap()
    }
    pub fn set_admin(env: Env, new_admin: Address) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &new_admin);
    }
    pub fn get_hub(env: Env) -> Address {
        env.storage().instance().get(&DataKey::Hub).unwrap()
    }
    pub fn set_hub(env: Env, new_hub: Address) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();
        env.storage().instance().set(&DataKey::Hub, &new_hub);
    }
    pub fn upgrade(env: Env, new_hash: BytesN<32>) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();
        env.deployer().update_current_contract_wasm(new_hash);
    }
}

// Tests are omitted in this scaffold; will be added with Noir verifier integration.
