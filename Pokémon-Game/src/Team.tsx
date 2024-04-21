import React from "react";
import {Pokemon} from "./Pokemon.tsx";
import {PokemonPersonalDetails} from "./types.tsx";
import './styles.css'

interface TeamProps {
    teamInfo: PokemonPersonalDetails[];
    onPokemonClick?: (pokemonId: number) => void | undefined;
    screenContext: 'MyPokemon' | 'Battle';
    allegiance : string | null;
    disabled : {user: number[] , opp: number[]} | undefined
}

export const Team: React.FC<TeamProps> = (
    {teamInfo, onPokemonClick, screenContext, allegiance, disabled}) => {
    return (
        <div
            className={screenContext === "MyPokemon" ? 'my-pokemon-style' : 'battle-style'}
        >
            {teamInfo.map((pokemon) => (
                <Pokemon
                    key={pokemon.id}
                    pokemonIndex={pokemon.index}
                    artworkURL={pokemon.pokemonArtwork}
                    pokemonName={pokemon.name}
                    screenContext={screenContext}
                    onPokemonClick={onPokemonClick}
                    allegiance={allegiance}
                    disabled={disabled}
                />
            ))}
        </div>
    )
}

