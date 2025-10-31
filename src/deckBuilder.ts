import { Card, UserPreferences, CardSuggestion } from './types';

export function recommendColors(preferences: UserPreferences): string[] {
  const colorScores: { [key: string]: number } = {
    W: 0, // White
    U: 0, // Blue
    B: 0, // Black
    R: 0, // Red
    G: 0, // Green
  };

  // Analyze play style
  if (preferences.playStyle) {
    const style = preferences.playStyle.toLowerCase();
    if (style.includes('aggro') || style.includes('fast') || style.includes('attack')) {
      colorScores.R += 3;
      colorScores.W += 2;
    }
    if (style.includes('control') || style.includes('counter') || style.includes('spell')) {
      colorScores.U += 3;
      colorScores.W += 2;
    }
    if (style.includes('combo') || style.includes('synergy')) {
      colorScores.U += 2;
      colorScores.G += 2;
    }
    if (style.includes('ramp') || style.includes('big') || style.includes('creature')) {
      colorScores.G += 3;
      colorScores.R += 1;
    }
  }

  // Analyze win condition
  if (preferences.winCondition) {
    const win = preferences.winCondition.toLowerCase();
    if (win.includes('damage') || win.includes('combat')) {
      colorScores.R += 2;
      colorScores.G += 2;
    }
    if (win.includes('mill') || win.includes('deck')) {
      colorScores.U += 3;
      colorScores.B += 2;
    }
    if (win.includes('token') || win.includes('wide')) {
      colorScores.W += 2;
      colorScores.G += 2;
    }
    if (win.includes('sacrifice') || win.includes('drain')) {
      colorScores.B += 3;
    }
  }

  // Analyze tempo
  if (preferences.tempo) {
    const tempo = preferences.tempo.toLowerCase();
    if (tempo.includes('fast') || tempo.includes('early')) {
      colorScores.R += 2;
      colorScores.W += 1;
    }
    if (tempo.includes('slow') || tempo.includes('late')) {
      colorScores.U += 2;
      colorScores.G += 2;
    }
  }

  // Favorite character influences
  if (preferences.favoriteCharacter) {
    const char = preferences.favoriteCharacter.toLowerCase();
    if (char.includes('gandalf')) {
      colorScores.U += 2;
      colorScores.W += 2;
    }
    if (char.includes('aragorn')) {
      colorScores.W += 2;
      colorScores.G += 2;
    }
    if (char.includes('legolas')) {
      colorScores.G += 2;
      colorScores.W += 1;
    }
    if (char.includes('gimli')) {
      colorScores.R += 2;
      colorScores.W += 1;
    }
    if (char.includes('frodo') || char.includes('sam')) {
      colorScores.W += 2;
      colorScores.G += 1;
    }
    if (char.includes('gollum') || char.includes('smeagol')) {
      colorScores.B += 2;
      colorScores.U += 1;
    }
    if (char.includes('sauron')) {
      colorScores.B += 3;
      colorScores.R += 2;
    }
    if (char.includes('saruman')) {
      colorScores.U += 2;
      colorScores.B += 2;
    }
  }

  // Sort colors by score and pick top 2-3
  const sortedColors = Object.entries(colorScores)
    .sort((a, b) => b[1] - a[1])
    .map(([color]) => color);

  // Return 2-3 colors based on scores
  const topScore = colorScores[sortedColors[0]];
  const secondScore = colorScores[sortedColors[1]];
  const thirdScore = colorScores[sortedColors[2]];

  if (thirdScore >= topScore * 0.7) {
    return sortedColors.slice(0, 3);
  } else if (secondScore >= topScore * 0.6) {
    return sortedColors.slice(0, 2);
  } else {
    return sortedColors.slice(0, 1);
  }
}

export function getCommandersForColors(
  cards: Card[],
  colors: string[],
  ownedCards: Set<string>
): Card[] {
  const commanders = cards.filter(card => {
    // Must be owned
    if (!ownedCards.has(card.id)) return false;

    // Must be legendary creature
    const isLegendary = card.type_line.includes('Legendary');
    const isCreature = card.type_line.includes('Creature');

    if (!isLegendary || !isCreature) return false;

    // Check color identity matches
    const cardColors = card.color_identity;

    // Card must use only the selected colors
    const usesOnlySelectedColors = cardColors.every(c => colors.includes(c));

    // Card should use at least one of the selected colors (unless colorless deck)
    const usesAtLeastOneColor = colors.length === 0 || cardColors.some(c => colors.includes(c));

    return usesOnlySelectedColors && usesAtLeastOneColor;
  });

  // Sort by CMC and return top options
  commanders.sort((a, b) => {
    // Prefer commanders that use more of the selected colors
    const aColorCount = a.color_identity.length;
    const bColorCount = b.color_identity.length;
    if (aColorCount !== bColorCount) {
      return bColorCount - aColorCount;
    }
    return a.cmc - b.cmc;
  });

  return commanders.slice(0, 3);
}

export function buildDeck(
  commander: Card,
  allCards: Card[],
  ownedCards: Set<string>
): Card[] {
  const deck: Card[] = [];
  const commanderColors = commander.color_identity;

  // Filter cards that match commander's color identity and are owned
  const eligibleCards = allCards.filter(card => {
    if (!ownedCards.has(card.id)) return false;
    if (card.id === commander.id) return false;

    // Check color identity
    const cardColors = card.color_identity;
    const matchesColorIdentity = cardColors.every(c => commanderColors.includes(c));

    // Skip basic lands (already filtered) but keep special lands
    return matchesColorIdentity;
  });

  // Categorize cards
  const lands = eligibleCards.filter(c => c.type_line.includes('Land'));
  const creatures = eligibleCards.filter(c => c.type_line.includes('Creature') && !c.type_line.includes('Land'));
  const instants = eligibleCards.filter(c => c.type_line.includes('Instant'));
  const sorceries = eligibleCards.filter(c => c.type_line.includes('Sorcery'));
  const artifacts = eligibleCards.filter(c => c.type_line.includes('Artifact') && !c.type_line.includes('Creature'));
  const enchantments = eligibleCards.filter(c => c.type_line.includes('Enchantment'));
  const planeswalkers = eligibleCards.filter(c => c.type_line.includes('Planeswalker'));

  // Build deck with proper ratios (Commander deck is 100 cards including commander)
  // Aim for: ~37 lands, ~30 creatures, ~10 instants, ~10 sorceries, rest artifacts/enchantments

  // Add lands (aim for 36 since commander counts as 1 of 100)
  const landCount = Math.min(36, lands.length);
  deck.push(...lands.slice(0, landCount));

  // Add creatures
  const creatureCount = Math.min(30, creatures.length);
  deck.push(...creatures.slice(0, creatureCount));

  // Fill remaining slots
  let remaining = 99 - deck.length; // 99 because commander is separate

  const remainingCards = [
    ...instants,
    ...sorceries,
    ...artifacts,
    ...enchantments,
    ...planeswalkers,
  ].sort((a, b) => b.cmc - a.cmc);

  deck.push(...remainingCards.slice(0, remaining));

  return deck;
}

export function suggestCards(
  commander: Card,
  currentDeck: Card[],
  allCards: Card[],
  ownedCards: Set<string>
): CardSuggestion[] {
  const suggestions: CardSuggestion[] = [];
  const commanderColors = commander.color_identity;

  // Filter unowned cards that match color identity
  const unownedEligible = allCards.filter(card => {
    if (ownedCards.has(card.id)) return false;
    const cardColors = card.color_identity;
    return cardColors.every(c => commanderColors.includes(c));
  });

  // Look for powerful staples
  const staples = unownedEligible.filter(card => {
    const name = card.name.toLowerCase();
    // Common LOTR staples
    return (
      name.includes('the one ring') ||
      name.includes('palantir') ||
      name.includes('aragorn') ||
      name.includes('gandalf') ||
      card.rarity === 'mythic'
    );
  });

  // Suggest powerful cards
  staples.slice(0, 5).forEach(card => {
    suggestions.push({
      card,
      reason: `${card.name} is a powerful ${card.rarity} card that synergizes well with your commander's strategy.`,
      replaces: currentDeck.find(c => c.type_line === card.type_line),
    });
  });

  // Fill remaining suggestions with highest value cards
  if (suggestions.length < 5) {
    const remaining = unownedEligible
      .filter(c => !suggestions.find(s => s.card.id === c.id))
      .slice(0, 5 - suggestions.length);

    remaining.forEach(card => {
      suggestions.push({
        card,
        reason: `${card.name} would enhance your deck's ${card.type_line.split('—')[0].trim()} strategy.`,
      });
    });
  }

  return suggestions.slice(0, 5);
}
