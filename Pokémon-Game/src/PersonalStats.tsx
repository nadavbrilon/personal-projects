import React from "react";
import {PokemonPersonalDetails} from "./types.tsx";
import {Stat} from "./Stat.tsx";
import "./styles.css";

interface SelectedPokemonProps {
    pokemonStats: PokemonPersonalDetails
}

export const PersonalStats: React.FC<SelectedPokemonProps> = ({pokemonStats}) => {
    return (
        <div>
            <h2 className="pokemon-name">{pokemonStats.name.charAt(0).toUpperCase() + pokemonStats.name.slice(1)}</h2>
            <Stat name='Type' value={pokemonStats.primaryType} />
            <Stat name='Weight' value={`${pokemonStats.weight} Kg`} />
            <Stat name='Height' value={`${pokemonStats.height} m`} />
            <h4 className="inner-stat-title">Additional Stats:</h4>
            <Stat name='HP' value={pokemonStats.HP} />
            <Stat name='Attack' value={pokemonStats.attack} />
            <Stat name='Defense' value={pokemonStats.defense} />
            <Stat name='Special Attack' value={pokemonStats.specialAttack} />
            <Stat name='Special Defense' value={pokemonStats.specialDefense} />
            <Stat name='Speed' value={pokemonStats.speed} />
        </div>
    )
}