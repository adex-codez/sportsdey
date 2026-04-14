# Casino Game Integration Flow (LuckyWorldGames)

This document outlines the lifecycle of a casino game session and
clearly highlights where **our backend (Operator)** is involved.

Actors involved in the system:

-   **Player** -- The user playing the game in their browser.
-   **Operator (Our Backend)** -- Our casino platform that manages
    users, balances, and transactions.
-   **Game Provider (LuckyWorldGames)** -- Hosts the actual game engine
    and UI.

------------------------------------------------------------------------

# High Level Architecture

Player interacts with the provider's game UI, but **all money operations
are handled by our backend**.

    Player (Browser)
          |
          v
    Operator Backend (Our API)
          ^
          |
    Game Provider (LuckyWorldGames)

Important rule:

-   The **game runs on the provider**
-   The **wallet and balance live on our backend**

------------------------------------------------------------------------

# Game Session Flow

## 1. Player clicks "Play Game"

The player selects a game on our platform.

    Player → Our Backend

Example internal request:

    GET /play/{game}

### What our backend does

1.  Generate a **one-time launch token**
2.  Store the token in the database
3.  Construct the **game launch URL**

Example launch URL:

    https://play.luckyworldgames.com/launch/{game}
    ?user={user_id}
    &token={launch_token}
    &currency={currency}
    &operator={operator}

### Database Write

  field        description
  ------------ -----------------------
  token        one-time launch token
  user_id      player ID
  game         game code
  expires_at   token expiration
  used         boolean

  : `game_launch_tokens`

------------------------------------------------------------------------

# 2. Game Loads

Player is redirected to the provider's server.

    Player Browser → Game Provider

The game UI loads.

At this point the provider **does not yet trust the user**.

So it calls our authentication endpoint.

------------------------------------------------------------------------

# 3. Authentication

Provider verifies the player.

    Provider → Our Backend
    POST /api/account/auth

Request:

``` json
{
  "user_token": "launch_token",
  "session_token": "provider_session_token",
  "platform": "desktop",
  "currency": "USD"
}
```

### What our backend must do

1.  Validate the **launch token**
2.  Fetch the user
3.  Create a **game session**
4.  Store the `session_token`
5.  Return player balance

### Database Write

  field           description
  --------------- ------------------------
  session_token   provider session token
  user_id         player
  game            game being played
  status          active
  created_at      timestamp

  : `game_sessions`

Response example:

``` json
{
  "code": 200,
  "data": {
    "user_id": "123",
    "username": "player",
    "balance": 100000,
    "currency": "USD"
  }
}
```

------------------------------------------------------------------------

# 4. Player Places a Bet

When the user places a bet inside the game UI, the provider deducts
money from the player's wallet.

    Provider → Our Backend
    POST /api/account/withdraw_spribe

Request:

``` json
{
  "user_id": "123",
  "amount": 5000,
  "provider_tx_id": "tx123",
  "session_token": "session_token",
  "game": "AVIATOR"
}
```

### What our backend must do

1.  Validate session
2.  Check balance
3.  Deduct funds
4.  Store bet transaction
5.  Return updated balance

### Database Write

  field            description
  ---------------- ----------------------
  user_id          player
  provider_tx_id   provider transaction
  type             BET
  amount           bet amount
  session_token    session
  game             game code

  : `game_transactions`

------------------------------------------------------------------------

# 5. Player Wins (Payout)

If the player wins, the provider credits the player's wallet.

    Provider → Our Backend
    POST /api/account/deposit_spribe

Request example:

``` json
{
  "user_id": "123",
  "amount": 12000,
  "provider_tx_id": "tx124",
  "withdraw_provider_tx_id": "tx123"
}
```

### What our backend must do

1.  Add winnings to balance
2.  Store win transaction
3.  Return updated balance

### Database Write

Table: `game_transactions`

Transaction type:

    WIN

------------------------------------------------------------------------

# 6. Rollback (Error Handling)

If something goes wrong (timeout, server error), the provider cancels a
previous transaction.

    Provider → Our Backend
    POST /api/account/rollback_spribe

Example request:

``` json
{
  "user_id": "123",
  "rollback_provider_tx_id": "tx123",
  "amount": 5000
}
```

### What our backend must do

1.  Find the original transaction
2.  Reverse the balance change
3.  Record rollback transaction

Transaction type:

    ROLLBACK

------------------------------------------------------------------------

# 7. Player Info (Balance Sync)

Sometimes the provider checks the player's balance.

    Provider → Our Backend
    POST /api/account/player_info

Our backend returns:

``` json
{
  "balance": 100000,
  "currency": "USD"
}
```

------------------------------------------------------------------------

# Complete Flow Diagram

    1 Player clicks play
    Player → Operator

    2 Operator generates launch token
    Operator → Provider (redirect)

    3 Provider authenticates player
    Provider → /api/account/auth

    4 Player places bet
    Provider → /api/account/withdraw_spribe

    5 Player wins
    Provider → /api/account/deposit_spribe

    6 Error occurs (optional)
    Provider → /api/account/rollback_spribe

    7 Balance check (optional)
    Provider → /api/account/player_info

------------------------------------------------------------------------

# Endpoints Our Backend Must Implement

  Endpoint                            Purpose
  ----------------------------------- ---------------------
  POST /api/account/auth              Authenticate player
  POST /api/account/withdraw_spribe   Deduct bet
  POST /api/account/deposit_spribe    Credit win
  POST /api/account/rollback_spribe   Reverse transaction
  POST /api/account/player_info       Get balance

------------------------------------------------------------------------

# Important Implementation Rules

### 1. Transactions Must Be Idempotent

Always check:

    provider_tx_id

Duplicate requests can happen.

------------------------------------------------------------------------

### 2. Money Uses Integer Units

    1 USD = 1000 units

Example:

    $10 = 10000

------------------------------------------------------------------------

### 3. Never Trust `user_id` Alone

Always validate:

    session_token
    AND
    user_token

------------------------------------------------------------------------

# Summary

Key responsibilities of our backend:

-   Manage player balance
-   Authenticate game sessions
-   Process bets and wins
-   Handle rollbacks
-   Prevent duplicate transactions

The **provider runs the game**, but **our backend is the wallet and
source of truth for money**.
