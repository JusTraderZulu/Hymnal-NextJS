# Spiritual Baptist Hymnal

A digital hymnal application built with Next.js.

## Setup Instructions

1. Clone this repository
2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`
3. Create a `hymns` folder in the root directory
4. Add your hymn JSON files to the `hymns` folder (format shown below)
5. Start the development server:
   \`\`\`
   npm run dev
   \`\`\`

## Hymn JSON Format

Each hymn should be in a separate JSON file in the `hymns` folder. The filename should be in the format `hymn_[number].json` (e.g., `hymn_1.json`, `hymn_355a.json`).

Example hymn JSON format:

\`\`\`json
{
  "hymnNumber": 1,
  "title": "When We Walk With The Lord",
  "author": {
    "name": "John H. Sammis",
    "birthYear": "1846",
    "deathYear": "1919",
    "bio": "John H. Sammis was an American Presbyterian minister and hymn writer."
  },
  "category": "",
  "lyrics": "1. When we walk with the Lord\nIn the light of His word,\nWhat a glory He sheds on our way,\nWhile we do His good will,\nHe abides with us still,\nAnd with all who will trust and obey\n\nCHORUS:\nTrust and obey,\nFor there's no other way\nTo be happy in Jesus\nBut to trust and obey.\n\n2. Not a shadow can rise,\nNot a cloud in the skies,\nBut His smile quickly drives it away;\nNot a doubt nor a fear,\nNot a sigh nor a tear,\nCan abide while we trust and obey."
}
\`\`\`

## Features

- Search hymns by number, title, lyrics, or first line
- View hymn details with verses and chorus clearly separated
- Edit hymn lyrics (changes are saved back to the JSON files)
- Add hymns to favorites
- Track recently viewed hymns
- Navigate between hymns
- Responsive design for all devices

## Technologies Used

- Next.js 14 (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui components
