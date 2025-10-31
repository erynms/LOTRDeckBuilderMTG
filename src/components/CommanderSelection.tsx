import { Card } from '../types';
import { getCardImage } from '../api';

interface CommanderSelectionProps {
  commanders: Card[];
  onSelect: (commander: Card) => void;
  onGoBack: () => void;
}

export default function CommanderSelection({
  commanders,
  onSelect,
  onGoBack,
}: CommanderSelectionProps) {
  if (commanders.length === 0) {
    return (
      <div className="commander-selection">
        <h2>No Commanders Available</h2>
        <p>
          Unfortunately, you don't own any legendary creatures in these colors.
          Please try a different color combination.
        </p>
        <button className="btn-secondary" onClick={onGoBack}>
          Choose Different Colors
        </button>
      </div>
    );
  }

  return (
    <div className="commander-selection">
      <h2>Choose Your Commander</h2>
      <p>Select one of these legendary creatures to lead your deck:</p>

      <div className="commander-grid">
        {commanders.map((commander) => {
          const imageUrl = getCardImage(commander);

          return (
            <div
              key={commander.id}
              className="commander-card"
              onClick={() => onSelect(commander)}
            >
              <div className="commander-image">
                {imageUrl ? (
                  <img src={imageUrl} alt={commander.name} />
                ) : (
                  <div className="card-placeholder">{commander.name}</div>
                )}
              </div>
              <h3>{commander.name}</h3>
              <p className="commander-type">{commander.type_line}</p>
              {commander.oracle_text && (
                <p className="commander-text">{commander.oracle_text.substring(0, 100)}...</p>
              )}
              <button className="btn-primary">Select</button>
            </div>
          );
        })}
      </div>

      <button className="btn-secondary" onClick={onGoBack}>
        Choose Different Colors
      </button>
    </div>
  );
}
