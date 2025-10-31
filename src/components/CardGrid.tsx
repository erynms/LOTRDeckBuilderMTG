import { Card } from '../types';
import { getCardImage } from '../api';

interface CardGridProps {
  cards: Card[];
  ownedCards: Set<string>;
  onToggleOwned: (cardId: string) => void;
  onCardClick: (card: Card) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function CardGrid({
  cards,
  ownedCards,
  onToggleOwned,
  onCardClick,
  currentPage,
  totalPages,
  onPageChange,
}: CardGridProps) {
  const CARDS_PER_PAGE = 25;
  const startIndex = currentPage * CARDS_PER_PAGE;
  const endIndex = startIndex + CARDS_PER_PAGE;
  const currentCards = cards.slice(startIndex, endIndex);

  return (
    <div className="card-grid-container">
      <div className="card-grid">
        {currentCards.map((card) => {
          const isOwned = ownedCards.has(card.id);
          const imageUrl = getCardImage(card);

          return (
            <div key={card.id} className="card-item">
              <div
                className={`card-wrapper ${isOwned ? 'owned' : ''}`}
                onClick={() => onCardClick(card)}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt={card.name} />
                ) : (
                  <div className="card-placeholder">{card.name}</div>
                )}
                <div className="card-number">#{card.collector_number}</div>
              </div>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isOwned}
                  onChange={(e) => {
                    e.stopPropagation();
                    onToggleOwned(card.id);
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                <span>I own this</span>
              </label>
            </div>
          );
        })}
      </div>

      <div className="pagination">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        <span>
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}
