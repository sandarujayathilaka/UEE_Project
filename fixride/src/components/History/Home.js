import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, Platform, Modal, Button } from 'react-native';
import MapView, { Marker, AnimatedRegion, Circle } from 'react-native-maps';
import { GOOGLE_MAP_KEY } from '../../constants/googleMapKey';
import imagePath from '../../constants/imagePath';
import MapViewDirections from 'react-native-maps-directions';
import Loader from './Loader';
import { locationPermission, getCurrentLocation } from '../../helper/helperFunction';
import { addDoc, collection, updateDoc, doc, getDocs, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useRoute } from "@react-navigation/native";
import CustomBtn from './CustomBtn';

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


const Home = ({ navigation }) => {
    const mapRef = useRef()
    const markerRef = useRef()
    const route=useRoute();
    const { Requestid } = route.params;
    let requestId = Requestid;
    console.log("requestId", requestId);
   

    //const [requestId,setId] = useState('');
    const [state, setState] = useState({
        curLoc: {
            latitude: 8.7542,
            longitude: 80.4982,
        },
        destinationCords: {},
        isLoading: true,
        coordinate: new AnimatedRegion({
            latitude: 8.7542,
            longitude: 80.4982,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        }),
        time: 0,
        distance: 0,
        heading: 0,
        isReached: false,

    })
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const { curLoc, time, distance, destinationCords, isLoading, coordinate,heading, isReached } = state
    const updateState = (data) => setState((state) => ({ ...state, ...data }));
    const [circleRadius, setCircleRadius] = useState(0); // Initial radius of the circle
    const [modalVisible, setModalVisible] = useState(false);
    useEffect(() => {
      // Call the function to handle the initial load
      onPressLocation();
    }, []);
    const handleSave = async (id,latitude,longitude) => {
        try {
          const trackingDb = collection(db, "tracking");
          const querySnapshot = await getDocs(trackingDb);
      
          let requestIdExists = false;
      
          // Iterate through the documents to check if requestId already exists
          querySnapshot.forEach((doc) => {
            const requestId = doc.data().requestId;
            console.log("hu",requestId);
            if (requestId === id) {
              requestIdExists = true;
              console.log("aa")
              updateCurrentLocationInDatabase(requestId,latitude, longitude);
            }
          });
      
          if (!requestIdExists) {
            // If requestId doesn't exist, add a new document
            console.log("w",destinationCords)
            await addDoc(trackingDb, {
              requestId: id,
              userLocation: destinationCords,
              mehanicLocation: curLoc,
              heading:heading,
            });
      
            console.log({
              type: 'success'
            });
          } else {
            console.log('Request ID already exists, updating location.');
          }
        } catch (error) {
          console.error('Failed to add:', error);
          console.log({
            type: 'error',
            
          });
        }
      };
      
      const checkReached = () => {
        console.log("rgfeached");
        console.log(destinationCords.latitude,curLoc.latitude);
        console.log(destinationCords.longitude,curLoc.longitude);
        if(isReached===false){
        if (
          destinationCords.latitude === curLoc.latitude &&
          destinationCords.longitude === curLoc.longitude
        ) {
          // Destination is reached
          console.log("reached");
          setModalVisible(true);
          setState((prevState) => ({ ...prevState, isReached: true }));
        }else{
            console.log("unreached");
        }
      }
      };

    useEffect(() => {
        getLiveLocation()
    }, [])

    useEffect(() => {
      const maxRadius = 500;
      const minRadius = 250;
      let increasing = true; // Indicates whether the radius is increasing
    
      const circleAnimationInterval = setInterval(() => {
        if (increasing) {
          // Increase the radius
          setCircleRadius((prevRadius) => {
            if (prevRadius < maxRadius) {
              return prevRadius + 50;
            } else {
              increasing = false;
              return prevRadius - 50;
            }
          });
        } else {
          // Decrease the radius
          setCircleRadius((prevRadius) => {
            if (prevRadius > minRadius) {
              return prevRadius - 50;
            } else {
              increasing = true;
              return prevRadius + 50;
            }
          });
        }
      }, 1000); // Adjust the interval as needed
    
      return () => clearInterval(circleAnimationInterval);
    }, []);
    
    

    useEffect(() => {
        checkReached();
      }, [curLoc, destinationCords]);

      const closeModal = () => {
        setState((prevState) => ({ ...prevState, isReached: true }));
        setModalVisible(false);
      };
      

      const confirmReached = async () => {
        // Handle confirming that destination is reached
        closeModal(); // Close the pop-up modal
        try {
          // Update the reachStatus attribute in the request collection
          const requestDb = collection(db, "request");
          const requestDocRef = doc(requestDb, requestId); // Assuming 'requestId' is the document ID for the request
          await updateDoc(requestDocRef, { reachStatus: "Reached" });
    
          console.log('Reach status updated in the request collection');
        } catch (error) {
          console.error('Failed to update reach status:', error);
        }
      };

    const onPressLocation = async() => {
       // navigation.navigate('ChooseLocation', { getCordinates: fetchValue })
       if (isInitialLoad) {
        console.log("latitude1");
        try {
          console.log("latitude5");
          const docRef = collection(db, "request");
          const doc = await getDocs(docRef);
      
          let foundDocumentRef = null; // Initialize to null
          console.log("did",doc);
          doc.forEach((doc1) => {
            console.log("id",id);
            const id = doc1.id;
            console.log("id",id);
                    console.log("eid",requestId);
            if (id === requestId) {
              console.log("Document found:", id);
              foundDocumentRef = doc1.ref; // Store the found DocumentReference
            }
          });
      
          if (foundDocumentRef) {
            // Retrieve the data from the DocumentReference
            const foundDocumentSnapshot = await getDoc(foundDocumentRef);
            if (foundDocumentSnapshot.exists()) {
              const { latitude, longitude } = foundDocumentSnapshot.data();
             console.log("users", latitude, longitude );
              await updateDoc(foundDocumentRef, { startStatus: "Started" });
              updateState({
                destinationCords: {
                  latitude:parseFloat(latitude),
                  longitude:parseFloat(longitude),
                },
                isLoading:false,
              });
              console.log("hhhr")
              const id = requestId;
             
              handleSave(id,latitude,longitude);
            } else {
              console.log('Document not found'); // Handle if the document does not exist
            }
          } else {
            console.log('Reference not found'); // Handle if the document does not exist
          }
      
          console.log("latitude4");
      
          
        } catch (error) {
          console.error(error);
          // Handle any errors that occur during fetching
        }
        setIsInitialLoad(false);
      }
      }

console.log(requestId);
const updateCurrentLocationInDatabase = async (requestId, latitude, longitude) => {
    const trackingDb = collection(db, "tracking");
    console.log("e")
    if (requestId) {
      try {
        console.log("f")
        const querySnapshot = await getDocs(trackingDb);
        let docToUpdate = null;
  
        // Iterate through the documents to find the one with matching requestId
        querySnapshot.forEach((doc) => {
          const docData = doc.data();
          if (docData.requestId === requestId) {
            docToUpdate = doc.ref;
            console.log("g")
          }
        });
  
        if (docToUpdate) {
          await updateDoc(docToUpdate, {
            mehanicLocation: {
              latitude,
              longitude,
            },
            heading:heading,
          });
          console.log('Current location updated in the database');
        } else {
          const id=requestId;
          handleSave(id,latitude,longitude)
        }
      } catch (error) {
        console.error('Failed to update current location in the database', error);
      }
    } else {
      console.error('requestId is empty or undefined');
    }
  };
  

    const getLiveLocation = async () => {
        const locPermissionDenied = await locationPermission()
        if (locPermissionDenied) {
            const { latitude, longitude, heading } = await getCurrentLocation()
            console.log("get live location after 4 second",heading,latitude,longitude)
             // latitude= 8.7542;
            //  longitude = 80.4982;
            console.log(latitude, longitude);
           // animate(latitude, longitude);
          
            animate(latitude, longitude);
            console.log("latitude", longitude);
            updateState({
                heading: heading,
                curLoc: { latitude, longitude },
                coordinate: new AnimatedRegion({
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA
                })
            });
           
            console.log("latitude", "longitude");
            updateCurrentLocationInDatabase(requestId,latitude, longitude);
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            getLiveLocation()
        }, 10000);
        return () => clearInterval(interval)
    }, [])
//
   
    const animate = (latitude, longitude) => {
        const newCoordinate = { latitude, longitude };
        if (Platform.OS == 'android') {
            if (markerRef.current) {
                markerRef.current.animateMarkerToCoordinate(newCoordinate, 7000);
            }
        } else {
            coordinate.timing(newCoordinate).start();
        }
    }

    const onCenter = () => {
        mapRef.current.animateToRegion({
            latitude: curLoc.latitude,
            longitude: curLoc.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        })
    }

    const fetchTime = (d, t) => {
        updateState({
            distance: d,
            time: t
        })
    }

console.log("curLocfinal",curLoc)
console.log("desifinal",destinationCords)

    return (
        <View style={styles.container}>
 {modalVisible && ( // Display the pop-up modal when destination is reached
        <Modal transparent={true} visible={isReached}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>You have reached your destination!</Text>
              <View style={styles.modalButtons}>
                <Button title="Close" onPress={closeModal} />
                <Button title="Confirm" onPress={confirmReached} />
              </View>
            </View>
          </View>
        </Modal>
      )}

{isLoading ? ( // Show loading until destinationCords is available
        <Loader isLoading={isLoading} />
      ) : (
        <>
            {distance !== 0 && time !== 0 && (<View style={{ alignItems: 'center', marginVertical: 16 }}>
            <Text>
  Distance left: {distance < 1 ? `${(distance * 1000).toFixed(0)} m` : `${distance.toFixed(0)} km`}
</Text>
            <Text>
  Time left: {time < 1 ? `${(time * 60).toFixed(0)} sec` : `${time.toFixed(0)} min`}
</Text>
            </View>)}
            <View style={{ flex: 1 }}>
                <MapView
                    ref={mapRef}
                    style={StyleSheet.absoluteFill}
                    initialRegion={{
                        ...curLoc,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }}
                >

                    <Marker.Animated
                        ref={markerRef}
                        coordinate={coordinate}
                    >
                        <Image
                            source={imagePath.icBike}
                            style={{
                                width: 40,
                                height: 40,
                                transform: [{rotate: `${heading}deg`}]
                            }}
                            resizeMode="contain"
                        />
                        
                    </Marker.Animated>
                    <Circle
    center={{
      latitude: curLoc.latitude + 0.001, // Adjust based on the image size
      longitude: curLoc.longitude
    }}
    radius={circleRadius} // Controlled by state variable
    fillColor="rgba(0, 255, 0, 0.2)" // Fill color of the circle
  />
                    {Object.keys(destinationCords).length > 0 && (<Marker
                        coordinate={destinationCords}
                        image={imagePath.icGreenMarker}
                    />)}

                    {Object.keys(destinationCords).length > 0 && (<MapViewDirections
                        origin={curLoc}
                        destination={destinationCords}
                        apikey={GOOGLE_MAP_KEY}
                        strokeWidth={6}
                        strokeColor="red"
                        optimizeWaypoints={true}
                        onStart={(params) => {
                            console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                        }}
                        onReady={result => {
                            console.log(`Distance: ${result.distance*1000} km`)
                            console.log(`Duration: ${result.duration} min.`)
                            fetchTime(result.distance, result.duration),
                            console.log("rc",result.coordinates)
                                mapRef.current.fitToCoordinates(result.coordinates, {
                                    edgePadding: {
                                        // right: 30,
                                        // bottom: 300,
                                        // left: 30,
                                        // top: 100,
                                      
                                    },
                                    
                                });
                        }}
                        onError={(errorMessage) => {
                             console.log('GOT AN ERROR');
                        }}
                    />)}
                </MapView>
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0
                    }}
                    onPress={onCenter}
                >
                    <Image source={imagePath.greenIndicator} />
                </TouchableOpacity>
            </View>
            <View style={styles.bottomCard}>
                <Text>Customer is waiting for your service.</Text>
                
            </View>
            <Loader isLoading={isLoading} />
            </>
        )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bottomCard: {
        backgroundColor: 'white',
        width: '100%',
        padding: 30,
        alignItems:'center',
        borderTopEndRadius: 24,
        borderTopStartRadius: 24
    },
    inpuStyle: {
        backgroundColor: 'white',
        borderRadius: 4,
        borderWidth: 1,
        backgroundColor:'orange',
        
        alignItems: 'center',
        height: 48,
        justifyContent: 'center',
        marginTop: 16
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
      },
      modalText: {
        fontSize: 18,
        marginBottom: 10,
      },
      modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
      },
});

export default Home;
