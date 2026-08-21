# minSkirbble

**minSkirbble** is a real-time multiplayer word-guessing game where one player draws a randomly selected word while the other players try to guess the word through chat.

**live-link**: https://minskribble-gamma.vercel.app

The current implementation is an **MVP (Minimum Viable Product)** focused on the core multiplayer drawing and guessing experience.

> **Repository:** `whiteBoard`  
> **Application:** `minSkirbble`

## 1. Project Structure

The application is divided into two main parts:

- **Frontend:** `app`
- **Backend:** `ws`

## 2. Core Game Concept

At the beginning of a game, players enter a **room ID** and **username**.

A player can either:

- Create a new room using the room ID.
- Join an existing room using the room ID.

Once there are at least two players in the room, the game can be started.

During each turn:

1. One player becomes the **drawer**.
2. The drawer receives the word.
3. The other players do **not** receive the word.
4. The drawer draws the word.
5. Other players attempt to guess the word through the chat.
6. Players receive points based on the game rules.
7. After the timer ends, the next round begins.

## 3. Game Flow

The overall game flow is:

```text
Enter Room ID + Username
          ↓
Create / Join Room
          ↓
      Press Start
          ↓
   Check Player Count
          ↓
   At Least 2 Players?
       ↙          ↘
     No            Yes
     ↓              ↓
   Wait        Start Game
                    ↓
             Select Drawer
                    ↓
            Send Word to Drawer
                    ↓
             Drawing Begins
                    ↓
          Players Guess in Chat
                    ↓
              Timer: 80 sec
                    ↓
             Next Round
                    ↓
              Round 2 → ... → Round 5
                    ↓
              Game Ends
                    ↓
          Close Room Connections
                    ↓
              Delete Room
```

## 4. Player Roles

There are two roles during a turn:

### Drawer

The drawer is the player responsible for drawing the selected word.

The drawer:

- Receives the word.
- Draws on the canvas.
- Has the responsibility of representing the word through the drawing.

### Guessers

The remaining players act as guessers.

Guessers:

- Do not receive the actual word.
- Observe the drawer's drawing.
- Submit guesses through the chat.
- Receive points when they guess the word correctly.

The word is therefore intentionally sent only to the current drawer.

## 5. Scoring

The current MVP uses the following scoring rules:

- Starting points for a player: **50 points**
- Correctly guessing the word: **+75 points**

The scoring system is part of the current MVP implementation.

## 6. Timer and Rounds

Each drawer has **80 seconds** to draw.

When the 80-second timer expires:

1. The current turn ends.
2. The next round begins.
3. A new drawer takes the drawing role.

The game continues until **Round 5**.

After Round 5, the game ends.

## 7. Game Completion and Cleanup

Once Round 5 has completed, the game is considered finished.

The room is then cleaned up by:

- Closing the connections associated with the room.
- Deleting the room ID from the server's room state.

After the room has been deleted, a new room can be created for another game.

## 8. MVP Scope

The current MVP focuses on the fundamental multiplayer game loop:

- Joining and creating rooms.
- Multiplayer WebSocket communication.
- Selecting a drawer.
- Providing the word only to the drawer.
- Real-time drawing.
- Guessing through chat.
- Scoring.
- 80-second turns.
- Five rounds.
- Ending the game.
- Cleaning up the room after the game ends.

The application is currently focused on making this core game loop functional if you can contribute to the this repo that would be an huge help before adding additional features.

