import axios from 'axios';

// Function to analyze sentiment - tries Google API first, falls back to local analysis
export const analyzeSentiment = async (text: string) => {
  try {
    // Try to use Google API first
    try {
      const API_KEY = "AIzaSyAuGk0WwWtB1vmItT4PegASMUiQUhC22Ao"; // Replace with your actual API key
      
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `Analyze the sentiment of the following text and respond only with a JSON object containing 'sentiment' (positive, negative, or neutral) and 'score' (confidence between 0 and 1): "${text}"`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      const aiResponse = response.data.candidates[0].content.parts[0].text.trim();
      
      try {
        // Extract JSON object from response
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const jsonString = jsonMatch[0];
          const parsedResponse = JSON.parse(jsonString);
          return {
            sentiment: parsedResponse.sentiment.toLowerCase(),
            score: parsedResponse.score
          };
        }
      } catch (parseError) {
        console.log("Falling back to local analysis due to parse error");
        // Continue to fallback
      }
    } catch (apiError) {
      console.log("Falling back to local analysis due to API error");
      // Continue to fallback
    }
    
    // Local sentiment analysis fallback
    return localSentimentAnalysis(text);
    
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    throw new Error('Failed to analyze sentiment');
  }
};

// Local sentiment analysis implementation
const localSentimentAnalysis = (text: string) => {
  const lowerText = text.toLowerCase();
  
  const positiveWords = [
    'good', 'great', 'happy', 'excellent', 'love', 
    'wonderful', 'amazing', 'fantastic', 'beautiful', 
    'enjoy', 'like', 'best', 'perfect', 'pleased',
    'glad', 'delighted', 'awesome', 'brilliant',
    'satisfied', 'impressive', 'success', 'win'
  ];
  
  const negativeWords = [
    'bad', 'terrible', 'sad', 'awful', 'hate', 
    'horrible', 'disappointing', 'poor', 'ugly', 
    'dislike', 'angry', 'mad', 'upset', 'annoyed',
    'frustrated', 'disaster', 'failure', 'worst',
    'broken', 'useless', 'waste', 'awful', 'regret'
  ];
  
  let positiveScore = 0;
  let negativeScore = 0;
  
  // Count positive and negative words
  for (const word of positiveWords) {
    const regex = new RegExp('\\b' + word + '\\b', 'gi');
    const matches = lowerText.match(regex);
    if (matches) positiveScore += matches.length;
  }
  
  for (const word of negativeWords) {
    const regex = new RegExp('\\b' + word + '\\b', 'gi');
    const matches = lowerText.match(regex);
    if (matches) negativeScore += matches.length;
  }
  
  // Determine sentiment
  let sentiment;
  let score;
  
  if (positiveScore > negativeScore) {
    sentiment = 'positive';
    score = 0.5 + Math.min(0.49, (positiveScore * 0.05));
  } else if (negativeScore > positiveScore) {
    sentiment = 'negative';
    score = 0.5 + Math.min(0.49, (negativeScore * 0.05));
  } else {
    sentiment = 'neutral';
    score = 0.5;
  }
  
  return { sentiment, score };
};

export default {
  analyzeSentiment
};