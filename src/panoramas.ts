import { Panorama } from './types';

export const PANORAMAS: Panorama[] = [
  {
    name: 'The Shire',
    cards: [
      'Bag End',
      'Hobbiton',
      'Great Hall of the Citadel',
    ]
  },
  {
    name: 'Mordor',
    cards: [
      'Mount Doom',
      'The Black Gate',
      'Barad-dûr',
    ]
  },
  {
    name: 'Rivendell',
    cards: [
      'Rivendell',
      'The Council of Elrond',
    ]
  }
];

export function checkPanoramas(ownedCards: Set<string>): Panorama[] {
  const completedPanoramas: Panorama[] = [];

  for (const panorama of PANORAMAS) {
    const hasAllCards = panorama.cards.every(cardName => {
      // Check if any owned card has this name
      return Array.from(ownedCards).some(ownedCardId => {
        // We'll need to check by card name
        return ownedCardId.includes(cardName);
      });
    });

    if (hasAllCards) {
      completedPanoramas.push(panorama);
    }
  }

  return completedPanoramas;
}
