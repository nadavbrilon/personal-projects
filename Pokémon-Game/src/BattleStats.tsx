import React from "react";
import {PokemonPersonalDetails} from "./types.tsx";
import {Stat} from "./Stat.tsx";
import "./styles.css";

interface SelectedPokemonProps {
    battleStats: PokemonPersonalDetails['battleStats']
}

export const BattleStats: React.FC<SelectedPokemonProps> = ({battleStats}) => {
    const { won, loss } = battleStats;

    const winRatio = (won + loss) === 0 ? 0 : (won / (won + loss)) * 100;

    return (
        <div>
            <h4 className="inner-stat-title">Battle Statistics:</h4>
            <Stat name='Wins' value={battleStats.won} />
            <Stat name='Losses' value={battleStats.loss} />
            <Stat name='Win Rate' value={`${winRatio.toFixed(2)}%`} />
        </div>
    )
}