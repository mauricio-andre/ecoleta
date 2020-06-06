import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, ImageBackground, Image, StyleSheet, Text, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';

interface IBGEUFResponse {
  sigla: string,
};

interface IBGECityResponse {
  nome: string
};

interface PickerSelect {
  label: string,
  value: string,
}

const Home = () => {
  const navigation = useNavigation();
  const [ufs, setUfs] = useState<PickerSelect[]>([]);
  const [cities, setCities] = useState<PickerSelect[]>([]);
  const [selectedUf, setSelectedUf] = useState<string>('0');
  const [selectedCity, setSelectedCity] = useState<string>('0');

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
      const ufInitials = response.data.map(uf => ({
        label: uf.sigla,
        value: uf.sigla,
      }));

      setUfs(ufInitials);
    });
  }, []);

  useEffect(() => {
    if (selectedUf === '0') {
      setCities([]);
      return;
    }

    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
      const cityNames = response.data.map(city => ({
        label: city.nome,
        value: city.nome,
      }));

      setCities(cityNames);
    });
  }, [selectedUf]);

  function handleNavigateToPoints() {
    navigation.navigate('Points', {
      uf: selectedUf,
      city: selectedCity,
    });
  }

  return (
    <>
      <ImageBackground
        source={require('../../assets/home-background.png')}
        style={styles.container}
        resizeMode="contain"
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <RNPickerSelect
            onValueChange={(value: string) => setSelectedUf(value)}
            items={ufs}
            placeholder={{ label: 'Selecione a UF', value: '0' }}
            style={pickerStyle}
          />
          <RNPickerSelect
            onValueChange={(value: string) => setSelectedCity(value)}
            items={cities}
            placeholder={{ label: 'Selecione a cidade', value: '0' }}
            style={pickerStyle}
          />

          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Icon name="arrow-right" color="#fff" size={24} />
            </View>
            <Text style={styles.buttonText}>
              Entrar
            </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </>
  );
}

const pickerStyle = {
	inputIOS: {
		height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    fontSize: 16,
	},
	inputAndroid: {
		height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    fontSize: 16,
	},
  underline: {
    borderTopWidth: 0,
  },
  icon: {
    borderLeftWidth: 0,
    borderLeftColor: 'transparent',
    borderTopWidth: 2,
    borderTopColor: 'gray',
    borderRightWidth: 2,
    borderRightColor: 'gray',
    width: 9,
    height: 9,
    right: 15,
    top: 25,
    transform: [{ translateY: 8 }, { rotate: '135deg' }],
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;
