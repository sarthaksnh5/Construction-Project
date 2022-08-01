import {StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import Background from '../../../components/Background';

const SingleChat = () => {
  const [messages, setMessages] = useState(null);
  return <Background>{messages != null && <Text>Messges</Text>}</Background>;
};

export default SingleChat;

const styles = StyleSheet.create({});
