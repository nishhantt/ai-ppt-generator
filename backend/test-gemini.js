const { GoogleGenerativeAI } = require('@google/generative-ai');

// REPLACE WITH YOUR ACTUAL API KEY
const API_KEY = 'AIzaSyB188aTIO2HV-_Z9bb5y51ya0VcZIdCS78';

const genAI = new GoogleGenerativeAI(API_KEY);

async function testModels() {
  const models = [
    'gemini-pro',
    'gemini-1.5-pro',
    'gemini-1.5-flash',
    'gemini-1.0-pro',
    'models/gemini-pro',
    'models/gemini-1.5-flash'
  ];

  console.log('Testing available models...\n');

  for (const modelName of models) {
    try {
      console.log(`Testing: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Say hello');
      const response = result.response.text();
      console.log(`✅ SUCCESS: ${modelName}`);
      console.log(`Response: ${response}\n`);
      break; // Stop after first success
    } catch (error) {
      console.log(`❌ FAILED: ${modelName}`);
      console.log(`Error: ${error.message}\n`);
    }
  }
}

testModels();