import React from "react";
import {PokemonPersonalDetails} from "./types.tsx";
import {Moves} from "./Moves.tsx";
import {Pokemon} from "./Pokemon.tsx";
import './styles.css';

interface BattleUnitProps {
    pokemonDetails: PokemonPersonalDetails;
    onMoveClick?: (moveId: number) => void | undefined;
    allegiance:  'user' |'opp'
}

const click = () => {
    console.log('pokemon was clicked!')
}

/* BattleUnit - serves as a container component in the Battle screen for a chosen pokemon and its moves set */
export const BattleUnit: React.FC<BattleUnitProps> = ({pokemonDetails, onMoveClick, allegiance}) => {

    const movesSet: { id: number; name: string; power: number }[] = pokemonDetails.filteredMoves as { id: number; name: string; power: number }[];
    return (
        <div className='pokemon-moves-card'>
            {allegiance === 'user' ? (
                <>
                    <Moves
                        filteredMoves={movesSet}
                        onMoveClick={onMoveClick}
                        allegiance={allegiance}
                    />
                    <Pokemon
                        pokemonName={pokemonDetails.name}
                        pokemonIndex={pokemonDetails.index}
                        artworkURL={pokemonDetails.pokemonArtwork}
                        onPokemonClick={click}
                        allegiance={allegiance}
                        screenContext="Battle"
                        disabled={undefined}
                    />
                </>
            ) : (
                <>
                    <Pokemon
                        pokemonName={pokemonDetails.name}
                        pokemonIndex={pokemonDetails.index}
                        artworkURL={pokemonDetails.pokemonArtwork}
                        onPokemonClick={click}
                        allegiance={allegiance}
                        screenContext="Battle"
                        disabled={undefined}
                    />
                    <Moves
                        filteredMoves={movesSet}
                        onMoveClick={onMoveClick}
                        allegiance={allegiance}
                    />
                </>
            )}
        </div>
    );
}