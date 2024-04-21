import React from "react";
import './Pokemon.css'
interface PokemonProps {
    artworkURL: string;
    pokemonIndex : number
    pokemonName : string
    screenContext : "MyPokemon" | "Battle"
    onPokemonClick?: (pokemonId: number) => void | undefined;
    allegiance: string | null;
    disabled : {user: number[] , opp: number[]} | undefined
}
export const Pokemon: React.FC<PokemonProps> = (
    {artworkURL, pokemonIndex,pokemonName,screenContext,  onPokemonClick, allegiance , disabled}) => {

    let isDisabled : boolean = false;

    if (disabled !== undefined) {
        if (allegiance == "user") {
            isDisabled = disabled?.user.includes(pokemonIndex)
        }else {
            isDisabled = disabled?.opp.includes(pokemonIndex)
        }
    }


    const handleClick = () => {
        if (!isDisabled && onPokemonClick) {
            onPokemonClick(pokemonIndex)
        }
    }
    return (
        <div
            className={`pokemon-figure-${screenContext}-${allegiance}`}
            // onClick={() => onPokemonClick?.(pokemonIndex)}
            onClick={handleClick}
        >
            <img src={artworkURL} alt=""
            style={{
                cursor: isDisabled ? 'not-allowed' : 'pointer', // Change cursor based on clicked state
                filter: isDisabled ? 'blur(3px)' : 'none', // Apply blur effect based on clicked state
              }}/>
            {(screenContext === "Battle" && allegiance === 'user') && <b>{pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)}</b>}
            {(screenContext === "Battle" && allegiance === 'opp') && <b>{pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)}</b>}
        </div>
    )
}