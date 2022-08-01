import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React, {useState, useEffect} from 'react';
import Background from '../../../components/Background';
import Button from '../../../components/Button';
import FullScreenLoading from '../../../components/FullScreenLoading';
import { TextColor } from '../../../constants/colors';

const PaperScreen = () => {
  const initialList = [
    {
      id: 1,
      name: 'Quality Doc',
      url: 'url',
    },
    {
      id: 2,
      name: 'FAQs',
      url: 'url',
    },
    {
      id: 3,
      name: 'Our Policies',
      url: 'url',
    },
  ];

  const [documentList, setDocumentList] = useState(initialList);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
    // return () => {
    //   cleanup
    // };
  }, []);

  const RenderDocuments = documentList.map(item => {
    return (
      <View key={item.id} style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{item.name}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button text={'Download'} mode={'outlined'} />
        </View>
      </View>
    );
  });

  if (isLoading) {
    return <FullScreenLoading />;
  }

  return (
    <Background>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {documentList.length > 0 ? RenderDocuments : null}
      </ScrollView>
    </Background>
  );
};

export default PaperScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    width: '80%',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    elevation: 5,
    borderRadius: 25,
    padding: 5,
    marginBottom: 20,
  },
  textContainer: {
    width: '40%',
    padding: 5,
  },
  text: {
    fontFamily: 'ReemKufi-Bold',
    fontSize: 18,
    color: TextColor,
  },
  buttonContainer: {
    width: '60%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
