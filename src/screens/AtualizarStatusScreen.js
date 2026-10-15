import React, { useState } from 'react';
import { View, Text, TextInput, Button, Switch, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../services/api';

export default function AtualizarStatusScreen() {
  const [codigo, setCodigo] = useState('');
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');

  const atualizarStatus = async () => {
    setMensagemSucesso('');
    setMensagemErro('');

    if (!codigo.trim()) {
      setMensagemErro('Por favor, escreve o código do sensor (ex: s1).');
      return;
    }

    setLoading(true);
    try {
      const response = await api.put('/sensor/status/atualizar', {
        codigo: codigo.trim(),
        status: status,
      });

      setMensagemSucesso(response.data?.message || 'Status atualizado com sucesso!');
    } catch (error) {
      console.log('Erro ao atualizar:', error);
      if (error.response) {
        setMensagemErro(`Erro ${error.response.status}: O servidor não conseguiu atualizar o sensor.`);
      } else if (error.request) {
        setMensagemErro('Erro de Ligação: Não foi possível alcançar o servidor (10.137.11.6).');
      } else {
        setMensagemErro(`Erro: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Atualizar Status</Text>

      <Text style={styles.label}>Código do Sensor:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: s1"
        value={codigo}
        onChangeText={setCodigo}
        autoCapitalize="none"
      />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Status (Ligado/Desligado):</Text>
        <Switch
          value={status}
          onValueChange={setStatus}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={status ? '#6200ee' : '#f4f3f4'}
        />
      </View>

      <Text style={styles.statusPreview}>
        Estado selecionado: <Text style={{ fontWeight: 'bold' }}>{status ? 'true (Ativo)' : 'false (Inativo)'}</Text>
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#6200ee" style={{ marginTop: 15 }} />
      ) : (
        <Button title="Guardar Status" onPress={atualizarStatus} color="#6200ee" />
      )}

      {mensagemSucesso ? (
        <View style={styles.successBox}>
          <Text style={styles.successText}>✅ {mensagemSucesso}</Text>
        </View>
      ) : null}

      {mensagemErro ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>⚠️ {mensagemErro}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, marginBottom: 5 },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ccc', marginBottom: 20 },
  switchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  statusPreview: { fontSize: 14, color: '#555', marginBottom: 25, textAlign: 'center' },
  successBox: { marginTop: 20, padding: 15, backgroundColor: '#e8f5e9', borderRadius: 8, borderLeftWidth: 4, borderLeftColor: '#2e7d32' },
  successText: { color: '#2e7d32', fontSize: 15, textAlign: 'center', fontWeight: 'bold' },
  errorBox: { marginTop: 20, padding: 15, backgroundColor: '#ffebee', borderRadius: 8, borderLeftWidth: 4, borderLeftColor: '#d32f2f' },
  errorText: { color: '#d32f2f', fontSize: 15, textAlign: 'center' },
});