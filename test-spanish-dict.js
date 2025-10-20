/**
 * Test Spanish Dictionary Loading
 * Run with: node test-spanish-dict.js
 */

async function testSpanishDict() {
  console.log('🧪 Testing Spanish Dictionary...\n');

  try {
    // 1. Test dictionary import
    console.log('1️⃣ Importing dictionary-es...');
    const dict = await import('dictionary-es');
    console.log('✅ Dictionary imported successfully');

    // 2. Get dictionary paths
    console.log('\n2️⃣ Loading dictionary paths...');
    const dictionaryPath = await new Promise((resolve, reject) => {
      dict.default((err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    console.log('✅ Dictionary paths loaded');
    console.log('   AFF file:', dictionaryPath.aff);
    console.log('   DIC file:', dictionaryPath.dic);

    // 3. Read dictionary files
    console.log('\n3️⃣ Reading dictionary files...');
    const fs = await import('fs/promises');
    const [affBuffer, dicBuffer] = await Promise.all([
      fs.readFile(dictionaryPath.aff),
      fs.readFile(dictionaryPath.dic)
    ]);
    console.log('✅ Files read successfully');
    console.log('   AFF size:', affBuffer.length, 'bytes');
    console.log('   DIC size:', dicBuffer.length, 'bytes');

    // 4. Load nspell
    console.log('\n4️⃣ Loading nspell...');
    const nspell = (await import('nspell')).default;
    const spell = nspell({ aff: affBuffer, dic: dicBuffer });
    console.log('✅ nspell loaded successfully');

    // 5. Test Spanish words
    console.log('\n5️⃣ Testing Spanish words:\n');
    
    const testWords = [
      { word: 'hola', expected: true },
      { word: 'mundo', expected: true },
      { word: 'mundu', expected: false },
      { word: 'buscando', expected: true },
      { word: 'buscand', expected: false },
      { word: 'hermoso', expected: true },
      { word: 'hermosa', expected: true },
      { word: 'despertar', expected: true },
      { word: 'amor', expected: true },
      { word: 'esposa', expected: true },
    ];

    for (const { word, expected } of testWords) {
      const isCorrect = spell.correct(word);
      const status = isCorrect === expected ? '✅' : '❌';
      const suggestions = isCorrect ? '' : ` → Suggestions: ${spell.suggest(word).slice(0, 3).join(', ')}`;
      console.log(`${status} "${word}" - Correct: ${isCorrect} (Expected: ${expected})${suggestions}`);
    }

    console.log('\n🎉 Test complete!');

  } catch (error) {
    console.error('\n❌ ERROR:', error);
    console.error('\nStack trace:', error.stack);
  }
}

testSpanishDict();
