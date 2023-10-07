/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DataTable, TextInput } from 'react-native-paper';
import Loader from './Loader';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert
} from 'react-native';
import axios from 'axios';




interface UserData {
  name: string;
  lastname: string;
  number: string; // Add the 'number' property
  coin: number;
  subject: string;
}

function App(): JSX.Element {
  const [data, setData] = useState<UserData[]>([]); // Specify the UserData type
  const [total, setTotal] = useState<number>(0); // Specify the number type
  const [number, setNumber] = useState<string>(""); // Specify the string type
  const [isLoading, setLoading] = useState<boolean>(true); // Specify the boolean type
  const [isNumber, setIsNumber] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<boolean>(false);
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get<UserData[]>('https://coin21.uz/auth/get');
      const savedNumber = await AsyncStorage.getItem('userNumber');
      // console.log("num: ", savedNumber)
      const filteredData = response.data.filter(user => user.number == savedNumber);
      // console.log("filtered: ", filteredData)
      setData(filteredData);
      setLoading(false);

    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const fetchDataandPutnumber = async () => {
    if (number.length !== 9) {
      Alert.alert("Raqamlar 9 xonalik bo'lishi kerak, misol 93 000 0000")
    } else {
      setLoading(true);
      try {
        const response = await axios.get<UserData[]>('https://coin21.uz/auth/get'); // Specify the response data type
        const filteredData = response.data.filter(user => user.number == number);

        if (filteredData.length < 1) {
          setNotFound(true)
          const fetchDataWithDelay = async () => {
            setTimeout(() => {
              setNotFound(false);
              fetchData();
            }, 3000);
          };
          fetchDataWithDelay();
        } else {
          await AsyncStorage.setItem('userNumber', number);
        }

        setData(filteredData);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }


  };

  const getStorage = async () => {
    try {
      const savedData = await AsyncStorage.getItem('userNumber');
      if (savedData !== null) {
        setIsNumber(true); // Fix the typo in serIsNumber
        // console.log('Retrieved data:', savedData);
      } else {
        console.log('No data found.');
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  };

  useEffect(() => {
    const totalCoin = () => {
      const coinSum = data.reduce((sum, user) => sum + user.coin, 0);
      setTotal(coinSum);
    };
    getStorage();
    if (data.length) {
      totalCoin();
    } else {
      setTotal(0);
    }
  }, [data]);

  useEffect(() => {
    const fetchDataWithDelay = async () => {
      setTimeout(() => {
        fetchData();
      }, 1000);
    };

    fetchDataWithDelay();
  }, []);


  return (
    <View style={styles.container}>
      {/* <Button style={styles.changeName} title="Nomerni almashtirish" onPress={""} /> */}
      <TouchableOpacity
        onPress={() => setIsNumber(!isNumber)}
        disabled={isLoading}
        style={styles.changeName}
      >
        <Text style={styles.buttonText}>Raqamni almashtirish</Text>
      </TouchableOpacity>

      {notFound ? <Text style={styles.textTop}> Bu raqamda o`quvchi yo'q</Text> : <></>}

      <Image
        style={styles.logo}
        source={require('./images/logo.png')}
      />
      <Text style={styles.topText}>Algoritm coin</Text>


      {isLoading ? <Loader /> : <></>}


      {!isNumber ? <>
        <Text style={styles.header}>Nomer orqali qidiring!</Text>
        <View style={styles.clientWatch}>
          <View style={styles.wrap}>
            <Text style={styles.prefix}>+998</Text>
            <TextInput
              onChangeText={(text) => setNumber(text)}
              placeholder='raqamingizni kiriting'
              keyboardType='numeric'
              style={styles.input}
              value={number}
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={fetchDataandPutnumber}
          disabled={isLoading}
          style={styles.checkBtn}
        >
          <Text style={styles.buttonText}>Ko'rish</Text>
        </TouchableOpacity>
      </> :
        <>
          {
            isLoading ? (
              <Loader />
            ) : (
              <>
                <Text style={styles.textTop}>Barcha coinlar: {total} </Text>
                <Text style={styles.textName}>{data[0]?.name}  {data[0]?.lastname} </Text>

                {!notFound ?
                  <DataTable style={styles.containerTable}>
                    <DataTable.Header style={styles.tableHeader}>
                      <DataTable.Title>Fani</DataTable.Title>
                      <DataTable.Title>Coin</DataTable.Title>
                    </DataTable.Header>
                    <DataTable.Row>
                      <DataTable.Cell>{data[0]?.subject?.toUpperCase()}</DataTable.Cell>
                      <DataTable.Cell>{data[0]?.coin}</DataTable.Cell>
                    </DataTable.Row>
                    {data[1] ? <DataTable.Row>
                      <DataTable.Cell>{data[1]?.subject?.toUpperCase()}</DataTable.Cell>
                      <DataTable.Cell>{data[1]?.coin}</DataTable.Cell>
                    </DataTable.Row> : <></>}
                    {data[2] ? <DataTable.Row>
                      <DataTable.Cell>{data[2]?.subject?.toUpperCase()}</DataTable.Cell>
                      <DataTable.Cell>{data[2]?.coin}</DataTable.Cell>
                    </DataTable.Row> : <></>}

                  </DataTable> : <></>}
                <TouchableOpacity
                  onPress={fetchData}
                  disabled={isLoading}
                  style={styles.checkBtn}
                >
                  <Text style={styles.buttonText}>Yangilash</Text>
                </TouchableOpacity>
              </>
            )
          }
        </>
      }
    </View >


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    marginTop: 50,
    padding: 15,

  },
  logo: {
    borderRadius: 4,
    // borderWidth: 2,
    width: 100,
    height: 100,
    marginTop: 50
  },
  header: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
  },
  topText: {
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
    fontSize: 30,
    fontWeight: 'bold',
  },
  clientWatch: {
    marginVertical: 20,
  },
  wrap: {
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: "center",
    height: 40,
    width: 300,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "green",
    overflow: "hidden"
  },
  prefix: {
    fontSize: 20,
    marginLeft: 10
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 5,
    padding: 5,
    backgroundColor: "white"
  },
  changeName: {
    width: 200,
    borderColor: "green",
    borderWidth: 2
  },
  button: {
    backgroundColor: 'green',
    borderRadius: 5,
    padding: 10,
    width: 200,
    alignItems: 'center'
  },
  buttonText: {
    color: 'green',
    padding: 5,
    width: 200,
    textAlign: "center",
    fontSize: 18,
    borderRadius: 4,
  },
  checkBtn: {
    borderColor: "green",
    borderWidth: 2,
    borderRadius: 5,
    padding: 5,
    width: 200,
    alignItems: 'center',
    marginTop: 50
  },
  ChangeName: {
    backgroundColor: 'green',
    borderRadius: 5,
    padding: 5,
    width: 200,
    alignItems: 'center',
    marginBottom: 30
  },
  displayText: {
    marginTop: 40,
    fontSize: 30
  },
  textTop: {
    display: "flex",
    fontSize: 30,
    marginTop: 20,
    fontWeight: "700",
    color: "red"
  },
  textName: {
    display: "flex",
    fontSize: 24,
    marginTop: 20,
    marginBottom: 20,
    fontWeight: "700"
  },
  containerTable: {
    padding: 15,
    borderRadius: 10,
    // borderColor: "green",
    // borderWidth: "2px",
    // borderStyle: "solid",
  },
  tableHeader: {
    backgroundColor: '#DCDCDC',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    // borderWidth: "2px",
    // borderStyle: "solid",
  },
});

export default App;
