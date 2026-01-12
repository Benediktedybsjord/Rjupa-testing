import { Stack } from "expo-router"; 
import { StatusBar } from 'expo-status-bar'
import "../global.css";

export default function Layout() {
  return (
    <>
    <StatusBar style="auto"/>
    <Stack screenOptions={{ headerStyle: {backgroundColor: '#004aad'}, headerTintColor: '#fff', headerTitleStyle: {fontWeight: 'bold'} }}/>
    </>
  )
}