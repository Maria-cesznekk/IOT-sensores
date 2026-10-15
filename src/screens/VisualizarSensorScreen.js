import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../services/api';

export default function VisualizarSensorScreen() {
  const [codigo, setCodigo] = useState('');
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const buscarSensor = async () => {
    setErro('');
    setResultado(null);

    if (!codigo.trim()) {
      setErro('Por favor, digita o código do sensor (ex: s1).');
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(`/sensor/status/visualizar/${codigo.trim()}`);
      setResultado(response.data);
    } catch (error) {
      console.log('Erro na requisição:', error);
      if (error.response) {
        setErro(`Erro ${error.response.status}: Sensor não encontrado.`);
      } else {
        setErro('Erro de rede: O navegador bloqueou o pedido ou o IP está inacessível.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Procurar Sensor</Text>

      <TextInput
        style={styles.input}
        placeholder="Escreve o código (ex: s1)"
        value={codigo}
        onChangeText={setCodigo}
        autoCapitalize="none"
      />

      <Button title="Procurar" onPress={buscarSensor} color="#6200ee" />

      {loading && <ActivityIndicator size="large" color="#6200ee" style={{ marginTop: 20 }} />}

      {erro ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{erro}</Text>
        </View>
      ) : null}

      {resultado && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>Mensagem: {resultado.success}</Text>
          <Text style={styles.resultStatus}>
            Estado do Sensor:{' '}
            <Text style={{ fontWeight: 'bold', color: resultado.status === 1 ? 'green' : 'red' }}>
              {resultado.status === 1 ? 'LIGADO / ATIVO (1)' : 'DESLIGADO / INATIVO (0)'}
            </Text>
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ccc', marginBottom: 15 },
  resultBox: { marginTop: 25, padding: 15, backgroundColor: '#fff', borderRadius: 8, borderLeftWidth: 4, borderLeftColor: '#6200ee' },
  resultText: { fontSize: 16, marginBottom: 8 },
  resultStatus: { fontSize: 16 },
  errorBox: { marginTop: 20, padding: 15, backgroundColor: '#ffebee', borderRadius: 8, borderLeftWidth: 4, borderLeftColor: '#d32f2f' },
  errorText: { color: '#d32f2f', fontSize: 15, textAlign: 'center' },
});