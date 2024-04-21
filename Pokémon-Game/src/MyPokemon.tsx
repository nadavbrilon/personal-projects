import React, {useEffect, useState} from "react";
import {Team} from "./Team.tsx";
import {SelectedPokemon} from "./SelectedPokemon.tsx";
import {TrainerStats} from "./TrainerStats.tsx";
import {PokemonPersonalDetails, trainerStats} from "./types.tsx";
import './styles.css'

interface MyPokemonProps {
    pokemonStats: PokemonPersonalDetails[],
    trainerStats: trainerStats,
    battleClick: () => void;
    handleStartOver: () => void;
}

export const MyPokemon: React.FC<MyPokemonProps> = ({pokemonStats, trainerStats, battleClick, handleStartOver}) => {
    const [selectedPokemon, setSelectedPokemon] = useState(
                                                JSON.parse(localStorage.getItem("selectedPokemon") || "-1"))

    /* UseEffects */
    useEffect(() => {
        // save selectedPokemon state to localStorage whenever it changes (pokemonStats - saved in Game file)
        localStorage.setItem('selectedPokemon', selectedPokemon.toString());
    }, [selectedPokemon])

    const handlePokemonClick = (pokemonIndex : number): void => {
        if (selectedPokemon === pokemonIndex) {
            setSelectedPokemon(-1)
            return
        }
        setSelectedPokemon(pokemonIndex)
    }

    const handleStartOverClick = () => {
        localStorage.clear() // remove everything from localStorage
        handleStartOver()     // fetch new pokemon team
    }

    const handleBattleClick = () => {
        localStorage.removeItem("selectedPokemon"); // refresh in battle - no selected pokemon in MyPokemon.
        battleClick()
    }

    return (
        <div className="screen-container">
            <>
                <header>
                    <button onClick={handleStartOverClick} className="startover-button">Start Over</button>
                    <h1 className="page-title">My Pokemon</h1>
                </header>
                    <div className="my-pokemon">
                        <div className="team-plus-divider">
                            <Team
                                teamInfo={pokemonStats}
                                onPokemonClick={handlePokemonClick}
                                screenContext="MyPokemon"
                                allegiance=""
                                disabled={undefined}
                            />
                            <div className="divider"></div>
                        </div>
                    {selectedPokemon > -1  && <SelectedPokemon pokemonStats={pokemonStats[selectedPokemon]}/>}
                </div>
                <button className="battle-button" onClick={handleBattleClick}>Lets Battle!</button>
                <TrainerStats trainerStats={trainerStats}/>
            </>
        </div>
    );
}