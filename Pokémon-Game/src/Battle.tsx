import React, {useEffect, useState} from "react";
import {PlayedPokemon, PokemonPersonalDetails, RoundOutcome, Scoreboard, trainerStats} from './types.tsx'
import {Team} from "./Team.tsx";
import {TotalPowerBubble} from "./TotalPowerBubble.tsx";
import {BattleUnit} from "./BattleUnit.tsx";
import './styles.css';

import {
    calcTotalPower,
    calculateRoundOutcome,
    getMoveName,
    getUpperCaseName,
    randMoveChooser,
    randomPicker
} from "./utils.tsx";


interface MyBattleProps {
    pokemonStats: PokemonPersonalDetails[],
    oppTeamStats: PokemonPersonalDetails[],
    trainerStats: trainerStats,
    updatePokemonStats: (updatedStats: PokemonPersonalDetails[]) => void;
    updateTrainerStats: (updatedStats: trainerStats) => void;
}

 /* CONSTANTS DEFINITIONS */
const TIMEOUT = 4000;

export const Battle: React.FC<MyBattleProps> =
    ({pokemonStats, oppTeamStats, trainerStats, updatePokemonStats, updateTrainerStats}) => {

        /* ROUND HANDLING STATES */
        const [userSelectedPokemon, setUserSelectedPokemon] = useState(-1)
        const [userSelectedMove, setUserSelectedMove] = useState(-1)
        const [oppSelectedPokemon, setOppSelectedPokemon] = useState(-1)
        const [oppSelectedMove, setOppSelectedMove] = useState(-1)

        /* BATTLE HANDLING STATES */
        const [playedPokemon, setPlayedPokemon] = useState<PlayedPokemon>({user: [], opponent: []})
        const [isRoundFinished, setIsRoundFinished] = useState(false)
        const [isBattleFinished, setIsBattleFinished] = useState(false)
        const [roundOutcome, setRoundOutcome] = useState<RoundOutcome | null>(null);
        const [battleOutcome, setBattleOutcome] = useState<RoundOutcome | null>(null);
        const [scoreboard, setScoreboard] = useState<Scoreboard>({userWin:[], oppWin:[]})

        /* TIME HANDLING STATES */
        const [showTotalPowerBubble, setShowTotalPowerBubble] = useState(false); // State to manage visibility
        const [showSummaryMsg, setShowSummaryMsg] = useState(false); // State to manage visibility


        let userTotalPower : number = 0
        let oppTotalPower : number = 0

        /* OPPONENT TURN SEQUENCE - this will fire after user has selected its move  */
        useEffect(() => {
            if (userSelectedMove !== -1) {

                // opponent choose random pokemon
                let oppPokemon : number

                do {
                    oppPokemon  = randomPicker(pokemonStats.length,0)
                }while (playedPokemon.opponent.includes(oppPokemon))

                setOppSelectedPokemon(oppPokemon)

                // opponent choose random move
                const oppMove = randMoveChooser(oppTeamStats[oppPokemon].filteredMoves as
                    { id: number; name: string; power: number; }[]);

                setOppSelectedMove(oppMove? oppMove.id : -1)
            }
        }, [userSelectedMove])

        /* OUTCOME ANALYZER - this will fire after opponent has selected its move  */
        useEffect(() => {
            if (oppSelectedMove !== -1 && userSelectedMove !== -1) {
                // calculate totalPower for user and opp
                handleRoundOutcome()

            }
        }, [oppSelectedMove, userSelectedMove])

        /* UTILITY FUNCTIONS  */
        const handleRoundOutcome = () => {

            // Calculate total power for user and opp
            userTotalPower = calcTotalPower(pokemonStats[userSelectedPokemon], oppTeamStats[oppSelectedPokemon], userSelectedMove);
            oppTotalPower = calcTotalPower(oppTeamStats[oppSelectedPokemon], pokemonStats[userSelectedPokemon], oppSelectedMove);

            // calculate round / battle winner
            let roundResult = calculateRoundOutcome(userTotalPower, oppTotalPower)
            if (roundResult === RoundOutcome.Draw) {roundResult = RoundOutcome.Win} // in case of tie - user wins
            setIsRoundFinished(true)
            setRoundOutcome(roundResult)
            updateScoreboard(roundResult) // update scoreboard

            setShowTotalPowerBubble(true)

            // from here the useEffect will handle the msg rendering (to avoid race conditions)

        };//handleRoundOutcome

        useEffect(() => {
            if (isRoundFinished && showTotalPowerBubble)
            {
                const totalPowerTimeout = setTimeout(() => {
                    setShowTotalPowerBubble(false)
                    setShowSummaryMsg(true)
                }, TIMEOUT)

                totalPowerTimeout
            }
        }, [showTotalPowerBubble])

        useEffect(() => {
            if (isRoundFinished && showSummaryMsg)
            {
                const summaryMsgTimeout = setTimeout(() => {

                    setShowSummaryMsg(false)

                    /* SET NEXT ROUND */
                    setNextRound()

                }, TIMEOUT)

                summaryMsgTimeout
            }
        }, [showSummaryMsg])

        /* BATTLE FINISHED HANDLING */
        useEffect(() => {
            if (isBattleFinished) {
                handleTrainerStatUpdate()

            }
        }, [isBattleFinished])

        const setNextRound = () => {
            // check if battle is over
            if (scoreboard['userWin'].length >= 2 || scoreboard['oppWin'].length >= 2) {
                const battleResult = calculateRoundOutcome(scoreboard.userWin.length, scoreboard.oppWin.length)
                setBattleOutcome(battleResult);
                setIsBattleFinished(true)
            }

            // update played Pokémon state (index)
            updatePlayedPokemon(userSelectedPokemon, oppSelectedPokemon);

            // update pokemon win / lose stats
            handlePokemonStatUpdate (userSelectedPokemon)


            // reset states
            console.log('resetting states now...')
            setUserSelectedPokemon(-1)
            setUserSelectedMove(-1)
            setOppSelectedPokemon(-1)
            setOppSelectedMove(-1)
            setRoundOutcome(null)
            setIsRoundFinished(false)
        }

        /* STATE UPDATER FUNCTIONS */
        const updateScoreboard = (roundResult: RoundOutcome) => {

            // copy of the scoreboard state
            const updatedScoreboard = { ...scoreboard };

            if (roundResult === RoundOutcome.Win) {
                updatedScoreboard.userWin.push(1);
            } else if (roundResult === RoundOutcome.Loss) {
                updatedScoreboard.oppWin.push(1);
            }

            setScoreboard(updatedScoreboard);

        };//updateScoreboard

        const updatePlayedPokemon = (userIndex: number, opponentIndex: number) => {

            const updatedPlayedPokemon = { ...playedPokemon };

            updatedPlayedPokemon.user.push(userIndex); // adds index

            updatedPlayedPokemon.opponent.push(opponentIndex); // adds index

            setPlayedPokemon(updatedPlayedPokemon);

        };//updatePlayedPokemon

        /* GAME CALLBACK STATE UPDATERS */
        // handlePokemonStatUpdate - function updates pokemon win/lose stat after each round
        const handlePokemonStatUpdate = (userPokemon : number) => {

            const updatedStats = [...pokemonStats];

            if (roundOutcome === RoundOutcome.Win) {
                updatedStats[userPokemon].battleStats.won++
            } else if (roundOutcome === RoundOutcome.Loss) {
                updatedStats[userPokemon].battleStats.loss++
            }

            // this updates in Game component
            updatePokemonStats(updatedStats);
        };//handlePokemonStatUpdate

        const handleTrainerStatUpdate = () => {
            setTimeout(() => {
                battleOutcome === RoundOutcome.Win ? trainerStats.trainerWin++ : trainerStats.trainerLose++;
                updateTrainerStats(trainerStats);
            }, TIMEOUT);
        }

        /* CLICK FUNCTION HANDLERS */
        const handlePokemonClick = (pokemonIndex : number): void => {
            setUserSelectedPokemon(pokemonIndex)
        }

        const handleMoveClick = (moveID: number) => {
            const moveName  = getMoveName(pokemonStats[userSelectedPokemon].filteredMoves as {
                                                                    id: number; name: string; power: number }[], moveID)
            alert(`${getUpperCaseName(pokemonStats[userSelectedPokemon].name)} use ${moveName} !`)
            setUserSelectedMove(moveID)
        }


        return(
            <div className='screen-container'>
                <header>
                    <h1 className="page-title">Battle</h1>
                </header>
                <div className="battle-screen-container">
                    <div className="opp-container">
                        {oppSelectedPokemon === -1 ?
                            (<Team
                                teamInfo={oppTeamStats}
                                screenContext="Battle"
                                allegiance="opp"
                                disabled={{user: playedPokemon.user, opp: playedPokemon.opponent}}
                            />)
                            :
                            (<BattleUnit pokemonDetails={oppTeamStats[oppSelectedPokemon]} allegiance='opp'/>)
                        }
                    </div>

                    {userSelectedPokemon === -1 && !isBattleFinished?
                        (<div className='screen-msg-container'>
                            <h2>Select your Pokemon</h2>
                        </div>)
                        :
                        (userSelectedPokemon !== -1 && userSelectedMove === -1 && !isBattleFinished?
                                (<div className='screen-msg-container'>
                                    <h2>Select your pokemon's move</h2>
                                </div>)
                                :

                                <div className='screen-msg-container'>
                                    {showTotalPowerBubble &&
                                        (<TotalPowerBubble
                                            userPokemonStats={pokemonStats[userSelectedPokemon]}
                                            oppPokemonStats={oppTeamStats[oppSelectedPokemon]}
                                            userMoveID={userSelectedMove}
                                            oppMoveID={oppSelectedMove}/>)
                                    }
                                    {((showSummaryMsg && !isBattleFinished) && <h2>Your Pokemon {roundOutcome}</h2>)}
                                    {(isBattleFinished) &&
                                        (battleOutcome === RoundOutcome.Win ? <h2>You Win ! 🥇</h2> : <h2>You Lose ! 😔</h2>)}
                                </div>
                        )
                    }


                    <div className="usr-container">
                        {userSelectedPokemon === -1 ?
                            (<Team
                                teamInfo={pokemonStats}
                                onPokemonClick={handlePokemonClick}
                                screenContext="Battle"
                                allegiance="user"
                                disabled={{user: playedPokemon.user, opp: playedPokemon.opponent}}
                            />)
                            :
                            (<BattleUnit pokemonDetails={pokemonStats[userSelectedPokemon]} onMoveClick={handleMoveClick} allegiance='user'/>)
                        }
                    </div>
                </div>
            </div>
        )
    }

