import { Panorama } from '../types';

interface PanoramaNotificationProps {
  panoramas: Panorama[];
  onClose: () => void;
}

export default function PanoramaNotification({
  panoramas,
  onClose,
}: PanoramaNotificationProps) {
  if (panoramas.length === 0) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content panorama-notification" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <div className="modal-body">
          <h2>Congratulations!</h2>
          <p>You have all the cards needed for the following panorama(s):</p>

          {panoramas.map((panorama, index) => (
            <div key={index} className="panorama-item">
              <h3>{panorama.name}</h3>
              <ul>
                {panorama.cards.map((cardName, cardIndex) => (
                  <li key={cardIndex}>{cardName}</li>
                ))}
              </ul>
            </div>
          ))}

          <button className="btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
