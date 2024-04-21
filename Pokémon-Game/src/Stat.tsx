import React from "react";
import "./styles.css";

interface StatProps {
    name: string;
    value: string | number;
}

export const Stat: React.FC<StatProps> = ({ name, value }) => {
    return (
        <div className='stat'>
            <p>{name}: {value}</p>
        </div>
    );
};