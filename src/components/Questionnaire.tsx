import { useState } from 'react';
import { UserPreferences } from '../types';

interface QuestionnaireProps {
  onComplete: (preferences: UserPreferences) => void;
}

export default function Questionnaire({ onComplete }: QuestionnaireProps) {
  const [preferences, setPreferences] = useState<UserPreferences>({
    playStyle: '',
    winCondition: '',
    tempo: '',
    favoriteCard: '',
    favoriteCharacter: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(preferences);
  };

  const updatePreference = (key: keyof UserPreferences, value: string) => {
    setPreferences({ ...preferences, [key]: value });
  };

  const isValid = Object.values(preferences).every((val) => val.trim().length > 0);

  return (
    <div className="questionnaire">
      <h2>Tell Us About Your Play Style</h2>
      <p>Answer these questions to help us recommend the perfect deck for you!</p>

      <form onSubmit={handleSubmit}>
        <div className="question">
          <label>
            1. How would you describe your preferred play style? (Max 50 words)
          </label>
          <textarea
            value={preferences.playStyle}
            onChange={(e) => updatePreference('playStyle', e.target.value)}
            placeholder="e.g., I like aggressive strategies with lots of creatures attacking early..."
            maxLength={300}
            rows={3}
            required
          />
          <span className="char-count">
            {preferences.playStyle?.length || 0}/300 characters
          </span>
        </div>

        <div className="question">
          <label>
            2. What is your ideal win condition? (Max 50 words)
          </label>
          <textarea
            value={preferences.winCondition}
            onChange={(e) => updatePreference('winCondition', e.target.value)}
            placeholder="e.g., I love winning through combat damage with a massive board presence..."
            maxLength={300}
            rows={3}
            required
          />
          <span className="char-count">
            {preferences.winCondition?.length || 0}/300 characters
          </span>
        </div>

        <div className="question">
          <label>
            3. Do you prefer early game pressure or late game power? (Max 30 words)
          </label>
          <textarea
            value={preferences.tempo}
            onChange={(e) => updatePreference('tempo', e.target.value)}
            placeholder="e.g., I like to build up slowly and dominate in the late game..."
            maxLength={200}
            rows={2}
            required
          />
          <span className="char-count">
            {preferences.tempo?.length || 0}/200 characters
          </span>
        </div>

        <div className="question">
          <label>
            4. What is your favorite card from your collection? (Max 30 words)
          </label>
          <textarea
            value={preferences.favoriteCard}
            onChange={(e) => updatePreference('favoriteCard', e.target.value)}
            placeholder="e.g., The One Ring - I love its powerful protection ability..."
            maxLength={200}
            rows={2}
            required
          />
          <span className="char-count">
            {preferences.favoriteCard?.length || 0}/200 characters
          </span>
        </div>

        <div className="question">
          <label>
            5. Who is your favorite character from The Lord of the Rings? (Max 30 words)
          </label>
          <textarea
            value={preferences.favoriteCharacter}
            onChange={(e) => updatePreference('favoriteCharacter', e.target.value)}
            placeholder="e.g., Gandalf - I admire his wisdom and powerful magic..."
            maxLength={200}
            rows={2}
            required
          />
          <span className="char-count">
            {preferences.favoriteCharacter?.length || 0}/200 characters
          </span>
        </div>

        <button type="submit" className="btn-primary" disabled={!isValid}>
          Get Recommendations
        </button>
      </form>
    </div>
  );
}
