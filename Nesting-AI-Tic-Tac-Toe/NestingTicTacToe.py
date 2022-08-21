import copy
import time
import tkinter as tk
from tkinter import font
from tkinter import messagebox
import random

# Script defines
LARGE_FONT = ("Verdana", 20)
PLAYER_TURN = ("calibri",20)
WINNER_TIE_LABEL = ("calibri", 40)
WINNER_TILE_COLOR = "green"
LEVEL = 2
EASY = 0
MEDIUM = 1
HARD = 2

class App(tk.Tk):
    def __init__(self, *args, **kwargs):
        tk.Tk.__init__(self,*args, *kwargs)
        self.container = tk.Frame(self)
        self.title("Nesting Tic-Tac-Toe")
        # Game mechanics
        self.depth = 1
        self.players = ['x', 'o']
        self.human = random.choice(self.players)        # assign x/o randomly
        if self.human == 'x':
            self.ai = 'o'
            # self.announce_label = tk.Label(self, text="Your'e playing as - O \n Good Luck!", font=LARGE_FONT)
            # self.announce_label.grid(row=1, column=0, columnspan=2)
            # self.announce_label.after(3000, lambda : self.announce_label.destroy())
        elif self.human == 'o':
            self.ai = 'x'
            # self.announce_label = tk.Label(self, text="Your'e playing as - X \n Good Luck!", font=LARGE_FONT)
            # self.announce_label.grid(row=0, column=0, columnspan=2)
            # self.announce_label.after(3000, lambda : self.announce_label.destroy())

        self.curr_player = random.choice([self.ai, self.human])
        print("curr - " + self.curr_player)
        print("human - " + self.human)
        print("ai - " + self.ai)
        self.choice_size = tk.IntVar()  # choice_size - holds the current size of x/o player chose to play.(def val = 0)
        self.choice_size.set(0)
        self.button_info = [[0,0,0],
                            [0,0,0],
                            [0,0,0]]
        self.button_list = [[0,0,0],
                            [0,0,0],
                            [0,0,0]]
        "button info - holds information (player,..........."

        # Game Labels
        self.winner_label = tk.Label(self, text=self.curr_player + "  Wins!", borderwidth=3, bg="white", anchor=tk.CENTER,
                                     font=WINNER_TIE_LABEL)
        self.tie_label = tk.Label(self, text="Game Tie", borderwidth=3, bg="white", anchor=tk.CENTER,
                                  font=WINNER_TIE_LABEL)
        # Frame Defintions - Stat Frame
        self.stat_frame = StatFrame(self.curr_player)
        self.stat_frame.grid(pady=100, row=0,column=1)

        self.reset_button = tk.Button(self, text="Reset Game", anchor="s", borderwidth=2 ,pady=5, padx=5,
                                                                                                command=self.newGame)
        self.reset_button.grid(pady=20, row=0, column=1, sticky="n")

        # Frame Defintions - Choice Frame
        self.main_choice_frame = tk.LabelFrame(self)
        self.main_choice_frame.grid(row=1, column=0, columnspan=2, rowspan=2)
        self.button_frame  = [1,2,3,4,5]
        self.choice_label = [1,2,3,4,5]
        self.choice_button = [1,2,3,4,5]
        self.used_sizes_ai = set()                              # added - insted of used_sizes = [set(),set()]
        self.used_sizes_human = set()
        self.pixel = tk.PhotoImage(width=1,height=1)

        for i in range(5):
            self.button_frame[i] = tk.LabelFrame(self.main_choice_frame, text = i+1)
            self.button_frame[i].grid(row=1, column=i)

            # create radio buttons for each frame
            self.choice_button[i] = tk.Radiobutton(self.button_frame[i], variable=self.choice_size, value = i+1)
            self.choice_button[i].grid(row=1, column=i)

            self.choice_label[i] = tk.Label(self.button_frame[i], image=self.pixel, text=self.curr_player, height=52, width=70,
                                            compound="center", font=("calibri", 10+ 12*i), anchor=tk.CENTER)
            self.choice_label[i].grid(row=2, column=i)

        # Frame Defintions - Game Frame
        self.game_frame = tk.Frame(self)
        self.game_frame.grid(row=0,column=0, padx=10, pady=10)

        # add 2D buttons
        for row in range(3):
            for col in range(3):
                self.button_list[row][col] = tk.Button(self.game_frame, image=self.pixel, compound="center",
                       text="", height=110, width=102,
                            command=lambda row=row, column=col:
                                                self.nextTurn(row, column,self.choice_size.get(), self.curr_player)
                                                                        if self.choice_size.get() != 0 else tk.DISABLED)
                self.button_list[row][col].grid(row=row, column=col)


        # case - first player is AI
        if self.curr_player == self.ai:
            self.ai_move = AI(self.curr_player, self.button_info, self.used_sizes_ai, self.used_sizes_human
                              ,self.depth,0).heuristic()
            print("ai move: " + str(self.ai_move))
            self.nextTurn(self.ai_move[0], self.ai_move[1], self.ai_move[2], self.ai)


    def changePlayer(self):
        "changePlayer -............................................................."
        self.depth +=1

        if self.curr_player == self.ai:
            self.curr_player = self.human
            self.stat_frame = StatFrame(self.human)    # update stats frame
            self.stat_frame.grid(row=0, column=1)
        else:
            self.curr_player = self.ai
            self.stat_frame = StatFrame(self.ai)    # update stats frame
            self.stat_frame.grid(row=0, column=1)

        # update main_button_frame player labels - remove used ones
        for i in range(5):
            self.choice_button[i] = tk.Radiobutton(self.button_frame[i], variable=self.choice_size, value = i+1)
            self.choice_button[i].grid(row=1, column=i)
            self.choice_label[i] = tk.Label(self.button_frame[i],image=self.pixel, text=self.curr_player, height=52,
                                        width=72, compound="center", font=("calibri", 10+ 12*i), anchor=tk.CENTER)
            self.choice_label[i].grid(row=2, column=i)

            # remove chosen sizes from possible size pick options
            if self.curr_player == self.ai and (i + 1) in self.used_sizes_ai:
                self.choice_label[i]["text"] = ""
                self.choice_button[i]['state'] = tk.DISABLED
            elif self.curr_player == self.human and (i + 1) in self.used_sizes_human:
                self.choice_label[i]['text'] = ""
                self.choice_button[i]['state'] = tk.DISABLED

    def paintWinner(self,list,color):
        "paintWinner - colors a recieved list of game buttons a chosen color"
        for i in range(len(list)):
            list[i]["bg"] = color

    def isBoardFull(self):
        for row in range(3):
            for column in range(3):
                if self.button_info[row][column] == 0:
                    return False
        return True

    def updateChosenSize(self, current_player, size):
        "updateChosenSize - add used sizes into corresponding list for each player"
        if self.curr_player == self.ai:
            self.used_sizes_ai.add(size)
            # print("used AI: "+ str(self.used_sizes_ai))
        else:
            self.used_sizes_human.add(size)

    def updateGameBoard(self,current_player ,row ,column ,size):
        "updateGameBoard - updates the game board and displays it after a move was made"
        self.button_list[row][column]['text'] = current_player
        self.button_info[row][column] = (size, current_player)
        self.button_list[row][column]['font'] = ("calibri", 10 + 12 * (size - 1))
        self.button_list[row][column].grid(row=row, column=column)


    # win variations
    def checkVertical(self, column):
        # check only changed column
        col_values = []
        for row in range(3):
            if self.button_list[row][column]['text'] == "":
                return False;
            col_values.append(self.button_list[row][column])
        if all(element['text'] == col_values[0]['text'] for element in col_values):
            self.paintWinner(col_values, WINNER_TILE_COLOR)
            return True
        return False

    def checkHorizontal(self, row):
        # check only changed row
        row_values = []
        for col in range(3):
            if self.button_list[row][col]['text'] == "":
                return False
            row_values.append(self.button_list[row][col])
        win_flag = all(element['text'] == (row_values[0])['text'] for element in row_values)

        if win_flag:
            self.paintWinner(row_values, WINNER_TILE_COLOR)
            return True
        return False

    def checkMainDiagonal(self, row, column):
        diag_values = []
        for i in range(3):
            if self.button_list[i][i]['text'] == "":
                return False
            diag_values.append(self.button_list[i][i])
        if all(element['text'] == diag_values[0]['text'] for element in diag_values):
            self.paintWinner(diag_values, WINNER_TILE_COLOR)
            return True
        return False

    def checkSecondDiagonal(self, row, column):
        sub_diag_values = []
        for i in range(3):
            for j in range(3):
                if (i + j == 2):  # todo: make generic for board size
                    if self.button_list[i][j]['text'] == "":
                        return False
                    sub_diag_values.append(self.button_list[i][j])
        if all(element['text'] == sub_diag_values[0]['text'] for element in sub_diag_values):
            self.paintWinner(sub_diag_values, WINNER_TILE_COLOR)
            return True
        return False

    def checkWinner(self,row ,column):
        checks = [self.checkVertical(column), self.checkHorizontal(row), self.checkMainDiagonal(row, column),
                  self.checkSecondDiagonal(row, column)]
        for check in checks:
            if check == True:
                self.winner_label = tk.Label(self, text=self.curr_player + "  Wins!", borderwidth=3, bg="white",
                                             anchor=tk.CENTER, font=WINNER_TIE_LABEL)
                self.winner_label.grid(row=0, column=0, columnspan=2)
                for row in range(3):
                    for col in range(3):
                        self.button_list[row][col]['command'] = tk.DISABLED
                return True
        if (check != True)and((self.isBoardFull())or(len(self.used_sizes_human) == 5 and len(self.used_sizes_ai) == 5)):
            # tied position
            self.tie_label = tk.Label(self, text="Game Tie", borderwidth=3, bg="white", anchor=tk.CENTER,
                                      font=WINNER_TIE_LABEL)
            # print(self.button_info)
            self.tie_label.grid(row=0, column=0, columnspan=3)
            for row in range(3):
                for col in range(3):
                    self.button_list[row][col]["command"] = tk.DISABLED
            if self.curr_player == self.human:
                return 1    # evaluation for human win
            elif self.curr_player == self.ai:
                return -1   # evaluation for AI win
        return 0    # no winner

    def nextTurn(self, row, column, size, current_player):
        "nextTurn - ...................................................."
        if self.curr_player == self.ai:
            # put move on the board
            self.updateGameBoard(self.curr_player, row, column, size)

            # update board info
            self.button_info[self.ai_move[0]][self.ai_move[1]] = (size, self.ai)

            # ai - update chosen_sizes
            self.updateChosenSize(self.curr_player, size)

            win_flag = self.checkWinner(row, column)
            if win_flag == 0:
                self.changePlayer()

        elif self.curr_player == self.human:
            if self.button_list[row][column]['text'] == "":
                if (size not in self.used_sizes_human):
                    # put move on the board
                    self.updateGameBoard(self.curr_player ,row ,column ,size)

                    # update board info
                    self.button_info[row][column] = (size, self.human)

                    # human - update chosen size
                    self.updateChosenSize(self.curr_player, size)

                    eval = self.checkWinner(row,column)
                    if eval == 0:
                        self.changePlayer()

                    # AI make a move (best move)
                    self.ai_move = AI(self.curr_player, self.button_info, self.used_sizes_ai, self.used_sizes_human
                                                                                    ,self.depth, LEVEL).heuristic()
                    self.nextTurn(self.ai_move[0], self.ai_move[1], self.ai_move[2], self.ai)

            elif self.button_list[row][column]['text'] != self.curr_player and self.button_info[row][column][0] < size:
                # put move on the board
                self.updateGameBoard(self.curr_player, row, column, size)

                # update board info
                self.button_info[row][column] = (size, self.human)

                # human - update chosen size
                self.updateChosenSize(self.curr_player, size)

                eval = self.checkWinner(row, column)
                if eval == 0:
                    self.changePlayer()

                # AI make a move
                self.ai_move = AI(self.curr_player, self.button_info, self.used_sizes_ai, self.used_sizes_human,
                                                                                    self.depth, LEVEL).heuristic()[1]
                self.nextTurn(self.ai_move[0], self.ai_move[1], self.ai_move[2], self.ai)


            # optional:
            # elif button_list[row][column]['text'] != player and button_info[row][column][0] >= size:
            #     todo : add error message for this instance

    def newGame(self):
        self.winner_label.grid_forget()
        self.tie_label.grid_forget()

        for row in range(3):
            # initliaze color
            self.paintWinner([self.button_list[row][0], self.button_list[row][1], self.button_list[row][2]],
                                                                                                    "SystemButtonFace")
            for col in range(3):
                # initiliaze Game frame and game information
                self.button_list[row][col]['text'] = ""
                self.button_list[row][col]['state'] = tk.ACTIVE
                self.button_list[row][col]['command'] = lambda row=row, column=col: \
                    self.nextTurn(row, column,self.choice_size.get())\
                                                                        if self.choice_size.get() != 0 else tk.DISABLED
                self.button_list[row][col].grid(row=row, column=col)
                self.button_info[row][col] = 0
        # initliaze choices
        [self.used_sizes[i].clear() for i in range(2)]
        for i in range(5):
            # remove chosen sizes from possible size pick options
            self.choice_size.set(0)
            if self.player == self.players[0] and (i + 1) not in self.used_sizes[0]:
                self.choice_label[i]["text"] = self.player
                self.choice_button[i]['state'] = tk.ACTIVE
            elif self.player == self.players[1] and (i + 1) not in self.used_sizes[1]:
                self.choice_label[i]['text'] = self.player
                self.choice_button[i]['state'] = tk.ACTIVE

class StatFrame(tk.Frame):
    def __init__(self, player):
        tk.Frame.__init__(self)
        # Frame Defintions
        stat_frame = tk.LabelFrame(self, text="Stats")
        stat_frame.grid(row=0, column=1)
        # Frame Labels
        self.ai = 'x' if player == 'o' else 'o'
        # self.player_type_label = tk.Label(stat_frame, text= "AI is: {} \n Player is: {}".format(self.ai, player))
        # self.player_type_label.grid(row=1, column=1)
        self.player_turn = tk.Label(stat_frame, text=player + " turn", font=PLAYER_TURN)
        self.player_turn.grid(pady=30, row=0, column=1)

    def changePlayerLabel(self, player, frame):
            self.player_turn = tk.Label(frame, text=player + "  turn", font=PLAYER_TURN)
            self.player_turn.grid(row=0,column=1)

class AI():
    def __init__(self, player,board_info, ai_used_sizes, human_used_sizes, depth, LEVEL):
        self.ai = player
        self.human = 'o'
        self.board = board_info
        self.ai_used_sizes = ai_used_sizes
        self.human_used_sizes = human_used_sizes
        self.eval = 0    # evaluation for a specific game board
        self.depth = depth
        self.level = LEVEL

        if self.human == self.ai:
            self.human = 'x'

    def possibleMoves(self, board, player, player_used_sizes):
        "possibleMoves - function returns a list of all possible moves for a game state (row, column, (size, player))"
        possible_moves = []
        # find sizes not used
        unused_sizes = list(set([1, 2, 3, 4, 5]).difference(set(player_used_sizes)))
        for row in range(3):
            for col in range(3):
                # find empty spaces
                if board[row][col] == 0:
                    for size in unused_sizes:
                        possible_moves.append((row, col, size))
                else:
                    # place all of them who are possible to use for a specific button in the list
                    stomp_sizes = [size for size in unused_sizes if size > board[row][col][0]]
                    if board[row][col][1] != player and len(stomp_sizes) > 0:
                        for size in stomp_sizes:
                            possible_moves.append((row,col,size))
        # print(possible_moves)
        return possible_moves

    def checkWinner(self, board):
        # horizontal win
        for row in range(3):
            cond = all(board[row][col] != 0 for col in range(3))
            if cond and (board[row][0][1] == board[row][1][1] == board[row][2][1]):
                if board[row][0][1] == self.ai:
                    self.eval = 1
                else:
                    self.eval = -1
                return self.eval

        # vertical win
        for col in range(3):
            cond = all(board[row][col] != 0 for row in range(3))
            if cond and (board[0][col][1] == board[1][col][1] == board[2][col][1]):
                if board[0][col][1] == self.ai:
                   self.eval = -1
                else:
                    self.eval = 1
                return self.eval

        # main diagonal win
        cond = all(board[i][i] != 0 for i in range(3))
        if cond and (board[0][0][1] == board[1][1][1]  == board[2][2][1]):
            if board[0][0][1] == self.ai:
                self.eval = -1
            else:
                self.eval = 1
            return self.eval

        # second diagonal win
        cond = (board[0][2] != 0 and board[1][1] != 0 and board[2][0] != 0)
        if cond and (board[0][2][1] == board[1][1][1] == board[2][0][1]):
            if board[0][2][1] == self.ai:
                self.eval = -1
            else:
                self.eval = 1
            return self.eval

        self.eval = 0
        return self.eval


    def minimax(self, board, depth, ai_used_sizes, human_used_sizes, is_maximizing):
        if depth == 0 or  self.checkWinner(board) != 0 :
            return self.eval, None

        if is_maximizing:               # human
            max_eval = float("-inf")
            children = self.possibleMoves(board, self.human, human_used_sizes)
            for child in children:
                temp_board = copy.deepcopy(board)
                temp_human_used_sizes = copy.deepcopy(human_used_sizes)
                # print(temp_board)
                temp_board[child[0]][child[1]] = (child[2], self.human)
                # add to used sizes - human
                temp_human_used_sizes.add(child[2])
                eval = self.minimax(temp_board, depth - 1, ai_used_sizes, temp_human_used_sizes, False)[0]
                max_eval = max(max_eval, eval)
                if eval == max_eval:
                    best_move = (child[0], child[1], child[2])
            return max_eval, best_move

        else:                         # computer
            min_eval = float("inf")
            children = self.possibleMoves(board, self.ai, ai_used_sizes)
            for child in children:
                temp_board = copy.deepcopy(board)
                temp_ai_used_sizes = copy.deepcopy(ai_used_sizes)
                temp_board[child[0]][child[1]] = (child[2], self.ai)
                # add to used sizes - AI
                temp_ai_used_sizes.add(child[2])
                eval = self.minimax(temp_board, depth -1,temp_ai_used_sizes, human_used_sizes, True)[0]
                min_eval = min(min_eval, eval)
                if eval == min_eval:
                    best_move = (child[0], child[1], child[2])
            return min_eval, best_move


    def heuristic(self):
        if self.level == EASY:
            # random heuristic
            choices = self.possibleMoves(self.board, self.ai, self.ai_used_sizes)
            return random.choice(choices)

        elif self.level == MEDIUM:
            pass

        elif self.level == 2:
            # minimax heuristic
            eval, best_move_t = self.minimax(self.board, self.depth,self.ai_used_sizes, self.human_used_sizes, False)
            return best_move_t



if __name__=="__main__":
   app = App()
   app.mainloop()
