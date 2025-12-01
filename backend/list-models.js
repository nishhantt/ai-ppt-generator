const axios = require('axios');

const API_KEY = 'AIzaSyB188aTIO2HV-_Z9bb5y51ya0VcZIdCS78'; // Replace with your actual key

async function listModels() {
  try {
    const response = await axios.get(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
    );
    
    console.log('Available models:');
    console.log('================\n');
    
    response.data.models.forEach(model => {
      console.log(`Name: ${model.name}`);
      console.log(`Display Name: ${model.displayName}`);
      console.log(`Supported methods: ${model.supportedGenerationMethods.join(', ')}`);
      console.log('---');
    });
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Details:', error.response.data);
    }
  }
}

listModels();