import { View, Text } from 'react-native'
import React from 'react'
import RequestForm from '../../src/components/RequestForm'
import { useRoute } from "@react-navigation/native";

export default function Form() {

  //  const params = useGlobalSearchParams();
  //  const garageId = params.id;

   const route = useRoute();
   const { garageid,phone,firstname } = route.params;
   console.log("1", garageid);
   let garageId = garageid;
   console.log("2", garageId);

  //  const userLatitude = params.userLatitude
  //  const userLongitude = params. userLongitude
  const { userlatitude } = route.params;
  console.log("1", userlatitude);
  let userLatitude = userlatitude;
  console.log("2", userLatitude);

  const { userlongitude,garageName } = route.params;
  console.log("1", userlongitude);
  let userLongitude = userlongitude;
  console.log("2", userLongitude);

  return (
    <View>
      <RequestForm garageId={garageId} userLatitude={userLatitude} userLongitude={userLongitude} phone={phone} firstname={firstname} garageName={garageName} />
    </View>
  );
}