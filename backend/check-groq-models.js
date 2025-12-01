const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 
});

async function testModels() {
  const models = [
    'llama-3.3-70b-versatile',
    'llama-3.1-8b-instant',
    'llama3-8b-8192',
    'llama3-70b-8192',
    'gemma2-9b-it',
    'gemma-7b-it'
  ];

  console.log('Testing Groq models...\n');

  for (const modelName of models) {
    try {
      console.log(`Testing: ${modelName}`);
      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: 'Say hi' }],
        model: modelName,
        max_tokens: 50
      });
      console.log(`✅ SUCCESS: ${modelName}`);
      console.log(`Response: ${completion.choices[0].message.content}\n`);
      break; // Stop after first success
    } catch (error) {
      console.log(`❌ FAILED: ${modelName}`);
      console.log(`Error: ${error.message}\n`);
    }
  }
}

testModels();