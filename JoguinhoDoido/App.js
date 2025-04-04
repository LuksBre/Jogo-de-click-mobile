import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, TouchableWithoutFeedback } from 'react-native';

const { width, height } = Dimensions.get('window'); // Pegando o tamanho da tela

const App = () => {
  const [score, setScore] = useState(0); // Pontuação
  const [missed, setMissed] = useState(0); // Número de botões que sumiram sem ser tocados
  const [gameOver, setGameOver] = useState(false); // Se o jogo acabou
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 }); // Posição do botão
  const [timer, setTimer] = useState(null); // Timer para o botão desaparecer

  // Função para gerar uma posição aleatória para o botão
  const generateRandomPosition = () => {
    const x = Math.floor(Math.random() * (width - 100)); // Largura do botão
    const y = Math.floor(Math.random() * (height - 100)); // Altura do botão
    return { x, y };
  };

  // Função chamada quando o jogador toca no botão
  const handleButtonPress = () => {
    if (gameOver) return; // Impede o jogador de tocar no botão após o game over

    setScore(score + 1); // Incrementa a pontuação
    resetButton(); // Reseta o botão com nova posição
  };

  // Função chamada quando o jogador toca fora do botão
  const handleAreaPress = () => {
    if (gameOver) return; // Impede o jogador de cometer erro após o game over

    setMissed(missed + 1); // Contabiliza erro ao tocar fora do botão
    if (missed + 1 >= 3) {
      setGameOver(true); // Fim de jogo quando o jogador perder 3 botões
    } else {
      resetButton(); // Reseta o botão com nova posição
    }
  };

  // Função que faz o botão desaparecer e checa se o jogador errou
  const handleButtonDisappear = () => {
    if (gameOver) return; // Impede o jogador de perder após o game over

    setMissed(missed + 1); // Incrementa o número de botões perdidos
    if (missed + 1 >= 3) {
      setGameOver(true); // Fim de jogo quando o jogador perder 3 botões
    } else {
      resetButton(); // Reseta o botão com nova posição
    }
  };

  // Função que reseta o botão e reinicia o timer
  const resetButton = () => {
    setButtonPosition(generateRandomPosition()); // Gera nova posição para o botão
    clearTimeout(timer); // Limpa o timer anterior
    const newTimer = setTimeout(handleButtonDisappear, 2000); // O botão desaparecerá após 2 segundos
    setTimer(newTimer); // Atualiza o timer
  };

  // Função para reiniciar o jogo
  const restartGame = () => {
    setScore(0); // Reseta a pontuação
    setMissed(0); // Reseta os erros
    setGameOver(false); // Reseta o estado de game over
    setButtonPosition(generateRandomPosition()); // Gera nova posição para o botão
    clearTimeout(timer); // Limpa o timer
    const newTimer = setTimeout(handleButtonDisappear, 2000); // Inicia o timer de novo
    setTimer(newTimer); // Atualiza o timer
  };

  useEffect(() => {
    if (!gameOver) {
      resetButton(); // Inicializa o botão ao iniciar o jogo
    }
    return () => clearTimeout(timer); // Limpa o timer quando o componente for desmontado
  }, [gameOver]);

  return (
    <View style={styles.container}>
      <Text style={styles.score}>Pontos: {score}</Text>
      <Text style={styles.missed}>Erros: {missed}/3</Text>
      
      {gameOver && <Text style={styles.gameOver}>Game Over!</Text>}

      {/* Botão de reiniciar que aparece após o game over */}
      {gameOver && (
        <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
          <Text style={styles.restartButtonText}>Reiniciar Jogo</Text>
        </TouchableOpacity>
      )}

      {/* A área fora do botão */}
      <TouchableWithoutFeedback onPress={handleAreaPress}>
        <View style={styles.background} />
      </TouchableWithoutFeedback>

      {/* O botão (a bolinha) */}
      <TouchableOpacity
        style={[
          styles.button,
          { top: buttonPosition.y, left: buttonPosition.x },
        ]}
        onPress={handleButtonPress} // Chama a função quando o botão for tocado
        disabled={gameOver} // Desabilita o botão se o jogo acabou
      >
        <Text style={styles.buttonText}>Toque aqui!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
  },
  score: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  missed: {
    fontSize: 20,
    marginBottom: 20,
  },
  button: {
    position: 'absolute',
    width: 100,
    height: 100,
    backgroundColor: '#ff6347',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50, // Botão arredondado
    zIndex: 1,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  gameOver: {
    fontSize: 30,
    color: 'red',
    fontWeight: 'bold',
    marginTop: 30,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
  },
  restartButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#32cd32',
    borderRadius: 5,
  },
  restartButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default App;
