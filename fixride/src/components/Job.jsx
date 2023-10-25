import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import img from '../../assets/job.png';
import { db } from '../config/firebase'; 
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useNavigation ,useRoute } from "@react-navigation/native";


const Job = ({ vehicleImage }) => {
  const navigation = useNavigation();
const route = useRoute();
const {name } = route.params;

  const handleViewMorePress = () => {

    navigation.navigate("JobOverview",{name:name});
  };

  const [data, setData] = useState({});
const [id,setId] = useState('');


  useEffect(() => {
    const fetchData = async () => {
      try {
       
        const requestCollection = collection(db, "request"); 
        const q = query(
          requestCollection,
          where("mainStatus", "==", "Ongoing"), 
          where("macName", "==", name) 
        );
console.log(q)
        
        const querySnapshot = await getDocs(q);

        // Check if there are documents in the result
        if (!querySnapshot.empty) {
          // If there are documents in the result, update the component state
          const doc = querySnapshot.docs[0]; // Assuming you want the first document
          setData(doc.data());
          setId(doc.id)
        }
      } catch (error) {
        console.error("Error retrieving documents: ", error);
      }
    };

    fetchData();
  }, []);

  const handlePress = () => {
      
      console.log(id);
      navigation.navigate("Home", { Requestid: id });

  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Image source={img} style={styles.image} />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Assigned Job</Text>
          <View style={styles.cardContainer}>
            <Text style={styles.text}>Customer Name: {data.username}</Text>
            <Text style={styles.text}>Vehicle Number:{data.vehicleNo} </Text>
            <Text style={styles.text}>Location: {data.location}</Text>
            {/* <Image source={{ uri: vehicleImage }} style={styles.vehicleImage} /> */}
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText} onPress={handleViewMorePress}>View More</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handlePress} style={styles.goButton}>
            <Text style={styles.buttonText}>Go</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};







const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: '80%',
    aspectRatio: 16 / 5,
    resizeMode: 'contain',
  },
  contentContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardContainer: {
    borderColor: '#EDAE10',
    borderWidth: 1,
    borderRadius: 10,
    padding: 20,
    marginTop: 40,
    width: '80%',
    alignItems: 'left', // You can change this to 'flex-start' for left alignment
  },
  text: {
    fontSize: 18,
  },
  vehicleImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#EDAE10',
    borderWidth: 1,
    borderColor: 'yellow',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    width: '100%', // Adjusted width to take up the full width of the card
    alignItems: 'center', // Centered within the card
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
  },
  goButton: {
    backgroundColor: '#EDAE10',
    borderWidth: 1,
    borderColor: 'yellow',
    borderRadius: 50,
    padding: 20,
    marginTop: 100,
  },
});

export default Job;