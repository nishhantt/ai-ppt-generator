const Groq = require('groq-sdk');
const Conversation = require('../models/Conversation');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const generatePresentation = async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    // Validation
    if (!message || !sessionId) {
      return res.status(400).json({ 
        error: 'Message and sessionId are required' 
      });
    }

    if (typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Message must be a non-empty string' 
      });
    }

    // Find or create conversation
    let conversation = await Conversation.findOne({ sessionId });
    
    if (!conversation) {
      conversation = new Conversation({
        sessionId,
        messages: []
      });
    }

    // Add user message
    conversation.messages.push({
      role: 'user',
      content: message
    });

    // Prepare context
    const contextMessages = conversation.messages
      .slice(-5)
      .map(m => `${m.role}: ${m.content}`)
      .join('\n');

    const currentPresentationContext = conversation.currentPresentation
      ? `\n\nCurrent Presentation Context:\nTitle: ${conversation.currentPresentation.title}\nSlides: ${conversation.currentPresentation.slides.length}`
      : '';

    const prompt = `You are an expert PowerPoint presentation creator. Generate structured content based on the user's request.

Previous Conversation:
${contextMessages}
${currentPresentationContext}

User's Current Request: ${message}

Generate a JSON response with this EXACT structure (return ONLY valid JSON, no markdown backticks or extra text):
{
  "title": "Professional Presentation Title",
  "slides": [
    {
      "title": "Title Slide",
      "content": ["Subtitle or tagline"],
      "layout": "title"
    },
    {
      "title": "Content Slide Title",
      "content": ["Bullet point 1", "Bullet point 2", "Bullet point 3"],
      "layout": "content"
    }
  ],
  "responseMessage": "I've created a presentation about [topic] with [number] slides covering [brief description]."
}

RULES:
1. First slide MUST be layout "title" with main title
2. Content slides should have 3-5 concise bullet points
3. Use layout "section" for major section transitions
4. Keep all content professional and clear
5. Total slides should be 8-15 depending on topic complexity
6. Return ONLY the JSON object - no markdown, no backticks, no explanations

If the user wants to edit/modify an existing presentation, update the relevant slides while keeping others intact.`;

    console.log('🤖 Calling Groq API...');

    // Call Groq API
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile', // Fast and powerful
      temperature: 0.7,
      max_tokens: 4096,
      top_p: 1,
      stream: false
    });

    console.log('✅ Received response from Groq');

    const text = completion.choices[0].message.content;
    
    console.log('Response preview:', text.substring(0, 200));

    // Extract JSON from response
    let jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('❌ No JSON found in response');
      console.error('Full response:', text);
      throw new Error('Invalid JSON response from AI');
    }

    const presentationData = JSON.parse(jsonMatch[0]);

    // Validate presentation data
    if (!presentationData.title || !Array.isArray(presentationData.slides)) {
      throw new Error('Invalid presentation structure');
    }

    console.log(`✅ Generated presentation: "${presentationData.title}" with ${presentationData.slides.length} slides`);

    // Save presentation data
    conversation.currentPresentation = presentationData;
    
    // Add assistant message
    const responseMessage = presentationData.responseMessage || 
      `I've created "${presentationData.title}" with ${presentationData.slides.length} slides for you!`;
    
    conversation.messages.push({
      role: 'assistant',
      content: responseMessage,
      presentationData: presentationData
    });

    await conversation.save();

    res.json({
      message: responseMessage,
      presentationData: presentationData,
      conversationId: conversation._id
    });

  } catch (error) {
    console.error('❌ Error in generatePresentation:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({ 
      error: 'Failed to generate presentation',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const getConversation = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const conversation = await Conversation.findOne({ sessionId });
    
    if (!conversation) {
      return res.status(404).json({ 
        error: 'Conversation not found' 
      });
    }

    res.json({
      sessionId: conversation.sessionId,
      messages: conversation.messages,
      currentPresentation: conversation.currentPresentation,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt
    });
  } catch (error) {
    console.error('Error in getConversation:', error);
    res.status(500).json({ 
      error: 'Failed to fetch conversation' 
    });
  }
};

const deleteConversation = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const result = await Conversation.deleteOne({ sessionId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ 
        error: 'Conversation not found' 
      });
    }

    res.json({ 
      message: 'Conversation deleted successfully' 
    });
  } catch (error) {
    console.error('Error in deleteConversation:', error);
    res.status(500).json({ 
      error: 'Failed to delete conversation' 
    });
  }
};

module.exports = {
  generatePresentation,
  getConversation,
  deleteConversation
};