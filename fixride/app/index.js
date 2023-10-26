import * as React from "react";
import { SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5 } from "@expo/vector-icons";
import { firebase } from "../src/config/firebase";
import CateCard from "../src/components/CateCard";
import Login from "../src/components/History/Login";
import Registration from "../src/components/History/Registration";
import DisplayContent from "../app/cat_list/[id]";
import Status from "../app/status/[id]";
import MecRequestDetails from "../app/payment/[id]";
import MecRequestDetail from "../app/req_details/[id]";
import GarageInfo from "../app/garage_info/[id]";
import Form from "../app/form/[id]";
import ComRequestDetail from "../app/com_details/[id]";
import CanRequestDetail from "../app/can_details/[id]";
import OngoingRequestDetail from "../app/ongoing_details/[id]";
import LoadingScreen from "../src/components/History/LoadingScreen";
import ChooseLocation from "../src/components/History/ChooseLocation";
import Home from "../src/components/History/Home";
import TrackLive from "../src/components/History/TrackLive";
import MyActivity from "../src/components/History/MyActivity";
import Test from "../src/components/text";
import GarageMngrDash from "../src/components/GarageMngrDash";
import ManagerStatus from "../app/mngrside_status/[id]";
import AvailableMac from "../app/mac-list/[id]";
import AddMechanic from "../src/components/AddMechanic";
 import ReqList from "../src/components/ReqList";
 import Ongoings from "../src/components/Ongoings";
 import MechanicList from "../src/components/MechanicList";
 import AddGarage from "../src/components/AddGarage";
import ReqStatusGMside from "../src/components/ReqStatusGMside";
import MechHome from "../src/components/MechHome";
import Job from "../src/components/Job";
import JobOverview from "../src/components/JobOverview";
import JobStatusUpdate from "../src/components/JobStatusUpdate";
import Report from "../src/components/Report";
import MechStatusUpdate from "../src/components/MechStatusUpdate";
import Dashboard from "../src/components/History/Dashboard";
import Feedback from "../src/components/History/Feedback"


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// function HomeScreen() {
//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
//       <CateCard />
//     </SafeAreaView>
//   );
// }

// function SettingsScreen() {
//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
//       {/* Your settings screen content */}
//     </SafeAreaView>
//   );
// }

export const navigationRef = React.createRef();

function App() {
  const [initializing, setInitializing] = React.useState(true);

  const [user, setUser] = React.useState(null);

  const [userType, setUserType] = React.useState(null);

  React.useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);

    return subscriber; // Unsubscribe when component unmounts
  }, []);

  function onAuthStateChanged(user) {
    setUser(user);

    if (user) {
      // Fetch user data and userType here

      firebase
        .firestore()
        .collection("users")

        .doc(user.uid)

        .get()

        .then((snapshot) => {
          if (snapshot.exists) {
            const userData = snapshot.data();

            const userType = userData.userType;

            // Set userType in state

            console.log(userType);

            setUserType(userType);

            // Navigate based on userType here

            if (userType === "User") {
              navigationRef.current.navigate("FIXRIDE");
            } else if (userType === "Garage Owner") {
              navigationRef.current.navigate("GarageMngrDash");
            } else if (userType === "Mechanic") {
              navigationRef.current.navigate("MechHome");
            }
          }
        })

        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }

    setInitializing(false);
  }

  if (initializing) {
    return <LoadingScreen />;
  }
  return (
    <NavigationContainer ref={navigationRef}>
      {user ? (
        userType === "User" ? (
          <Stack.Navigator>
            <Stack.Screen name="FIXRIDE" component={HomeTabs} />

            <Stack.Screen name="MyActivity" component={MyActivity} />
            <Stack.Screen name="TrackLive" component={TrackLive} />
            <Stack.Screen name="CateCard" component={CateCard} />
            <Stack.Screen name="Feedback" component={Feedback} />

            <Stack.Screen
              name="CatList"
              component={DisplayContent}
              options={{
                title: `Title`,
              }}
            />
            <Stack.Screen
              name="Status"
              component={Status}
              options={{
                title: `Status`
              }}
            />

            <Stack.Screen
              name="Payment"
              component={MecRequestDetails}
              options={{
                title: `Payment`
              }}
            />

            <Stack.Screen
              name="Req_details"
              component={MecRequestDetail}
              options={{
                title: `Req_details`
              }}
            />

            <Stack.Screen
              name="Garage_info"
              component={GarageInfo}
              options={{
                title: `Garage_info`
              }}
            />

            <Stack.Screen
              name="Ongoing_details"
              component={OngoingRequestDetail}
              options={{
                title: `Ongoing_details `,
              }}
            />

            <Stack.Screen
              name="Com_details"
              component={ComRequestDetail}
              options={{
                title: `Com_details`
              }}
            />

            <Stack.Screen
              name="Can_details"
              component={CanRequestDetail}
              options={{
                title: `Can_details`
              }}
            />

            <Stack.Screen
              name="Form"
              component={Form}
              options={{
                title: `Form`
              }}
            />

            {/* <Stack.Screen name="UserScreen1" component={UserScreen1} /> */}
          </Stack.Navigator>
        ) : userType === "Garage Owner" ? (
          <Stack.Navigator>
            <Stack.Screen name="GarageMngrDash" component={GarageMngrDash} />
            <Stack.Screen name="AddMechanic" component={AddMechanic} />
            <Stack.Screen name="ReqList" component={ReqList} />
            <Stack.Screen name="Ongoings" component={Ongoings} />
            <Stack.Screen name="MechanicList" component={MechanicList} />
            <Stack.Screen name="AddGarage" component={AddGarage} />
            <Stack.Screen name="ReqStatusGMside" component={ReqStatusGMside} />

            <Stack.Screen
              name="Manager_Status"
              component={ManagerStatus}
              options={{
                title: `Manager_Status`
              }}
            />

            <Stack.Screen
              name="MacList"
              component={AvailableMac}
              options={{
                title: `MacList`
              }}
            />
          </Stack.Navigator>
        ) : userType === "Mechanic" ? (
          <Stack.Navigator>
            <Stack.Screen name="MechHome" component={MechHome} />
            <Stack.Screen name="Job" component={Job} />
            <Stack.Screen name="JobOverview" component={JobOverview} />
            <Stack.Screen name="JobStatusUpdate" component={JobStatusUpdate} />
            <Stack.Screen name="Report" component={Report} />
            <Stack.Screen
              name="MechStatusUpdate"
              component={MechStatusUpdate}
            />
            <Stack.Screen name="Home" component={Home} />

            <Stack.Screen name="ChooseLocation" component={ChooseLocation} />

            {/* Define other Mechanic related screens */}
          </Stack.Navigator>
        ) : (
          // Handle any other user type here

          <LoadingScreen />
        )
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Login" component={Login} />

          <Stack.Screen name="Registration" component={Registration} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
  }
// Define the Tab Navigator separately
function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home"; // Use the home icon here
          } else if (route.name === "Tasks") {
            iconName = "clipboard"; // Use the clipboard icon here
          } else if (route.name === "User") {
            iconName = "user"; // Use the clipboard icon here
          }

          // Return the FontAwesome5 icon
          return <FontAwesome5 name={iconName} size={size} color={color} />;
        },
        headerShown:false
      })}
    >
      <Tab.Screen name="Home" component={CateCard} />
      <Tab.Screen name="Tasks" component={MyActivity} />
      <Tab.Screen name="User" component={Dashboard} />
    </Tab.Navigator>
  );
}

export default App;

