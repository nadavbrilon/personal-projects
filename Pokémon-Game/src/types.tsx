export interface PokemonPersonalDetails {
    filteredMoves: Awaited<unknown>[];
    index: number,
    id : number,
    name : string
    primaryType : string
    weight : number
    height : number
    pokemonArtwork : string
    HP : number
    attack : number
    defense : number
    specialAttack : number
    specialDefense : number
    speed : number
    battleStats : { won: number, loss: number}
    moves : [{move : {name: string}}]
}

export interface trainerStats {
    trainerWin: number
    trainerLose: number
}

export interface MovesArray {
    moves: ({id: number, name: string, power: number}[])
}

export enum RoundOutcome {
    Win = "Won",
    Loss = "Lost",
    Draw = "Draw"
}

export interface Scoreboard {
    userWin: number[],
    oppWin: number[]
}

export interface PlayedPokemon {
    user : number[],
    opponent: number[] //used pokemon index number
}
