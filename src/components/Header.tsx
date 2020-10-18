import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { BorderlessButton } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <View style={styles.container}>
      <BorderlessButton onPress={() => {}}>
        <Feather name="arrow-left" size={24} color="#15b6d6" />
      </BorderlessButton>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 44,
    backgroundColor: "#f9fafc",
    borderBottomWidth: 1,
    borderColor: "#dde3f0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontFamily: "Nunito_600SemiBold",
    color: "#87a7b3",
    fontSize: 16,
  },
});