import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import img from '../../assets/job.png';
import { db } from '../config/firebase'; 
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useNavigation,useRoute } from "@react-navigation/native";


const JobOverview = ({ vehicleImage }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const {name } = route.params;
  const handleUpdateStatusPress = () => {
    
  navigation.navigate("JobStatusUpdate",{name:name});
  };
  const [data, setData] = useState({});
  const [id,setId] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("jobover",name)
        const requestCollection = collection(db, "request"); 
        const q = query(
          requestCollection,
          where("mainStatus", "==", "Ongoing"), 
          where("macName", "==", name) 
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          setData(doc.data());
          setId(doc.id)
        }
      } catch (error) {
        console.error("Error retrieving documents: ", error);
      }
    };

    fetchData();
  }, []);
console.log(data);
  const handlePress = () => {
    console.log(id);
    navigation.navigate("Home", { Requestid: id });

};

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <Text style={styles.pageHeader}>Job Overview</Text>
      <View style={styles.container}>
        <View style={styles.subHeader}>
          <Text style={styles.subHeaderText}>Username : {data.username}</Text>
        </View>
       
        <View style={styles.subHeader}>
          <Text style={styles.boldText}>Location : {data.location}</Text>
        </View>
        <Image source={img} style={styles.image} />
        <Text style={styles.grayText}>Vehicle Information</Text>
        <View style={styles.compactBoxContainer}>
          <View style={styles.compactBox}>
          <Text style={styles.centerText}>Number</Text>
            <Text style={styles.centerText}>{data.vehicleNo}</Text>
            
          </View>
          <View style={styles.compactBox}>
          <Text style={styles.centerText}>Model</Text>
            <Text style={styles.centerText}>{data.vehicleModel}</Text>
            
          </View>
          <View style={styles.compactBox}>
          <Text style={styles.centerText}>Fuel Type</Text>
            <Text style={styles.centerText}>{data.powerSource}</Text>
            
          </View>
          
        </View>
        <Text style={styles.grayText}>Customer Information</Text>
        <View style={styles.boxContainer}>
          <View style={styles.largeBox}>
            <Text style={styles.justifyText}>{data.username}</Text>
          </View>
        </View>
        
        <Text style={styles.grayText}>Breakdown Description</Text>
        <View style={styles.bigBox}>
            <Text style={styles.justifyText}>{data.matter}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Text style={styles.startRideButton} onPress={handlePress}>Start Ride</Text>
          <Text style={styles.updateStatusButton} onPress={handleUpdateStatusPress}>Update Status</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  pageHeader: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  subHeader: {
    marginBottom: 10,
  },
  subHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  boldText: {
    fontWeight: 'bold',
  },
  image: {
    width: '80%',
    aspectRatio: 9 / 5,
    resizeMode: 'contain',
  },
  grayText: {
    color: 'gray',
    marginTop: 10,
    marginBottom: 10,
  },
  compactBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  compactBox: {
    width: 70,
    height: 70,
    backgroundColor: '#ffffe6',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EDAE10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  largeBox: {
    width: '100%',
    height: 40,
    backgroundColor: '#ffffe6',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EDAE10',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigBox: {
    width: '100%',
    height: 90,
    backgroundColor: '#ffffe6',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EDAE10',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  startRideButton: {
    backgroundColor: '#EDAE10',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
  },
  updateStatusButton: {
    backgroundColor: '#ffffe6',
    color: '#EDAE10',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#EDAE10',
    textAlign: 'center',
  },
  centerText: {
    textAlign: 'center',
  },
  justifyText: {
    textAlign: 'left',
  },
  
});

export default JobOverview;
