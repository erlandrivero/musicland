# Lyrics Spell-Check Feature

## Overview

The spell-check feature helps users catch typos in their custom lyrics **before** generating songs with Suno API. Since Suno generates unique songs that cannot be edited after creation, this feature prevents the frustration of discovering typos in an otherwise perfect song.

## Key Features

✅ **Bilingual Support**: English and Spanish spell-checking  
✅ **Real-time Feedback**: Live spell-check as you type (debounced)  
✅ **Smart Detection**: Recognizes common music terms and interjections  
✅ **Suggestions**: Provides spelling suggestions for detected errors  
✅ **Bypass Option**: Users can proceed with "intentional typos" for artistic expression  
✅ **Confirmation Modal**: Clear warning before generation with option to review or proceed  
✅ **Custom Dictionary**: Ignore specific words (e.g., slang, phonetic spelling)

## User Workflow

### 1. Enable Custom Mode & Enter Lyrics
```
1. Open music generation form
2. Click "Advanced Options"
3. Enable "Custom Mode"
4. Enter track title and lyrics
```

### 2. Real-Time Spell Check
- As you type, spell-check runs automatically (500ms debounce)
- Language selector allows switching between English/Spanish
- Detected typos are highlighted below the textarea
- Each typo shows suggestions and can be ignored individually

### 3. Confirmation Before Generation
When clicking "Generate Music":
- **If typos detected**: Modal appears showing all errors
  - Option 1: "Review & Edit" - Returns to form with focus on lyrics
  - Option 2: "Generate Anyway" - Proceeds with generation (bypass)
  - Option 3: "Cancel" - Closes modal
  
- **If no typos**: Modal shows success message
  - Proceed directly to generation

### 4. Ignore Words (Custom Dictionary)
Users can click the "X" button next to any flagged word to:
- Add it to their custom dictionary
- Prevent future flagging of that word
- Useful for intentional stylistic choices

## Technical Implementation

### Components

#### 1. `LyricsSpellCheck.tsx`
- Real-time spell-check display
- Language selector (EN/ES)
- Shows detected errors with suggestions
- Allows ignoring individual words

#### 2. `SpellCheckConfirmModal.tsx`
- Confirmation dialog before generation
- Lists all detected typos
- Provides clear options: Review, Cancel, or Generate Anyway
- Explains that songs cannot be edited after generation

#### 3. Updated `generation-form.tsx`
- Integrates spell-check into custom lyrics input
- Checkbox to enable/disable spell-check
- Intercepts form submission to check spelling
- Manages spell-check state and modal display

### Libraries & APIs

#### Client-Side
```typescript
// lib/spell-checker.ts
- Basic spell-checking logic
- Music terms whitelist
- Custom dictionary management
- Fallback for when server is unavailable
```

#### Server-Side (Recommended)
```typescript
// lib/advanced-spell-checker.ts
- Full dictionary support using nspell
- English dictionary (dictionary-en)
- Spanish dictionary (dictionary-es)
- More accurate detection

// app/api/spell-check/route.ts
- POST /api/spell-check
- Accepts: { text: string, language: 'en' | 'es' }
- Returns: SpellCheckResult with errors and suggestions
```

### Data Flow

```
User Types → Debounced (500ms) → API Call (/api/spell-check)
                                       ↓
                              Server-side nspell
                                       ↓
                              Check against dictionary
                                       ↓
                              Filter music terms
                                       ↓
                              Return errors + suggestions
                                       ↓
                              Display in UI
```

## Configuration

### Disable Spell-Check
Users can disable spell-check using the checkbox above the lyrics textarea:
```tsx
<label className="flex items-center gap-2 text-xs text-gray-600">
  <input type="checkbox" checked={spellCheckEnabled} />
  Spell check
</label>
```

### Language Selection
Select language from dropdown in spell-check component:
```tsx
<select value={language}>
  <option value="en">English</option>
  <option value="es">Español</option>
</select>
```

### Custom Dictionary
Words ignored by the user are stored in memory during the session:
```typescript
const checker = getSpellChecker(language);
checker.addToCustomDictionary('phonetically');
```

## Whitelisted Music Terms

The spell-checker automatically ignores common music terms:

**English:**
- Interjections: yeah, woah, ooh, ahh, mmm, hmm, whoa, uh, ohh
- Contractions: gonna, wanna, gotta, kinda, sorta
- Scatting: la, na, da, ba, sha, doo, wop

**Spanish:**
- Interjections: ay, uy, eh, oh, ey, guau

## API Endpoints

### POST `/api/spell-check`

**Request:**
```json
{
  "text": "This is my song lirics with a typo",
  "language": "en"
}
```

**Response (with errors):**
```json
{
  "hasErrors": true,
  "totalErrors": 1,
  "errors": [
    {
      "word": "lirics",
      "startIndex": 16,
      "endIndex": 22,
      "suggestions": ["lyrics", "lyrics", "lyric"],
      "line": 0
    }
  ]
}
```

**Response (no errors):**
```json
{
  "hasErrors": false,
  "totalErrors": 0,
  "errors": []
}
```

## Example Usage

### Basic Spell-Check
```typescript
import { getSpellChecker } from '@/lib/spell-checker';

const checker = getSpellChecker('en');
const result = await checker.checkText(lyrics);

if (result.hasErrors) {
  console.log(`Found ${result.totalErrors} typos`);
  result.errors.forEach(error => {
    console.log(`- "${error.word}" on line ${error.line + 1}`);
    console.log(`  Suggestions: ${error.suggestions.join(', ')}`);
  });
}
```

### Server-Side Check (More Accurate)
```typescript
import { serverSideSpellCheck } from '@/lib/advanced-spell-checker';

const result = await serverSideSpellCheck(lyrics, 'es');
```

## Dependencies

```json
{
  "dependencies": {
    "nspell": "^2.1.5",
    "dictionary-en": "^3.2.0",
    "dictionary-es": "^2.0.3"
  },
  "devDependencies": {
    "@types/nspell": "^2.1.4"
  }
}
```

## Benefits

### For Users
1. **Prevents Costly Mistakes**: Catch typos before wasting credits
2. **No Re-generation**: Avoid generating multiple versions to fix one typo
3. **Maintains Creativity**: Option to proceed with intentional "typos"
4. **Bilingual**: Support for Spanish and English lyrics

### For Business
1. **Better UX**: Reduces user frustration
2. **Credit Efficiency**: Users waste fewer credits on typo corrections
3. **Professional Output**: Higher quality generated songs
4. **Competitive Advantage**: Feature not available in basic Suno interfaces

## Future Enhancements

- [ ] Add more languages (French, German, Italian, etc.)
- [ ] Highlight typos directly in textarea with underlines
- [ ] Grammar checking (beyond spelling)
- [ ] Song structure validation ([Verse], [Chorus] format)
- [ ] Rhyme scheme analysis
- [ ] Syllable counting for rhythm analysis
- [ ] Save custom dictionaries per user to database
- [ ] AI-powered contextual suggestions

## Troubleshooting

### Spell-Check Not Working?
1. Check browser console for errors
2. Verify `/api/spell-check` endpoint is accessible
3. Ensure dictionaries are installed: `npm list nspell dictionary-en dictionary-es`
4. Try disabling and re-enabling spell-check
5. Fallback: Client-side spell-check will activate automatically

### False Positives?
- Click "X" next to the word to ignore it
- Use the language selector to ensure correct language is selected
- Intentional artistic choices can be bypassed with "Generate Anyway"

### Performance Issues?
- Debounce is set to 500ms to avoid excessive API calls
- Server-side check is fast (~50-200ms typical)
- Client-side fallback available if server is slow/unavailable

## Summary

The spell-check feature provides a safety net for users creating custom lyrics, preventing the frustration of discovering typos after generating non-editable songs. With bilingual support, smart detection, and a bypass option for artistic expression, it balances helpfulness with user freedom.

**Key Takeaway**: You can't edit a generated song, so catching typos beforehand saves time, credits, and frustration! 🎵✨
