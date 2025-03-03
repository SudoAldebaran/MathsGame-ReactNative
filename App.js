// Import des composants nécessaires de React Native
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
// Import des hooks React nécessaires
import { useState, useEffect } from 'react';

import { SafeAreaView } from 'react-native';

// Constantes pour configurer le jeu
const MAX_NUMBER_EASY = 50;    // Nombre maximum pour le mode facile
const MAX_NUMBER_HARD = 100;   // Nombre maximum pour le mode difficile
const MAX_TIME = 15;           // Temps maximum en secondes

// Fonction utilitaire pour générer un nombre aléatoire
const rndNumber = (maxNumber) => {
  return (Math.floor(Math.random() * maxNumber));
}

// Fonction pour formater le temps affiché (ajoute des zéros si nécessaire)
const formatTime = (time) => {
  if (time < 10) {
    return ('00 : 0' + time)
  }
  else {
    return ('00 : ' + time)
  }
}

// Composant pour le clavier numérique
const NumericKeyboard = ({ onPress, onDelete, message }) => {
  // Définition des touches du clavier
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  return (
    <View style={styles.keyboard}>
      <View style={styles.keyboardRows}>
        {/* Génération des touches numériques */}
        {numbers.map((num) => (
          <TouchableOpacity
            key={num}
            style={styles.keyboardButton}
            onPress={() => onPress(num)}
          >
            <Text style={styles.keyboardButtonText}>{num}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Message de réponse */}
      <Text style={[
        styles.message,
        message.includes('Bonne') ? styles.successMessage : styles.errorMessage
      ]}>{message}</Text>
      {/* Bouton de suppression */}
      <TouchableOpacity 
        style={[styles.keyboardButton, styles.deleteButton]}
        onPress={onDelete}
      >
        <Text style={styles.keyboardButtonText}>⌫</Text>
      </TouchableOpacity>
    </View>
  );
};

// Composant pour les boutons personnalisés
const CustomButton = ({ onPress, title, disabled, color, style }) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    style={[
      styles.button,
      style,
      { backgroundColor: disabled ? '#cccccc' : (color || '#2196F3') },
    ]}
  >
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

// Composant principal de l'application
export default function App() {
  // Déclaration des états avec useState
  const [numberOne, setNumberOne] = useState(0);        // Premier nombre de l'opération
  const [numberTwo, setNumberTwo] = useState(0);        // Deuxième nombre de l'opération
  const [numberThree, setNumberThree] = useState(0);    // Troisième nombre de l'opération (pour difficulté Hard)
  const [solution, setSolution] = useState();           // Résultat attendu
  const [userAnswer, setUserAnswer] = useState('');     // Réponse de l'utilisateur
  const [msg, setMsg] = useState('');                   // Message affiché (succès/erreur)
  const [gameStarted, setGameStarted] = useState(false);// État du jeu
  const [selectingDifficulty, setSelectingDifficulty] = useState(false); // Sélection de la difficulté
  const [difficulty, setDifficulty] = useState(null);   // Niveau de difficulté choisi
  const [score, setScore] = useState(0);               // Score du joueur

  // États pour la gestion du timer
  const [timeLeft, setTimeLeft] = useState(MAX_TIME);   // Temps restant
  const [timer, setTimer] = useState(null);            // Référence du timer

  // Effect pour calculer la solution quand les nombres changent
  useEffect(() => {
    if (difficulty === 'hard') {
      setSolution(() => (numberOne + numberTwo + numberThree));
    } else {
      setSolution(() => (numberOne + numberTwo));
    }
  }, [numberOne, numberTwo, numberThree, difficulty]);

  // Effect pour gérer la fin du temps
  useEffect(() => {
    if (timeLeft == 0) {
      if (timer) clearInterval(timer);
      setMsg('Temps écoulé! Score final: ' + score);
      setGameStarted(false);
    }
  }, [timeLeft]);

  // Effect pour vérifier la réponse automatiquement
  useEffect(() => {
    if (userAnswer !== '' && parseInt(userAnswer) === solution) {
      handleCorrectAnswer();
    }
  }, [userAnswer]);

  // Fonction pour décrémenter le temps
  const decreaseTime = () => {
    setTimeLeft((timeLeft) => Math.max(timeLeft - 1, 0));
  };

  // Gestionnaire pour commencer une nouvelle partie
  const handleNewGame = () => {
    setGameStarted(false);
    setSelectingDifficulty(true);
    setMsg('');
    setScore(0);
    if (timer) clearInterval(timer);
  };

  // Gestionnaire pour la sélection de la difficulté
  const handleDifficultySelect = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
  };

  // Fonction pour générer un nouveau problème
  const generateNewProblem = () => {
    const maxNumber = difficulty === 'easy' ? MAX_NUMBER_EASY : MAX_NUMBER_HARD;
    setNumberOne(rndNumber(maxNumber));
    setNumberTwo(rndNumber(maxNumber));
    if (difficulty === 'hard') {
      setNumberThree(rndNumber(maxNumber));
    } else {
      setNumberThree(0);
    }
    setUserAnswer('');
    setTimeLeft(MAX_TIME); // Réinitialiser le temps pour chaque nouvelle question

    if (timer) clearInterval(timer); // Arrêter le minuteur précédent
    const newTimer = setInterval(decreaseTime, 1000); // Démarrer un nouveau minuteur
    setTimer(newTimer);
  };

  // Fonction pour démarrer le jeu
  const startGame = () => {
    setGameStarted(true);
    setSelectingDifficulty(false);
    setMsg('');
    setScore(0);
    generateNewProblem(); // Générer la première question et démarrer le minuteur
  };

  // Gestionnaire pour les réponses correctes
  const handleCorrectAnswer = () => {
    setScore(score + 1);
    setMsg('Bonne réponse !');
    setTimeout(() => {
      setMsg('');
      generateNewProblem();
    }, 500);
  };

  // Gestionnaire pour les touches du clavier
  const handleKeyPress = (num) => {
    if (userAnswer.length < 3) {  // Limite à 3 chiffres
      setUserAnswer(userAnswer + num.toString());
    }
  };

  // Gestionnaire pour la suppression
  const handleDelete = () => {
    setUserAnswer(userAnswer.slice(0, -1));
  };

  // Rendu de l'écran d'accueil
  if (!gameStarted && !selectingDifficulty) {
    return (
      <View style={styles.container}>
        <Text style={styles.gameTitle}>Math Game</Text>
        {score > 0 && <Text style={styles.scoreText}>Score final: {score}</Text>}
        <CustomButton
          title="New Game"
          onPress={() => setSelectingDifficulty(true)}
          style={styles.mainButton}
        />
      </View>
    );
  }

  // Rendu de l'écran de sélection de la difficulté
  if (selectingDifficulty) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Choose difficulty</Text>
        <View style={styles.difficultyContainer}>
          <CustomButton
            title="Easy"
            onPress={() => handleDifficultySelect('easy')}
            color={difficulty === 'easy' ? '#4CAF50' : '#808080'}
            style={[styles.difficultyButton, difficulty === 'easy' && styles.selectedButton]}
          />
          <CustomButton
            title="Hard"
            onPress={() => handleDifficultySelect('hard')}
            color={difficulty === 'hard' ? '#f44336' : '#808080'}
            style={[styles.difficultyButton, difficulty === 'hard' && styles.selectedButton]}
          />
        </View>
        <CustomButton
          title="Start"
          onPress={startGame}
          disabled={!difficulty}
          style={styles.startButton}
        />
      </View>
    );
  }

  // Rendu de l'écran de jeu principal
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
      <Text style={styles.score}>Score: {score}</Text>
      <Text style={styles.equation}>
        {numberOne} + {numberTwo}
        {difficulty === 'hard' && ` + ${numberThree}`} = 
      </Text>
      <Text style={styles.userAnswer}>{userAnswer}</Text>
      <NumericKeyboard 
        onPress={handleKeyPress}
        onDelete={handleDelete}
        message={msg}
      />
    </SafeAreaView>
  );
}

// Styles de l'application
const styles = StyleSheet.create({
  // Conteneur principal
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  // Style du titre du jeu
  gameTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 40,
  },
  // Style du titre général
  title: {
    fontSize: 24,
    marginBottom: 30,
    color: '#333',
    fontWeight: '600',
  },
  // Style du score
  score: {
    fontSize: 24,
    color: '#2196F3',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  // Style du texte du score
  scoreText: {
    fontSize: 24,
    color: '#4CAF50',
    marginBottom: 20,
  },
  // Conteneur des boutons de difficulté
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  // Style de base des boutons
  button: {
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  // Style du texte des boutons
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  // Style du bouton principal
  mainButton: {
    width: '60%',
    backgroundColor: '#2196F3',
  },
  // Style des boutons de difficulté
  difficultyButton: {
    width: '40%',
    margin: 10,
  },
  // Style du bouton sélectionné
  selectedButton: {
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  // Style du bouton de démarrage
  startButton: {
    width: '50%',
    backgroundColor: '#4CAF50',
  },
  // Style du bouton nouvelle partie
  newGameButton: {
    width: '50%',
    marginTop: 20,
  },
  // Style du timer
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  // Style de l'équation
  equation: {
    fontSize: 32,
    color: '#333',
    fontWeight: '600',
    marginBottom: 20,
  },
  // Style de la réponse utilisateur
  userAnswer: {
    fontSize: 36,
    color: '#2196F3',
    fontWeight: 'bold',
    minHeight: 50,
    marginBottom: 20,
  },
  // Style des messages
  message: {
    marginTop: 5,
    marginBottom: 50, // Réduire la marge inférieure
    fontSize: 18,
    fontWeight: '500',
    padding: 10,
    borderRadius: 5,
  },
  // Style du message de succès
  successMessage: {
    color: '#4CAF50',
  },
  // Style du message d'erreur
  errorMessage: {
    color: '#f44336',
  },
  // Style du clavier
  keyboard: {
    width: '60%',
    maxWidth: 300,
    alignItems: 'center',
  },
  // Style des rangées du clavier
  keyboardRows: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  // Style des boutons du clavier
  keyboardButton: {
    width: '30%',
    aspectRatio: 1,
    margin: '1.5%',
    marginBottom: 5, // Réduire la marge inférieure
    backgroundColor: '#2196F3',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  // Style du bouton de suppression
  deleteButton: {
    width: '45%',
    aspectRatio: 2,
    backgroundColor: '#f44336',
    marginTop: 5, // Réduire la marge supérieure
  },
  // Style du texte des boutons du clavier
  keyboardButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});