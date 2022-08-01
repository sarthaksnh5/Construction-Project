import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  GreyFill,
  GreyStroke,
  GreyText,
  hitLink,
  TextColor,
} from '../../../constants/colors';
import FullScreenLoading from '../../../components/FullScreenLoading';
import {useFocusEffect} from '@react-navigation/native';
import {getData} from '../../../components/AsyncStorageHelpers';
import {userData} from '../../../constants/StorageHelpers';
import Background from '../../../components/Background';

const ChatRoom = ({navigation}) => {
  const [messages, setMessages] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const messagesChat = (chatID, projectName) => {
    const data = {chat: chatID, project: projectName};
    navigation.navigate('IndividualChat', data);
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => messagesChat(item.id, item.project)}
      style={styles.container}>
      <View style={styles.groupContainer}>
        <FontAwesome name="group" size={24} color={GreyText} />
      </View>
      <View style={styles.innerContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.groupName}>{item.project}</Text>
          <Text style={styles.dateColor}>{item.date}</Text>
        </View>
        <View style={styles.messageContainer}>
          <Ionicons name="checkmark" size={18} color="black" />
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.message}>
            {item.message}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const getChatRooms = async () => {
    await getData(userData).then(async resp => {
      const {id, type} = resp;
      let url = '';
      if (type == '0') {
        url = `${hitLink}/project/message?filter=all`;
      } else {
        url = `${hitLink}/project/message?filter=chats&user=${id}`;
      }

      await fetch(url, {
        method: 'GET',
      })
        .then(respon => {
          respon
            .json()
            .then(response => {
              const {result, message} = response;
              if (result) {
                setMessages(message);
                setIsLoading(false);
              } else {
                setIsLoading(false);
                console.log(message);
              }
            })
            .catch(e => {
              console.log(e);
              setIsLoading(false);
            });
        })
        .catch(e => {
          console.log(e);
          setIsLoading(false);
        });
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      getChatRooms();
    }, []),
  );

  if (isLoading) {
    return <FullScreenLoading />;
  }

  return (
    <Background>
      {messages != null && (
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      )}
    </Background>
  );
};

export default ChatRoom;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    padding: 2,
    borderColor: GreyStroke,
    borderRadius: 5,
    marginBottom: 20,
  },
  groupContainer: {
    width: '14%',
    height: 50,
    backgroundColor: GreyFill,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: GreyStroke,
    borderWidth: 2,
  },
  innerContainer: {
    width: '83%',
    marginLeft: 4,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupName: {
    fontSize: 18,
    color: TextColor,
    fontFamily: 'ReemKufi-SemiBold',
  },
  dateColor: {
    fontSize: 12,
    color: TextColor,
    fontFamily: 'ReemKufi-Regular',
  },
  message: {
    fontSize: 12,
    color: TextColor,
    fontFamily: 'ReemKufi-Regular',
  },
});
