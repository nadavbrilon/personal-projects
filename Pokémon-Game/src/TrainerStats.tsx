import React from "react";
import {trainerStats} from "./types.tsx";
import './styles.css'

interface TrainerStatsProps {
    trainerStats: trainerStats
}

export const TrainerStats: React.FC<TrainerStatsProps> = ({trainerStats}) => {

    const {trainerWin, trainerLose} = trainerStats
    const winRatio = (trainerWin + trainerLose) === 0 ? 0 : Math.round((trainerWin / (trainerWin + trainerLose)) * 100);

    return (
        <div className="trainer-stats-container">
            <div className="user-stats">You won {trainerWin} out of {trainerWin + trainerLose} battles</div>
            <div className="user-percentage">{winRatio}%</div>
        </div>
    )
}