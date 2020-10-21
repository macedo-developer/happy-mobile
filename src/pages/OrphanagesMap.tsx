import React, { useState } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import * as Location from "expo-location";

import api from "../services/api";

import MapView, { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps";
import { Feather } from "@expo/vector-icons";

import mapMarkerImg from "../images/map-marker.png";
import { RectButton } from "react-native-gesture-handler";

interface OrphanageProps {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export default function OrphanagesMap() {
  const navigation = useNavigation();
  const [orphanages, setOrphanages] = useState<OrphanageProps[]>([]);
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });

  useFocusEffect(() => {
    (async () => {
      const { status } = await Location.requestPermissionsAsync();

      if (status !== "granted") {
        alert("Ops ... Permissão de localização negada!");
      }

      const { coords } = await Location.getCurrentPositionAsync({});
      setLocation({ latitude: coords.latitude, longitude: coords.longitude });
    })();

    api.get("/orphanages").then((response) => {
      setOrphanages(response.data);
    });
  });

  function handleNavigateToOrphanageDetails(id: number) {
    navigation.navigate("OrphanageDetails", { id });
  }

  function handleNavigateToCreateOrphanage() {
    navigation.navigate("SelectMapPosition");
  }

  if (location.latitude === 0) {
    return (
      <View>
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (location)
    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
          }}
        >
          {orphanages.map((orphanage) => {
            return (
              <Marker
                key={orphanage.id}
                icon={mapMarkerImg}
                calloutAnchor={{
                  x: 3.3,
                  y: 1,
                }}
                coordinate={{
                  latitude: orphanage.latitude,
                  longitude: orphanage.longitude,
                }}
              >
                <Callout
                  tooltip
                  onPress={() => handleNavigateToOrphanageDetails(orphanage.id)}
                >
                  <View style={styles.calloutContainer}>
                    <Text style={styles.calloutText}>{orphanage.name}</Text>
                  </View>
                </Callout>
              </Marker>
            );
          })}
        </MapView>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {orphanages.length} Orfanatos encontrados
          </Text>
          <RectButton
            style={styles.createOrphanageButton}
            onPress={handleNavigateToCreateOrphanage}
          >
            <Feather name="plus" size={20} color="#fff" />
          </RectButton>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  calloutContainer: {
    width: 160,
    height: 46,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 16,
    justifyContent: "center",
  },
  calloutText: {
    fontFamily: "Nunito_700Bold",
    color: "#0089a5",
    fontSize: 14,
  },
  footer: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 32,
    backgroundColor: "#fff",
    borderRadius: 20,
    height: 46,
    paddingLeft: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 3,
  },
  footerText: {
    fontFamily: "Nunito_700Bold",
    color: "#8fa7b3",
  },
  createOrphanageButton: {
    width: 46,
    height: 46,
    backgroundColor: "#15c3d6",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
