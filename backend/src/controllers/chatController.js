const axios = require('axios');
const ChatHistory = require('../models/ChatHistory');
const WellnessEntry = require('../models/WellnessEntry');

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
    ${context}
    
    User message: ${message}
    
    Provide a helpful, supportive response (1-2 paragraphs).`;

    try {
      // Call Gemini API via REST endpoint
      const apiKey = process.env.GOOGLE_GENERATIVE_AI_KEY;
      
      if (!apiKey || apiKey.includes('your_gemini')) {
        // Use mock response if API key not configured
        const mockResponses = [
          "I appreciate you sharing that with me. That sounds challenging. Remember, it's okay to take things one step at a time. What small step could you take today to help yourself feel better?",
          "Thank you for opening up. Your wellness matters. Based on your data, I notice you might benefit from some self-care. Have you considered taking a short walk or connecting with someone today?",
          "I'm here to support you. It's great that you're tracking your wellness - that shows you care about yourself. Keep up the positive steps!",
          "That's valuable information to share. Mental health is a journey, and every small effort counts. What's one thing that usually helps you feel better?"
        ];
        const aiResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
        
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

        return res.json({
          success: true,
          message: aiResponse,
          chatId: chatHistory._id,
          note: 'Using demo mode - add Gemini API key for real AI responses'
        });
      }

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: systemPrompt
                }
              ]
            }
          ]
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      const aiResponse = response.data.candidates[0].content.parts[0].text;

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
    } catch (apiError) {
      console.error('Gemini API error:', apiError.message);
      
      // Fallback response
      const fallbackResponse = "I'm experiencing a technical issue, but I want you to know that your wellbeing is important. Please take care of yourself today. Consider what helps you feel better and do that.";
      
      chatHistory.messages.push({
        role: 'user',
        content: message
      });

      chatHistory.messages.push({
        role: 'assistant',
        content: fallbackResponse
      });

      await chatHistory.save();

      res.json({
        success: true,
        message: fallbackResponse,
        chatId: chatHistory._id
      });
    }
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process message'
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
