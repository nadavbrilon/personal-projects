# Nesting AI Tic-Tac-Toe project

This is GUI/AI introductory project.
Nesting Tic-Tac-Toe is a self invented variation of the original game (made up to challenge the Minimax algorithm with a larger amount of possible states).
In this variation, in addition to choosing to best game tile, each player (or comp) needs to choose a tile label size, spanning from 1 (smallest) to 5 (largest),
each size can only be picked once and a player can STOMP tiles with smaller tiles for its opponnet.
for example:
![image](https://user-images.githubusercontent.com/63443963/185794985-e3e67050-a948-4125-bf37-bc66395691f4.png)

### GUI:
Nesting Tic-Tac-Toe uses Pythons "Tktinker" library for its user interface (personal note: this is my first time using this library)

### AI:
The game is made up of 2 possible heuristics to choose from:
1. EASY - where the computers chooses a tile randomly (under the games rules)
2. HARD - using the MINIMAX algorithm. this is an optimal algorithm for sero-summed turn based games. it relies on an evaluation function to determine the best move.
          (another personal note: for this code, the heuristic can be improved by evaluating the number of adjecent tiles in a game state.
          
### WILL BE ADDED:
1. sounds and message boxes to make clear when a the computer stomps you (its very fast).
2. a splash screen.


