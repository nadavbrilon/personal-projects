import React, {useState} from "react";
import './Pokemon.css'
import './styles.css'
interface MovesProps {
    filteredMoves: {id: number; name: string; power: number}[];
    onMoveClick?: (moveId: number) => void | undefined;
    allegiance: 'opp' | 'user'
}
/* component is given the move object of the selected pokemon */
export const Moves: React.FC<MovesProps> = ({filteredMoves,onMoveClick, allegiance}) => {
    const [moveClicked, setMoveClicked] = useState(false);

    const styles = {
        movesContainer: {
            // marginLeft: '16px',
            // marginBottom: '16px',
            width: '340px',
            height: '148px',
            display: 'grid',
            alignSelf: allegiance === 'user' ?  'flex-end' : 'center',
            gridTemplateColumns: 'repeat(2, 1fr)', // Two columns with equal width
            gridAutoRows: 'minmax(50px, auto)', // Automatic height for rows with minimum 50px height
            gap: '5px', // Gap between moves
            border: '2px solid black',
            borderRadius: '10px',
            overflow: 'auto', // Add scrollbar if moves exceed container height
        },
        movesElement : {
            display: 'inline-block',
            fontSize: '20px',
            fontWeight: '600',
            cursor: allegiance === 'user' ? 'pointer' : 'default',
            transition: 'cursor 0.3s ease', // Smooth transition for cursor change
        }
    };

    const handleClick = (moveId: number) => {
        // Check if a move has already been clicked
        if (onMoveClick && !moveClicked) {
            onMoveClick(moveId);
            setMoveClicked(true); // Set moveClicked to true after the first click
        }
    }

    return (
        <div className="moves-node">
            <div style={styles.movesContainer}>
                {filteredMoves.map(m => (
                    <div
                        className="move-element"
                        key={m.id}
                        style={styles.movesElement}
                        onClick={(() => {handleClick(m.id)})}
                    >
                        {`${m.name.charAt(0).toUpperCase() + m.name.slice(1)} (${m.power})`}
                    </div>
                ))}
            </div>
            <b>Moves</b>
        </div>
    )
}