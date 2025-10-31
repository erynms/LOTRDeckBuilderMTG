import { Card, CardSuggestion } from '../types';
import { getCardImage } from '../api';

interface DeckDisplayProps {
  commander: Card;
  deck: Card[];
  suggestions: CardSuggestion[];
}

export default function DeckDisplay({ commander, deck, suggestions }: DeckDisplayProps) {
  const commanderImage = getCardImage(commander);

  // Categorize deck
  const lands = deck.filter((c) => c.type_line.includes('Land'));
  const creatures = deck.filter(
    (c) => c.type_line.includes('Creature') && !c.type_line.includes('Land')
  );
  const instants = deck.filter((c) => c.type_line.includes('Instant'));
  const sorceries = deck.filter((c) => c.type_line.includes('Sorcery'));
  const artifacts = deck.filter(
    (c) => c.type_line.includes('Artifact') && !c.type_line.includes('Creature')
  );
  const enchantments = deck.filter((c) => c.type_line.includes('Enchantment'));
  const planeswalkers = deck.filter((c) => c.type_line.includes('Planeswalker'));
  const others = deck.filter(
    (c) =>
      !lands.includes(c) &&
      !creatures.includes(c) &&
      !instants.includes(c) &&
      !sorceries.includes(c) &&
      !artifacts.includes(c) &&
      !enchantments.includes(c) &&
      !planeswalkers.includes(c)
  );

  return (
    <div className="deck-display">
      <h2>Your Deck is Ready!</h2>

      <div className="commander-section">
        <h3>Commander</h3>
        <div className="commander-display">
          {commanderImage && <img src={commanderImage} alt={commander.name} />}
          <div>
            <h4>{commander.name}</h4>
            <p>{commander.type_line}</p>
          </div>
        </div>
      </div>

      <div className="deck-stats">
        <h3>Deck Composition ({deck.length + 1} cards total)</h3>
        <ul>
          <li>Lands: {lands.length}</li>
          <li>Creatures: {creatures.length}</li>
          <li>Instants: {instants.length}</li>
          <li>Sorceries: {sorceries.length}</li>
          <li>Artifacts: {artifacts.length}</li>
          <li>Enchantments: {enchantments.length}</li>
          {planeswalkers.length > 0 && <li>Planeswalkers: {planeswalkers.length}</li>}
          {others.length > 0 && <li>Other: {others.length}</li>}
        </ul>
      </div>

      <div className="deck-list">
        <h3>Deck List</h3>
        <div className="card-categories">
          {creatures.length > 0 && (
            <div className="category">
              <h4>Creatures ({creatures.length})</h4>
              <ul>
                {creatures.map((card) => (
                  <li key={card.id}>
                    {card.name} {card.mana_cost}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {lands.length > 0 && (
            <div className="category">
              <h4>Lands ({lands.length})</h4>
              <ul>
                {lands.map((card) => (
                  <li key={card.id}>{card.name}</li>
                ))}
              </ul>
            </div>
          )}

          {instants.length > 0 && (
            <div className="category">
              <h4>Instants ({instants.length})</h4>
              <ul>
                {instants.map((card) => (
                  <li key={card.id}>
                    {card.name} {card.mana_cost}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {sorceries.length > 0 && (
            <div className="category">
              <h4>Sorceries ({sorceries.length})</h4>
              <ul>
                {sorceries.map((card) => (
                  <li key={card.id}>
                    {card.name} {card.mana_cost}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {artifacts.length > 0 && (
            <div className="category">
              <h4>Artifacts ({artifacts.length})</h4>
              <ul>
                {artifacts.map((card) => (
                  <li key={card.id}>
                    {card.name} {card.mana_cost}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {enchantments.length > 0 && (
            <div className="category">
              <h4>Enchantments ({enchantments.length})</h4>
              <ul>
                {enchantments.map((card) => (
                  <li key={card.id}>
                    {card.name} {card.mana_cost}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {planeswalkers.length > 0 && (
            <div className="category">
              <h4>Planeswalkers ({planeswalkers.length})</h4>
              <ul>
                {planeswalkers.map((card) => (
                  <li key={card.id}>
                    {card.name} {card.mana_cost}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="suggestions">
        <h3>Recommended Cards to Acquire</h3>
        <p>Here are 5 cards that would improve your deck:</p>

        <div className="suggestions-list">
          {suggestions.map((suggestion, index) => {
            const suggestionImage = getCardImage(suggestion.card);

            return (
              <div key={suggestion.card.id} className="suggestion-item">
                <div className="suggestion-number">{index + 1}</div>
                <div className="suggestion-image">
                  {suggestionImage && (
                    <img src={suggestionImage} alt={suggestion.card.name} />
                  )}
                </div>
                <div className="suggestion-details">
                  <h4>{suggestion.card.name}</h4>
                  <p className="suggestion-reason">{suggestion.reason}</p>
                  {suggestion.replaces && (
                    <p className="suggestion-replace">
                      Consider replacing: {suggestion.replaces.name}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
