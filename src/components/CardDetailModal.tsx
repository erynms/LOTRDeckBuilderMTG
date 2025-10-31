import { Card } from '../types';
import { getCardImage } from '../api';

interface CardDetailModalProps {
  card: Card | null;
  onClose: () => void;
}

export default function CardDetailModal({ card, onClose }: CardDetailModalProps) {
  if (!card) return null;

  const imageUrl = getCardImage(card);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <div className="modal-body">
          <div className="modal-image">
            {imageUrl ? (
              <img src={imageUrl} alt={card.name} />
            ) : (
              <div className="card-placeholder-large">{card.name}</div>
            )}
          </div>

          <div className="modal-details">
            <h2>{card.name}</h2>

            {card.mana_cost && (
              <div className="detail-row">
                <strong>Mana Cost:</strong> {card.mana_cost}
              </div>
            )}

            <div className="detail-row">
              <strong>Type:</strong> {card.type_line}
            </div>

            {card.oracle_text && (
              <div className="detail-row">
                <strong>Text:</strong>
                <p>{card.oracle_text}</p>
              </div>
            )}

            {card.flavor_text && (
              <div className="detail-row flavor-text">
                <em>{card.flavor_text}</em>
              </div>
            )}

            {(card.power || card.toughness) && (
              <div className="detail-row">
                <strong>Power/Toughness:</strong> {card.power}/{card.toughness}
              </div>
            )}

            {card.loyalty && (
              <div className="detail-row">
                <strong>Loyalty:</strong> {card.loyalty}
              </div>
            )}

            <div className="detail-row">
              <strong>Rarity:</strong> {card.rarity}
            </div>

            <div className="detail-row">
              <strong>Collector Number:</strong> {card.collector_number}
            </div>

            {card.artist && (
              <div className="detail-row">
                <strong>Artist:</strong> {card.artist}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
