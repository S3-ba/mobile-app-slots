import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SYMBOLS = ['🍒', '🍋', '🍇', '💎', '7️⃣'];

export default function SlotMachineApp() {
  const [balance, setBalance] = useState<number>(1000);
  const [bet, setBet] = useState<number>(50);
  const [reels, setReels] = useState<string[]>(['💎', '7️⃣', '💎']);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('Ustaw stawkę i zakręć!');

  // Zmiana stawki (mnożnik 0.5x lub 2x)
  const adjustBet = (factor: number) => {
    if (isSpinning) return;
    setBet((prev) => {
      const newBet = Math.round(prev * factor);
      if (newBet < 10) return 10; // Minimalna stawka
      return newBet;
    });
  };

  const spin = () => {
    if (isSpinning) return;
    if (balance < bet) {
      setMessage('❌ Brak wystarczających środków!');
      return;
    }

    // Pobranie stawki
    setBalance((prev) => prev - bet);
    setIsSpinning(true);
    setMessage('🎰 Losowanie...');

    // Efekt animacji – przeskakiwanie symboli
    let counter = 0;
    const interval = setInterval(() => {
      setReels([
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      ]);
      counter++;

      // Po 15 przeskokach zatrzymujemy bębny i ustalamy wynik
      if (counter > 15) {
        clearInterval(interval);
        
        const final1 = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        const final2 = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        const final3 = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

        setReels([final1, final2, final3]);
        setIsSpinning(false);

        // Logika wygranej
        if (final1 === final2 && final2 === final3) {
          let multiplier = 5;
          if (final1 === '💎') multiplier = 10;
          if (final1 === '7️⃣') multiplier = 25;

          const winAmount = bet * multiplier;
          setBalance((prev) => prev + winAmount);
          setMessage(`🔥 MEGA WYGRANA! 3x ${final1}! +${winAmount} zł!`);
        } else if (final1 === final2 || final2 === final3 || final1 === final3) {
          const smallWin = Math.round(bet * 1.5);
          setBalance((prev) => prev + smallWin);
          setMessage(`✨ Trafiono parę! Wygrywasz +${smallWin} zł.`);
        } else {
          setMessage('❌ Brak wygranej. Spróbuj ponownie!');
        }
      }
    }, 80); // Czas trwania jednego "kroku" animacji w milisekundach
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🎰 SLOTS 🎰</Text>

      {/* Wyświetlacz Salda */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>TWÓJ PORTFEL</Text>
        <Text style={styles.balanceValue}>{balance} zł</Text>
      </View>

      {/* Ekran bębnów */}
      <View style={styles.slotFrame}>
        <View style={styles.reelsContainer}>
          {reels.map((symbol, index) => (
            <View key={index} style={[styles.reelBox, isSpinning && styles.reelSpinning]}>
              <Text style={styles.symbolText}>{symbol}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Komunikat o wyniku */}
      <View style={styles.messageBox}>
        <Text style={styles.messageText}>{message}</Text>
      </View>

      {/* Panel stawki ze strzałkami */}
      <View style={styles.betControlContainer}>
        <Text style={styles.betLabel}>STAWKA:</Text>
        <View style={styles.betRow}>
          <TouchableOpacity
            style={[styles.adjustButton, isSpinning && styles.disabledButton]}
            onPress={() => adjustBet(0.5)}
            disabled={isSpinning}
          >
            <Text style={styles.adjustButtonText}>« 0.5x</Text>
          </TouchableOpacity>

          <View style={styles.betDisplay}>
            <Text style={styles.betValueText}>{bet} zł</Text>
          </View>

          <TouchableOpacity
            style={[styles.adjustButton, isSpinning && styles.disabledButton]}
            onPress={() => adjustBet(2)}
            disabled={isSpinning}
          >
            <Text style={styles.adjustButtonText}>2x »</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Przycisk Zakręć */}
      <TouchableOpacity
        style={[styles.spinButton, isSpinning && styles.spinButtonDisabled]}
        onPress={spin}
        disabled={isSpinning}
      >
        <Text style={styles.spinButtonText}>
          {isSpinning ? 'KRĘCENIE...' : `ZAKRĘĆ (${bet} zł)`}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#ff007f',
    letterSpacing: 2,
    marginBottom: 20,
    textShadowColor: '#ff007f',
    textShadowRadius: 10,
  },
  balanceCard: {
    backgroundColor: '#1a1a2e',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#00f0ff',
    alignItems: 'center',
    marginBottom: 25,
  },
  balanceLabel: {
    color: '#8a8aab',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  balanceValue: {
    color: '#00f0ff',
    fontSize: 34,
    fontWeight: 'bold',
  },
  slotFrame: {
    backgroundColor: '#161626',
    padding: 15,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ff007f',
    marginBottom: 20,
  },
  reelsContainer: {
    flexDirection: 'row',
  },
  reelBox: {
    width: 85,
    height: 95,
    backgroundColor: '#0a0a12',
    borderRadius: 12,
    marginHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffd700',
  },
  reelSpinning: {
    borderColor: '#ff007f',
    opacity: 0.8,
  },
  symbolText: {
    fontSize: 44,
  },
  messageBox: {
    height: 45,
    justifyContent: 'center',
    marginBottom: 15,
  },
  messageText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  betControlContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  betLabel: {
    color: '#8a8aab',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  betRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adjustButton: {
    backgroundColor: '#252542',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ff007f',
  },
  adjustButtonText: {
    color: '#ff007f',
    fontWeight: 'bold',
    fontSize: 16,
  },
  betDisplay: {
    minWidth: 100,
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  betValueText: {
    color: '#ffd700',
    fontSize: 22,
    fontWeight: 'bold',
  },
  spinButton: {
    backgroundColor: '#ff007f',
    paddingVertical: 16,
    paddingHorizontal: 45,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  spinButtonDisabled: {
    backgroundColor: '#552244',
    borderColor: '#888',
  },
  disabledButton: {
    opacity: 0.4,
  },
  spinButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});