# Lord of the Rings MTG Deck Builder

A comprehensive web application for building Magic: The Gathering Commander decks using cards from The Lord of the Rings set.

## Features

- **Complete Card Database**: Access all cards from the LOTR MTG set via Scryfall API
- **Card Collection Management**: Select the cards you own with an intuitive interface (25 cards per page)
- **Detailed Card Viewing**: Click any card to see full details including:
  - High-resolution card images
  - Mana cost and casting information
  - Card text and flavor text
  - Power/Toughness and other stats
  - Artist information
- **Panorama Detection**: Automatically notifies you when you have complete panorama card sets
- **Smart Questionnaire**: Answer 5 questions about your playstyle to get personalized recommendations
- **Color Recommendation**: AI-powered color combination suggestions based on your preferences
- **Commander Selection**: Choose from 3 legendary creatures matching your colors
- **Automated Deck Building**: Generates a full 100-card Commander deck following official rules
- **Card Suggestions**: Get 5 recommended cards to improve your deck with detailed explanations

## Live Demo

Visit the app at: `https://erynms.github.io/LOTRDeckBuilderMTG/`

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Technologies Used

- React 18 with TypeScript
- Vite for fast builds
- Scryfall API for card data
- GitHub Pages for hosting

## Deployment

This app is automatically deployed to GitHub Pages via GitHub Actions when changes are pushed to the main branch.

## How to Use

1. **Select Your Cards**: Browse through the LOTR set and mark the cards you own
2. **Answer Questions**: Tell us about your playstyle and preferences
3. **Review Colors**: Confirm or request different color combinations
4. **Choose Commander**: Select your legendary creature
5. **Get Your Deck**: View your complete deck and card suggestions

## Commander Deck Rules

The deck builder follows official Commander format rules:
- 1 legendary creature as commander
- 99 additional cards
- No duplicates except basic lands
- Cards must match commander's color identity
- Only special lands included (no basic lands)

## License

MIT License - feel free to use and modify!