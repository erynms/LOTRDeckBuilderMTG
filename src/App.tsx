import { useState, useEffect } from 'react';
import { Card, UserPreferences, Panorama } from './types';
import { fetchLOTRCards } from './api';
import { recommendColors, getCommandersForColors, buildDeck, suggestCards } from './deckBuilder';
import { checkPanoramas } from './panoramas';
import CardGrid from './components/CardGrid';
import CardDetailModal from './components/CardDetailModal';
import PanoramaNotification from './components/PanoramaNotification';
import Questionnaire from './components/Questionnaire';
import ColorSelection from './components/ColorSelection';
import CommanderSelection from './components/CommanderSelection';
import DeckDisplay from './components/DeckDisplay';
import './App.css';

type Step =
  | 'loading'
  | 'card-selection'
  | 'questionnaire'
  | 'color-selection'
  | 'commander-selection'
  | 'deck-display';

function App() {
  const [step, setStep] = useState<Step>('loading');
  const [cards, setCards] = useState<Card[]>([]);
  const [ownedCards, setOwnedCards] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [completedPanoramas, setCompletedPanoramas] = useState<Panorama[]>([]);
  const [showPanoramaNotification, setShowPanoramaNotification] = useState(false);
  const [recommendedColors, setRecommendedColors] = useState<string[]>([]);
  const [availableCommanders, setAvailableCommanders] = useState<Card[]>([]);
  const [selectedCommander, setSelectedCommander] = useState<Card | null>(null);
  const [builtDeck, setBuiltDeck] = useState<Card[]>([]);
  const [cardSuggestions, setCardSuggestions] = useState<any[]>([]);

  useEffect(() => {
    loadCards();
  }, []);

  async function loadCards() {
    try {
      const fetchedCards = await fetchLOTRCards();
      setCards(fetchedCards);
      setStep('card-selection');
    } catch (error) {
      console.error('Failed to load cards:', error);
      alert('Failed to load cards. Please refresh the page.');
    }
  }

  function toggleCardOwnership(cardId: string) {
    const newOwnedCards = new Set(ownedCards);
    if (newOwnedCards.has(cardId)) {
      newOwnedCards.delete(cardId);
    } else {
      newOwnedCards.add(cardId);
    }
    setOwnedCards(newOwnedCards);
  }

  function completeCardSelection() {
    // Check for completed panoramas
    const cardNames = new Set(
      Array.from(ownedCards).map((id) => {
        const card = cards.find((c) => c.id === id);
        return card?.name || '';
      })
    );

    const panoramas = checkPanoramas(cardNames);
    if (panoramas.length > 0) {
      setCompletedPanoramas(panoramas);
      setShowPanoramaNotification(true);
    }

    setStep('questionnaire');
  }

  function handleQuestionnaireComplete(preferences: UserPreferences) {
    const colors = recommendColors(preferences);
    setRecommendedColors(colors);
    setStep('color-selection');
  }

  function handleColorConfirm() {
    const commanders = getCommandersForColors(cards, recommendedColors, ownedCards);
    setAvailableCommanders(commanders);
    setStep('commander-selection');
  }

  function handleRequestDifferentColors() {
    // Simple alternative: rotate colors
    const allColors = ['W', 'U', 'B', 'R', 'G'];
    const unusedColors = allColors.filter((c) => !recommendedColors.includes(c));
    const newColors = [...unusedColors.slice(0, 2), recommendedColors[0]];
    setRecommendedColors(newColors);
  }

  function handleCommanderSelect(commander: Card) {
    setSelectedCommander(commander);
    const deck = buildDeck(commander, cards, ownedCards);
    const suggestions = suggestCards(commander, deck, cards, ownedCards);
    setBuiltDeck(deck);
    setCardSuggestions(suggestions);
    setStep('deck-display');
  }

  function handleGoBackToColors() {
    setStep('color-selection');
  }

  const totalPages = Math.ceil(cards.length / 25);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Lord of the Rings MTG Deck Builder</h1>
        {step === 'card-selection' && (
          <p className="subtitle">
            Select the cards you own from The Lord of the Rings set
          </p>
        )}
      </header>

      <main className="app-main">
        {step === 'loading' && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading cards from Scryfall...</p>
          </div>
        )}

        {step === 'card-selection' && (
          <>
            <CardGrid
              cards={cards}
              ownedCards={ownedCards}
              onToggleOwned={toggleCardOwnership}
              onCardClick={setSelectedCard}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
            <div className="card-selection-footer">
              <p>Selected {ownedCards.size} cards</p>
              <button
                className="btn-primary btn-large"
                onClick={completeCardSelection}
                disabled={ownedCards.size === 0}
              >
                I've Added All My Cards
              </button>
            </div>
          </>
        )}

        {step === 'questionnaire' && (
          <Questionnaire onComplete={handleQuestionnaireComplete} />
        )}

        {step === 'color-selection' && (
          <ColorSelection
            recommendedColors={recommendedColors}
            onConfirm={handleColorConfirm}
            onRequestDifferent={handleRequestDifferentColors}
          />
        )}

        {step === 'commander-selection' && (
          <CommanderSelection
            commanders={availableCommanders}
            onSelect={handleCommanderSelect}
            onGoBack={handleGoBackToColors}
          />
        )}

        {step === 'deck-display' && selectedCommander && (
          <DeckDisplay
            commander={selectedCommander}
            deck={builtDeck}
            suggestions={cardSuggestions}
          />
        )}
      </main>

      {selectedCard && (
        <CardDetailModal card={selectedCard} onClose={() => setSelectedCard(null)} />
      )}

      {showPanoramaNotification && (
        <PanoramaNotification
          panoramas={completedPanoramas}
          onClose={() => setShowPanoramaNotification(false)}
        />
      )}
    </div>
  );
}

export default App;
