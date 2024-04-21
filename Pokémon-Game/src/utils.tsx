import {PokemonPersonalDetails, MovesArray, RoundOutcome} from "./types.tsx";

/* type chart of duling - */
const typeChart = [
    //           NOR  FIR  WAT  ELE  GRA  ICE  FIG  POI  GRO  FLY  PSY  BUG  ROC  GHO  DRA  DAR  STE  FAI
    /* NORMAL */ [ 1,   0.5, 0.5,  1,   1,   1,   1,   1,   1,   1,   1,   1,   0.5, 0,   1,   1,   0.5, 1 ],
    /* FIRE */   [ 1,   0.5, 0.5,  1,   2,   2,   1,   1,   1,   1,   1,   2,   0.5, 1,   0.5, 1,   2,   1 ],
    /* WATER */  [ 1,   2,   0.5,  1,   0.5, 1,   1,   1,   2,   1,   1,   1,   2,   1,   0.5, 1,   1,   1 ],
    /* ELECTRIC*/[ 1,   1,   2,    0.5, 0.5, 1,   1,   1,   0,   2,   1,   1,   1,   1,   0.5, 1,   1,   1 ],
    /* GRASS */  [ 1,   0.5, 2,    1,   0.5, 1,   1,   0.5, 2,   0.5, 1,   0.5, 2,   1,   0.5, 1,   0.5, 1 ],
    /* ICE */    [ 1,   0.5, 0.5,  1,   2,   0.5, 1,   1,   2,   2,   1,   1,   1,   1,   2,   1,   0.5, 1 ],
    /* FIGHTING*/[ 2,   1,   1,    1,   1,   2,   1,   0.5, 1,   0.5, 0.5, 0.5, 2,   0,   1,   2,   2,   0.5 ],
    /* POISON */ [ 1,   1,   1,    1,   2,   1,   1,   0.5, 0.5, 1,   1,   1,   0.5, 0.5, 1,   1,   0,   2 ],
    /* GROUND */ [ 1,   2,   1,    2,   0.5, 1,   1,   2,   1,   0,   1,   0.5, 2,   1,   1,   1,   2,   1 ],
    /* FLYING */ [ 1,   1,   1,    0.5, 2,   1,   2,   1,   1,   1,   1,   2,   0.5, 1,   1,   1,   0.5, 1 ],
    /* PSYCHIC */[ 1,   1,   1,    1,   1,   1,   2,   2,   1,   1,   0.5, 1,   1,   1,   1,   0,   0.5, 1 ],
    /* BUG */    [ 1,   0.5, 1,    1,   2,   1,   0.5, 0.5, 1,   0.5, 2,   1,   1,   0.5, 1,   2,   0.5, 0.5 ],
    /* ROCK */   [ 1,   2,   1,    1,   1,   2,   0.5, 1,   0.5, 2,   1,   2,   1,   1,   1,   1,   0.5, 1 ],
    /* GHOST */  [ 0,   1,   1,    1,   1,   1,   1,   1,   1,   1,   2,   1,   1,   2,   1,   0.5, 1,   1 ],
    /* DRAGON */ [ 1,   0.5, 0.5,  0.5, 0.5, 2,   1,   1,   1,   1,   1,   1,   1,   1,   2,   1,   0.5, 0 ],
    /* DARK */   [ 1,   1,   1,    1,   1,   1,   2,   1,   1,   1,   2,   1,   1,   0,   1,   0.5, 1,   0.5 ],
    /* STEEL */  [ 1,   0.5, 0.5,  0.5, 1,   2,   1,   1,   1,   1,   1,   1,   2,   1,   1,   1,   0.5, 0.5 ],
    /* FAIRY */  [ 1,   0.5, 1,    1,   1,   1,   2,   0.5, 1,   1,   1,   1,   1,   1,   2,   2,   0.5, 1 ]
];

const getTypesMultiplayer = (myType : string, oppType: string) => {
    const TYPES = [
        'NORMAL', 'FIRE', 'WATER', 'ELECTRIC', 'GRASS', 'ICE', 'FIGHTING',
        'POISON', 'GROUND', 'FLYING', 'PSYCHIC', 'BUG', 'ROCK', 'GHOST', 'DRAGON', 'DARK', 'STEEL', 'FAIRY'
    ];

    const myIndex = TYPES.indexOf(myType.toUpperCase());
    const opponentIndex = TYPES.indexOf(oppType.toUpperCase());

    // Check if both types are valid
    if (myIndex === -1 || opponentIndex === -1) {
        throw new Error('Invalid types.');
    }

    return typeChart[myIndex][opponentIndex];
};



export const randomPicker = (maxNum : number, minNum: number) => {
    return Math.floor(Math.random() * maxNum) + minNum  //notice - pokemon range [1,386], moves range = [0,movesRng]
}

export const calculateRoundOutcome = (userTotalPower: number, oppTotalPower: number): RoundOutcome => {
    if (userTotalPower > oppTotalPower) {
        return RoundOutcome.Win;
    } else if (userTotalPower < oppTotalPower) {
        return RoundOutcome.Loss;
    } else {
        return RoundOutcome.Draw;
    }
};


/* fetchTeamStats - makes an API call in returns info about 3 random pokemon from a pool of 386  */
export const fetchTeamStats = async (teamSize : number = 3, pokemonPoolSize : number) => {
    try {
        const promiseArr: Promise<PokemonPersonalDetails>[] = [];

        // this makes sure only unique pokemon in team
        const chosenPokemonIDs : number[] = []
        for (let i=0; i<teamSize; i++) {
            let randNum : number

            do {
                randNum = randomPicker(pokemonPoolSize,1)
            } while (chosenPokemonIDs.includes(randNum))

            chosenPokemonIDs.push(randNum)
            promiseArr.push(getMemberInfo(randNum))
        }

        const teamStats = await Promise.allSettled(promiseArr)
        return teamStats
            .filter(teamStats => teamStats.status === "fulfilled")
            .map(teamStats => (teamStats as PromiseFulfilledResult<any>).value)

    } catch (error) {
        console.error('Error fetching Pokémon team stats:', error);
        throw error;
    }
}

export const getMemberInfo = async (pokemonID : number)=> {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonID}/`);
    const memberData = await response.json()
    return await memberData
}

const getMoveObjData = async (moveName : string) => {
    const response = await fetch(`https://pokeapi.co/api/v2/move/${moveName}/`);
    const moveObjData = await response.json();
    // const filteredData = {name: moveObjData.name, power: moveObjData.power}
    // return await {name: moveObjData.name, power: moveObjData.power}
    return await moveObjData
}

export const fetchTeamMovesInfo = async (teamInfo: PokemonPersonalDetails[], filters: string[]) => {
    try {
        const updatedTeamInfo = await Promise.all(teamInfo.map(async (memberInfo) => {
            const  filteredMoves    = memberInfo.filteredMoves as string[]
            const updatedMoves = await Promise.all(filteredMoves.map(async (moveName: string) => {
                const moveObj = await getMoveObjData(moveName);

                // Filter relevant move stats based on the provided filters array
                const filteredMove: { [key: string]: any } = {};
                filters.forEach((prop: string) => {

                    if (prop in moveObj) {
                        // Add the property to the filteredMove object
                        if (moveObj[prop] === null) {
                            moveObj[prop] = 0
                        }
                        filteredMove[prop] = moveObj[prop];
                    }
                });

                return filteredMove;
            }));

            memberInfo.filteredMoves = updatedMoves;
            return memberInfo;
        }));
        return updatedTeamInfo;
    } catch (error) {
        console.error('Error fetching Pokémon team move stats:', error);
        throw error;
    }
};


/**
 * addMovesObject - adds an array of 'numMovesToAdd' random move names to team member info
 * @param numMovesToAdd
 * @param memberInfo
 */
const addMovesObject = (numMovesToAdd: number, memberInfo: PokemonPersonalDetails) => {
    const {moves} = memberInfo
    const numAvailableMoves = moves.length

    if (moves.length < numMovesToAdd) {
        //update to max num moves the pokemon has (i.e. pokemon named 'smearegle')
        numMovesToAdd = moves.length;
    }

    const usedIndecies : number[] = []
    const selectedMoves : string[] = Array(numMovesToAdd).fill('').map(() => {
        let randIndex = randomPicker(numAvailableMoves, 0)

        while (usedIndecies.indexOf(randIndex) !== -1) {
            randIndex = randomPicker(numAvailableMoves, 0)
        }
        usedIndecies.push(randIndex)

        const selectedMove = moves[randIndex]
        return selectedMove.move ? selectedMove.move.name : 'no-move-available'
    })
    return selectedMoves
};



export const filteredTeamInfo = (teamInfo: any[]): any[] => {
    return teamInfo.map((memberInfo, index : number) => {
        const {id, name, weight, height, sprites, types, stats} = memberInfo ?? "N/A";
        const pokemonArtwork = sprites?.other['official-artwork']?.front_default ?? "N/A";
        const primaryType = types[0]?.type?.name ?? "N/A";

        const HP = stats[0]?.base_stat ?? "N/A";
        const attack = stats[1]?.base_stat ?? "N/A";
        const defense = stats[2]?.base_stat ?? "N/A";
        const specialAttack = stats[3]?.base_stat ?? "N/A";
        const specialDefense = stats[4]?.base_stat ?? "N/A";
        const speed = stats[5]?.base_stat ?? "N/A";


        // initial battle stats
        const battleStats = {won: 0, loss: 0}
        const filteredMoves = addMovesObject(4, memberInfo) ?? []

        return {
            index,
            id,
            name,
            primaryType,
            weight,
            height,
            pokemonArtwork,
            HP,
            attack,
            defense,
            specialAttack,
            specialDefense,
            speed,
            battleStats,
            filteredMoves
        };
    });
};
export const getUpperCaseName = (lowerCasedName : string) : string => {
    return lowerCasedName.charAt(0).toUpperCase() + lowerCasedName.slice(1);
}

export const getMoveName = (movesSet: { id: number; name: string; power: number }[], moveID: number): string => {
    const foundMove = movesSet.find(move => move.id === moveID);
    return foundMove ? getUpperCaseName(foundMove.name) : "";
}// Return move name if found, otherwise return empty string


export const randMoveChooser = (movesArray: MovesArray['moves']): MovesArray['moves'][number] | null => {
    // Check if the movesArray is not empty
    if (movesArray && movesArray.length > 0) {

        const randomIndex = randomPicker(movesArray.length, 0);

        return movesArray[randomIndex];
    } else {

        return null; // should never get here
    }
};

/* calcTotalPower - returns the Total power of a pokemnons attack based on the given formula */
export const calcTotalPower = (pokemonStats: PokemonPersonalDetails, rivalStats : PokemonPersonalDetails,  chosenMoveID: number): number => {
    /* function needs:
        1.  MP - PowerValue
        2.  PA - base attack stat
        3.  PD - rival pokemon base defense
        4.  TF - type factor
     */


    const MP = (pokemonStats.filteredMoves as { id: number; name: string; power: number }[])
        .find(m => m.id === chosenMoveID)?.power ?? 0;
    const PA = pokemonStats.attack
    const PD = rivalStats.defense  // opponent defense stat
    const TF = getTypesMultiplayer(pokemonStats.primaryType, rivalStats.primaryType)
    // console.log(`name: ${pokemonStats.name}, MP: ${MP} , PA: ${PA}, PD: ${PD} TF: ${TF} - Total Power: ${(MP + PA) * TF - PD}`)

    return (MP + PA) * TF - PD
};


