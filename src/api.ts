import { Card } from './types';

const SCRYFALL_API = 'https://api.scryfall.com';

export async function fetchLOTRCards(): Promise<Card[]> {
  try {
    const response = await fetch(
      `${SCRYFALL_API}/cards/search?q=set:ltr&unique=prints&order=set`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch cards');
    }

    const data = await response.json();
    let cards: Card[] = data.data;

    // Handle pagination if there are more cards
    let nextPage = data.next_page;
    while (nextPage) {
      const nextResponse = await fetch(nextPage);
      const nextData = await nextResponse.json();
      cards = [...cards, ...nextData.data];
      nextPage = nextData.next_page;
    }

    // Filter out basic lands but keep special lands
    cards = cards.filter(card => {
      const isBasicLand = card.type_line.includes('Basic Land');
      return !isBasicLand;
    });

    // Sort cards: numbered first, then P cards
    cards.sort((a, b) => {
      const aNum = a.collector_number;
      const bNum = b.collector_number;

      const aIsP = aNum.startsWith('P');
      const bIsP = bNum.startsWith('P');

      if (aIsP && !bIsP) return 1;
      if (!aIsP && bIsP) return -1;

      // Compare numbers
      const aNumeric = parseInt(aNum);
      const bNumeric = parseInt(bNum);

      if (!isNaN(aNumeric) && !isNaN(bNumeric)) {
        return aNumeric - bNumeric;
      }

      // Fallback to string comparison
      return aNum.localeCompare(bNum);
    });

    return cards;
  } catch (error) {
    console.error('Error fetching LOTR cards:', error);
    throw error;
  }
}

export function getCardImage(card: Card): string {
  if (card.image_uris?.normal) {
    return card.image_uris.normal;
  }
  if (card.card_faces?.[0]?.image_uris?.normal) {
    return card.card_faces[0].image_uris.normal;
  }
  return '';
}
