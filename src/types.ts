export interface Card {
  id: string;
  name: string;
  mana_cost?: string;
  cmc: number;
  type_line: string;
  oracle_text?: string;
  flavor_text?: string;
  power?: string;
  toughness?: string;
  colors: string[];
  color_identity: string[];
  set: string;
  set_name: string;
  collector_number: string;
  rarity: string;
  artist?: string;
  image_uris?: {
    small?: string;
    normal?: string;
    large?: string;
    png?: string;
    art_crop?: string;
    border_crop?: string;
  };
  card_faces?: Array<{
    name: string;
    mana_cost?: string;
    type_line: string;
    oracle_text?: string;
    flavor_text?: string;
    power?: string;
    toughness?: string;
    image_uris?: {
      small?: string;
      normal?: string;
      large?: string;
      png?: string;
    };
  }>;
  keywords: string[];
  legalities: {
    commander: string;
  };
  loyalty?: string;
  produced_mana?: string[];
}

export interface Panorama {
  name: string;
  cards: string[];
}

export interface UserPreferences {
  playStyle?: string;
  winCondition?: string;
  tempo?: string;
  favoriteCard?: string;
  favoriteCharacter?: string;
}

export interface DeckBuildResult {
  commander: Card;
  deck: Card[];
  suggestions: CardSuggestion[];
}

export interface CardSuggestion {
  card: Card;
  reason: string;
  replaces?: Card;
}
