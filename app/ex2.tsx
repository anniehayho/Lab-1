import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { analyzeSentiment } from './services/api';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const [text, setText] = useState('');
  const [sentiment, setSentiment] = useState({
    score: null,
    type: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyzeSentiment = async () => {
    if (!text.trim()) {
      setError("Please enter some text to analyze");
      return;
    }

    Keyboard.dismiss();
    setLoading(true);
    setError(null);

    try {
      const result = await analyzeSentiment(text);
      setSentiment({
        type: result.sentiment,
        score: result.score
      });
    } catch (err) {
      console.error('Error analyzing sentiment:', err);
      setError(`Failed to analyze sentiment: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setText('');
    setSentiment({ score: null, type: null });
    setError(null);
  };

  // Get background color based on sentiment
  const getBackgroundColor = () => {
    if (sentiment.type === 'positive') return '#4CAF50';
    if (sentiment.type === 'negative') return '#B71C1C';
    if (sentiment.type === 'neutral') return '#607D8B';
    return 'gray';
  };

  // Get emoji based on sentiment
  const getEmoji = () => {
    if (sentiment.type === 'positive') return "happy";
    if (sentiment.type === 'negative') return "sad";
    if (sentiment.type === 'neutral') return "happy-outline";
    return null;
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView 
        style={[styles.container, { backgroundColor: getBackgroundColor() }]}
      >
        <StatusBar style="auto" />
        <KeyboardAvoidingView  
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Sentiment Analysis</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Enter text to analyze..."
              value={text}
              onChangeText={setText}
              multiline
              maxLength={500}
              placeholderTextColor="#888"
            />
            
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleAnalyzeSentiment}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            
            {loading && (
              <ActivityIndicator size="large" color="#fff" style={styles.loader} />
            )}
            
            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}
            
            {sentiment.type && !loading && !error && (
              <View style={styles.resultContainer}>
                <Ionicons 
                  name={getEmoji()} 
                  size={80} 
                  color="white" 
                  style={styles.emoji}
                />
                <Text style={styles.sentimentText}>
                  {sentiment.type.charAt(0).toUpperCase() + sentiment.type.slice(1)}
                </Text>
                {sentiment.score && (
                  <Text style={styles.scoreText}>
                    Score: {(sentiment.score * 100).toFixed(1)}%
                  </Text>
                )}
                <TouchableOpacity 
                  style={styles.resetButton} 
                  onPress={resetAnalysis}
                >
                  <Text style={styles.resetButtonText}>Analyze New Text</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    minHeight: 50,
    maxHeight: 100,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'white',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  emoji: {
    marginBottom: 20,
  },
  loader: {
    marginTop: 30,
  },
  errorText: {
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    textAlign: 'center',
  },
  resetButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 30,
    borderWidth: 1,
    borderColor: 'white',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 14,
  },
  sentimentText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginVertical: 10,
  },
  scoreText: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    marginBottom: 20,
  }
});