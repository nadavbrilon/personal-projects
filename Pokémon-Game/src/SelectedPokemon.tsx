import React from "react";
import {PokemonPersonalDetails} from './types.tsx'
import {PersonalStats} from "./PersonalStats.tsx";
import {BattleStats} from "./BattleStats.tsx";
import './styles.css'

interface SelectedPokemonProps {
    pokemonStats: PokemonPersonalDetails
}

export const SelectedPokemon: React.FC<SelectedPokemonProps> = ({pokemonStats}) => {
    return(
        <div className="selected-pokemon">

            <PersonalStats pokemonStats={pokemonStats}/>
            <BattleStats battleStats={pokemonStats.battleStats}/>

        </div>
    )
}