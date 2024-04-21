import React from "react";
import {PokemonPersonalDetails} from "./types.tsx";
import {calcTotalPower, getMoveName} from "./utils.tsx";
import './styles.css' 

//styles.css is the way to go now

interface PowerBubbleProps {
    userPokemonStats: PokemonPersonalDetails,
    oppPokemonStats: PokemonPersonalDetails,
    userMoveID : number,
    oppMoveID : number,

}

export const TotalPowerBubble: React.FC<PowerBubbleProps> = ({userPokemonStats, oppPokemonStats, oppMoveID, userMoveID}) => {

    const userTotalPower = calcTotalPower(userPokemonStats, oppPokemonStats, userMoveID)
    const oppTotalPower = calcTotalPower(oppPokemonStats, userPokemonStats, oppMoveID)

    const userMoveName = getMoveName(userPokemonStats.filteredMoves as {
                                                                id: number; name: string; power: number }[], userMoveID)

    const oppMoveName = getMoveName(oppPokemonStats.filteredMoves as {
                                                                id: number; name: string; power: number }[], oppMoveID)
    return (
        <div className='total-power-bubble'>
            <h2>Total Power</h2>
            <h3>{oppMoveName} &gt;&gt;&gt;  {oppTotalPower}</h3>
            <h4>VS.</h4>
            <h3>{userMoveName} &gt;&gt;&gt;  {userTotalPower}</h3>
        </div>
    )
}