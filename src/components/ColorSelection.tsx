interface ColorSelectionProps {
  recommendedColors: string[];
  onConfirm: () => void;
  onRequestDifferent: () => void;
}

const COLOR_NAMES: { [key: string]: string } = {
  W: 'White',
  U: 'Blue',
  B: 'Black',
  R: 'Red',
  G: 'Green',
};

export default function ColorSelection({
  recommendedColors,
  onConfirm,
  onRequestDifferent,
}: ColorSelectionProps) {
  return (
    <div className="color-selection">
      <h2>Recommended Colors</h2>
      <p>Based on your preferences, we recommend:</p>

      <div className="color-display">
        {recommendedColors.map((color) => (
          <div key={color} className={`color-badge color-${color.toLowerCase()}`}>
            {COLOR_NAMES[color]}
          </div>
        ))}
      </div>

      <div className="color-actions">
        <button className="btn-primary" onClick={onConfirm}>
          Confirm Colors
        </button>
        <button className="btn-secondary" onClick={onRequestDifferent}>
          Suggest Different Colors
        </button>
      </div>
    </div>
  );
}
