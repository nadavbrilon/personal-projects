
import './Game.css'
import {MyPokemon} from "./MyPokemon.tsx";
import React, {useEffect, useState} from "react";
import {fetchTeamStats, filteredTeamInfo, fetchTeamMovesInfo, getMemberInfo} from "./utils.tsx";
import {PokemonPersonalDetails, trainerStats} from "./types.tsx";
import {Battle} from "./Battle.tsx";

/* CONSTANTS DEFINITIONS */
const POKEMON_POOL_SIZE = 386;
const TEAM_SIZE = 3;

const Game: React.FC = () => {
    const [pokemonStats, setPokemonStats] = useState<PokemonPersonalDetails[]>(
                                                    JSON.parse(localStorage.getItem('pokemonStats') || '[]'));

    const [oppTeamStats, setOppTeamStats] = useState<PokemonPersonalDetails[]>([])

    const trainerStatsString = localStorage.getItem('trainerStats');
    const initialTrainerStats: trainerStats = trainerStatsString ? JSON.parse(trainerStatsString) : { trainerWin: 0, trainerLose: 0 };
    const [trainerStats, setTrainerStats] = useState<trainerStats>(initialTrainerStats)

    const [currentPage, setCurrentPage] = useState("MyPokemon")
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchData()
    }, []);

    /* DATA FETCHING FUNCTIONS */
    // fetchData - fetches a team of Pokémon from pokeAPI and filters relevant info.
    const fetchData = async () => {
        try {
            if (!localStorage.getItem('pokemonStats')) {
                console.log('localStorage is empty for pokemons team.....')
            }
            const teamInfo = await fetchTeamStats(TEAM_SIZE, POKEMON_POOL_SIZE)
            console.log(teamInfo)

            /* filter stats  */
            const filteredInfo : PokemonPersonalDetails[] = filteredTeamInfo(teamInfo)
            console.log(filteredInfo)


            /* check if exists a fetched team in local storage */
            if (!localStorage.getItem('pokemonStats')) {
                setPokemonStats(filteredInfo)
                localStorage.setItem('pokemonStats', JSON.stringify(filteredInfo));
            }
            else {
                setPokemonStats(JSON.parse(localStorage.getItem('pokemonStats') as string));
            }
            setLoading(false)


        } catch (error) {
            console.error('Error fetching your PokeTeam:', error);
        }
    }//fetchData

    // this code would run after MyPokemon screen loads
    const fetchOppTeamData = async () => {
        const oppTeamInfo = await fetchTeamStats(TEAM_SIZE, POKEMON_POOL_SIZE)
        const filteredOppInfo = filteredTeamInfo(oppTeamInfo)
        console.log("rival team stats:")
        console.log(filteredOppInfo)
        setOppTeamStats(filteredOppInfo)
    };

    const fetchMovesData = async (teamInfo: PokemonPersonalDetails[]) => {
        // Fetch moves data info for moves array
        await fetchTeamMovesInfo(teamInfo, ['id', 'name', 'power']);
    };

    useEffect(() => {
        // Call the functions from within the useEffect
        if (!loading) {
            fetchOppTeamData(); // would only occur after first loading is done.

            /* check if filteredMoves already updated - if so, no need for additional fetch */
            const pokemonStatsStr = JSON.parse(localStorage.getItem('pokemonStats')as string);

            if (typeof pokemonStatsStr[0].filteredMoves[0] !== 'object'){
                fetchMovesData(pokemonStats); //fetch for user player (only if info not from LS)
            }
        }
    }, [loading]);


    useEffect(() => {
        fetchTeamMovesInfo(oppTeamStats, ['id', 'name', 'power'])
    },[oppTeamStats])


    const handleLetsBattleClick = () : void => {
        setCurrentPage("Battle")
    }


    /* STATE UPDATER FUNCTIONS - BATTLE COMPONENT */
    const updatePokemonStats = (updatedStats: PokemonPersonalDetails[]) => {
        console.log('POKEMON STATS HAVE BEEN UPDATED (also in local storage)')

        /* update pokemon stats in local storage */
        localStorage.removeItem('pokemonStats');
        localStorage.setItem('pokemonStats', JSON.stringify(updatedStats));

        setPokemonStats(updatedStats);

    };

    const updateTrainerStats = (updatedTrainerStats: trainerStats) => {

        console.log('TRAINER STATS HAVE BEEN UPDATED')

        /* update pokemon stats in local storage */
        localStorage.removeItem('trainerStats');
        localStorage.setItem('trainerStats', JSON.stringify(updatedTrainerStats));

        setTrainerStats(updatedTrainerStats)

        // update new moves todo
        // pokemonStats.map(async pokemon => {
        //     const pokeID = pokemon.id
        //     const pokeInfo =  await getMemberInfo(pokeID)
        //
        //
        //     if (pokemon.filteredMoves !== undefined) {
        //         // @ts-ignore
        //         delete pokemon.filteredMoves;
        //     }
        //     pokemon['moves']= pokeInfo.moves
        // })
        // console.log('new pokemon info - with moves')
        // console.log(pokemonStats)
        // fetchMovesData(pokemonStats)

        // update screen back to MyPokemon
        setCurrentPage('MyPokemon')
        fetchOppTeamData()
    };

    const handleStartOver = () => {
        console.log('executing start over...')
        setLoading(true)
        fetchData() // fetch new pokemon team and stats

        // reset trainer stats
        trainerStats.trainerLose = 0
        trainerStats.trainerWin = 0

    }

    return (
        <div>
            {/* removed strict mode */}
            {loading ? <p>loading...</p> : (
                currentPage === 'MyPokemon' ?
                    <MyPokemon
                        pokemonStats={pokemonStats}
                        trainerStats={trainerStats}
                        battleClick = {handleLetsBattleClick}
                        handleStartOver={handleStartOver}
                    /> :
                    <Battle
                        pokemonStats={pokemonStats}
                        oppTeamStats={oppTeamStats}
                        trainerStats={trainerStats}
                        updatePokemonStats={updatePokemonStats}
                        updateTrainerStats={updateTrainerStats}
                    />
            )}
        </div>
    );
};

export default Game


