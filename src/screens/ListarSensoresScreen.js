import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../services/api';

export default function ListarSensoresScreen() {
  const [sensores, setSensores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const carregarSensores = async () => {
    setLoading(true);
    setErro('');
    try {
      // Rota exata confirmada pelo Swagger
      const response = await api.get('/sensor/status/listar');
      
      // Os dados estão dentro do campo 'data' da resposta
      const listaSensores = response.data?.data || [];
      setSensores(listaSensores);
    } catch (error) {
      console.log('Erro ao carregar lista:', error);
      if (error.response) {
        setErro(`Erro ${error.response.status}: Não foi possível obter os sensores.`);
      } else {
        setErro('Erro de ligação ao servidor (10.137.11.6).');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarSensores();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Sensores</Text>

      <Button title="Atualizar Lista" onPress={carregarSensores} color="#6200ee" />

      {loading && <ActivityIndicator size="large" color="#6200ee" style={{ marginTop: 20 }} />}

      {erro ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>⚠️ {erro}</Text>
        </View>
      ) : null}

      {!loading && !erro && sensores.length === 0 && (
        <Text style={styles.emptyText}>Nenhum sensor encontrado.</Text>
      )}

      <FlatList
        data={sensores}
        keyExtractor={(item, index) => item.codigo || index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Código: {item.codigo}</Text>
            <Text style={styles.cardInfo}>Tipo: {item.tipo}</Text>
            <Text style={styles.cardStatus}>
              Estado:{' '}
              <Text style={{ fontWeight: 'bold', color: item.status === 1 ? 'green' : 'red' }}>
                {item.status === 1 ? 'LIGADO / ATIVO (1)' : 'DESLIGADO / INATIVO (0)'}
              </Text>
            </Text>
          </View>
        )}
        style={{ marginTop: 15 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#666' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#e0e0e0' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cardInfo: { fontSize: 14, color: '#666', marginTop: 2 },
  cardStatus: { fontSize: 14, marginTop: 6 },
  errorBox: { marginTop: 20, padding: 15, backgroundColor: '#ffebee', borderRadius: 8, borderLeftWidth: 4, borderLeftColor: '#d32f2f' },
  errorText: { color: '#d32f2f', fontSize: 14, textAlign: 'center' },
});