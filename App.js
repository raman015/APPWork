import { React, useState, useEffect } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

export default function App() {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState('');
  const [convertAmount, setConvertAmount] = useState(null);
  const [rates, setRates] = useState({});

  const API_URL = `https://v6.exchangerate-api.com/v6/560a84e9f952987e607f6616/latest/USD`;

  const FetchCurrencies = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (data.result === 'success') {
        setCurrencies(Object.keys(data.conversion_rates));
        setRates(data.conversion_rates);
      } else {
        Alert.alert('Error', 'Failed to fetch currencies list');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch exchange rates');
    }
  };

  const ConvertCurrency = () => {
    if (!amount) {
      Alert('Error', 'Please enter an amount');
      return;
    }

    if (!rates[fromCurrency] || !rates[toCurrency]) {
      Alert('Error', 'Invalid currency selection');
      return;
    }

    const rate = rates[toCurrency] / rates[fromCurrency];
    setConvertAmount((amount * rate).toFixed(2));
  };

  useEffect(() => {
    FetchCurrencies();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Currency Converter</Text>

      <RNPickerSelect
        onValueChange={(value) => setFromCurrency(value)}
        items={currencies.map((currency) => ({
          label: currency,
          value: currency,
        }))}
        placeholder={{ label: 'Select from currency', value: null }}
        value={fromCurrency}
      />

      <TextInput
        value={amount}
        placeholder="Enter Your Amount"
        keyboardType="numeric"
        onChangeText={setAmount}
        style={styles.input}
      />

      <RNPickerSelect
        onValueChange={(value) => setToCurrency(value)}
        items={currencies.map((currency) => ({
          label: currency,
          value: currency,
        }))}
        placeholder={{ label: 'Select to currency', value: null }}
        value={toCurrency}
      />

      <Text style={styles.convertedText}>
        Converted Amount :{convertAmount != null ? convertAmount : '--'}
      </Text>

      <TouchableOpacity style={styles.button} onPress={ConvertCurrency}>
        <Text style={styles.buttonText}>Convert</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    padding:20,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 20,
    backgroundColor: '#f5f5f5f5',
    textAlign:"center"
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: '10',
    paddingVertical: '10',
    marginTop: 10,
    marginBottom: 10,
    paddingStart: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: 'blue',
    padding: 12,
    borderRadius: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: '18',
    fontWeight: 'bold',
  },
  convertedText: {
    fontSize: 18,
    paddingVertical: 20,
    alignItems: 'center',
    textAlign: 'center',
  },
});
