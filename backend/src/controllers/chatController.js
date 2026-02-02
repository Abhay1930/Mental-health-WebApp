const { GoogleGenerativeAI } = require('@google-cloud/generative-ai');
const ChatHistory = require('../models/ChatHistory');
const WellnessEntry = require('../models/WellnessEntry');

const client = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_KEY);

exports.chat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Get user's recent mood data for context
    const recentEntry = await WellnessEntry.findOne({
      user_id: req.userId
    }).sort({ date: -1 });

    // Get or create chat history
    let chatHistory = await ChatHistory.findOne({ user_id: req.userId });
    if (!chatHistory) {
      chatHistory = new ChatHistory({ user_id: req.userId, messages: [] });
    }

    // Prepare context for Gemini
    const context = recentEntry
      ? `User's recent wellness data:
         - Mood today: ${recentEntry.mood_today}/10
         - Sleep: ${recentEntry.sleep_hours} hours (Quality: ${recentEntry.sleep_quality}/5)
         - Stress level: ${recentEntry.stress_level}/10
         - Anxiety level: ${recentEntry.anxiety_level}/10
         - Exercise: ${recentEntry.exercise_minutes} minutes
         - Social interaction: ${recentEntry.social_interaction_minutes} minutes
         - Predicted mood: ${recentEntry.predicted_mood}
         - Screen time: ${recentEntry.screen_time} hours`
      : 'No recent wellness data available.';

    const systemPrompt = `You are a compassionate mental health support chatbot named "MindTrack Assistant". 
    Based on the user's wellness data and conversation history, provide personalized, supportive mental health suggestions.
    Be empathetic, non-judgmental, and encourage healthy habits.
    If the user mentions suicidal thoughts or severe mental health crisis, encourage them to contact professional help.
    
    User Context:
    ${context}`;

    // Call Gemini API
    const model = client.getGenerativeModel({ model: 'gemini-pro' });
    
    const response = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: systemPrompt + '\n\nUser: ' + message
            }
          ]
        }
      ]
    });

    const aiResponse = response.response.text();

    // Save chat history
    chatHistory.messages.push({
      role: 'user',
      content: message
    });

    chatHistory.messages.push({
      role: 'assistant',
      content: aiResponse
    });

    chatHistory.mood_context = recentEntry?.predicted_mood || null;
    await chatHistory.save();

    res.json({
      success: true,
      message: aiResponse,
      chatId: chatHistory._id
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get AI response'
    });
  }
};

exports.getChatHistory = async (req, res) => {
  try {
    const chatHistory = await ChatHistory.findOne({ user_id: req.userId });

    if (!chatHistory) {
      return res.json({
        success: true,
        messages: []
      });
    }

    res.json({
      success: true,
      messages: chatHistory.messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.clearChatHistory = async (req, res) => {
  try {
    await ChatHistory.deleteOne({ user_id: req.userId });

    res.json({
      success: true,
      message: 'Chat history cleared'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
