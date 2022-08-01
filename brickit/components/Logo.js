import { StyleSheet, Image } from 'react-native'
import React from 'react'

const Logo = () => {
  return (
    <Image source={require('../assets/figma/mainScreen.gif')} style={styles.image} />
  )
}

export default Logo

const styles = StyleSheet.create({
    image: {
        width: 120,
        height: 120,
        marginBottom: 8,
      },
})