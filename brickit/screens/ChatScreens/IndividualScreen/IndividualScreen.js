import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import Background from '../../../components/Background';
import FullScreenLoading from '../../../components/FullScreenLoading';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  BrandColor,
  GreyFill,
  hitLink,
  LightGreenText,
  TextColor,
} from '../../../constants/colors';
import {getData} from '../../../components/AsyncStorageHelpers';
import {userData} from '../../../constants/StorageHelpers';
import Button from '../../../components/Button';
import TextInput from '../../../components/TextInput';
import {launchImageLibrary} from 'react-native-image-picker';
import PhotoEditor from '@baronha/react-native-photo-editor';

const IndividualScreen = ({navigation, route}) => {
  const [userId, setUserId] = useState();
  const [chatMessages, setChatMessages] = useState([]);
  const [inputText, setInputText] = useState({value: '', error: ''});
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState({name: '', uri: '', type: ''});
  const [isSendLoading, setIsSendLoading] = useState(false);
  const yourRef = useRef(null);
  const chatId = route.params.chat;
  const [isLoading, setIsLoading] = useState(true);

  const renderItem = ({item}) => {
    console.log(item.photo);
    return (
      <>
        <View
          style={
            item.user_id == userId ? styles.yourMessage : styles.sendMessage
          }>
          <Text style={styles.user}>{item.user}</Text>
          {item.photo != `` && (
            <Image source={{uri: item.photo}} style={styles.image} />
          )}
          <Text style={styles.message}>{item.message}</Text>
          <Text style={styles.time}>{renderTimestamp(item.date)}</Text>
        </View>
      </>
    );
  };

  const getUserData = async () => {
    await getData(userData).then(resp => {
      const {id, type} = resp;
      setUserId(id);
    });
  };

  const renderTimestamp = timestamp => {
    let prefix = '';
    const timeDiff = Math.round(
      (new Date().getTime() - new Date(timestamp).getTime()) / 60000,
    );
    if (timeDiff < 2) {
      // less than one minute ago
      prefix = 'just now...';
    } else if (timeDiff < 60 && timeDiff > 1) {
      // less than sixty minutes ago
      prefix = `${timeDiff} minutes ago`;
    } else if (timeDiff < 24 * 60 && timeDiff > 60) {
      // less than 24 hours ago
      prefix = `${Math.round(timeDiff / 60)} hours ago`;
    } else if (timeDiff < 31 * 24 * 60 && timeDiff > 24 * 60) {
      // less than 7 days ago
      prefix = `${Math.round(timeDiff / (60 * 24))} days ago`;
    } else {
      prefix = `${new Date(timestamp)}`;
    }
    return prefix;
  };

  // const addMessages = messagec => {
  //   setChatMessages(chatMessages => [...chatMessages, messagec]);
  //   setInputText({value: '', error: ''});
  //   console.log('new');
  //   // yourRef.current.scrollToIndex({
  //   //   index: chatMessages.length - 1,
  //   //   animated: true,
  //   // })
  // };

  const sendFiles = async () => {
    setIsSendLoading(true);
    const url = `${hitLink}/project/message`;
    let fd = new FormData();
    fd.append('chatRoom', chatId);
    fd.append('user', userId);
    fd.append('message', inputText.value);
    fd.append('photo', image);
    // console.log(image);

    await fetch(url, {
      method: 'POST',
      body: fd,
    })
      .then(respon => {
        respon
          .json()
          .then(response => {
            console.log(response);
          })
          .catch(e => {
            console.log(e);
          });
      })
      .catch(e => {
        console.log(e);
      });
    setShowModal(false);
    setIsSendLoading(false);
  };

  // const waitforSocketConnection = callback => {
  //   setTimeout(function () {
  //     if (WebSocketInstance.state() == 1) {
  //       console.log('Connection is made');
  //       callback();
  //       return;
  //     } else {
  //       console.log('Waiting for connection');
  //       waitforSocketConnection(callback);
  //     }
  //   }, 100);
  // };

  // const initialiseChat = () => {
  //   waitforSocketConnection(() => {
  //     WebSocketInstance.fetchMessages(chatId);
  //   });
  //   WebSocketInstance.connect(chatId);
  // };

  const getAllMessages = async () => {
    const url = `${hitLink}/project/message?filter=message&chatRoom=${route.params.chat}`;

    await fetch(url, {
      method: 'GET',
    })
      .then(respon => {
        respon
          .json()
          .then(response => {
            const {result, message} = response;
            if (result) {
              setChatMessages(message);
            }
          })
          .catch(e => {
            console.log(e);
          });
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    // WebSocketInstance.addCallbacks(setChatMessages, addMessages);
    navigation.setOptions({
      title: route.params.project,
    });
    getUserData();
    getAllMessages();
    setIsLoading(false);
    const getMessageTimeout = setInterval(() => {
      getAllMessages();
    }, 1000);
    // initialiseChat();
    return () => {
      // WebSocketInstance.disconnect();
      clearInterval(getMessageTimeout);
    };
  }, []);

  if (isLoading) {
    return <FullScreenLoading />;
  }

  // const sendNewMessage = () => {
  //   if (inputText.value != '') {
  //     const data = {
  //       from: userId,
  //       chatId: chatId,
  //       message: inputText.value.trim(),
  //     };
  //     WebSocketInstance.newChatMessage(data);
  //     setInputText({value: '', error: ''});
  //   }
  // };

  const sendNewMessage = async () => {
    setIsSendLoading(true);
    const url = `${hitLink}/project/message`;
    let fd = new FormData();
    fd.append('chatRoom', chatId);
    fd.append('user', userId);
    fd.append('message', inputText.value);
    fd.append('photo', '');

    await fetch(url, {
      method: 'POST',
      body: fd,
    })
      .then(respon => {
        respon
          .json()
          .then(response => {
            console.log(response.message);
          })
          .catch(e => {
            console.log(e);
          });
      })
      .catch(e => {
        console.log(e);
      });
    setInputText({value: '', error: ''});
    setIsSendLoading(false);
    getAllMessages();
  };

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
    });

    if (!result.didCancel) {
      const editResult = await PhotoEditor.open({
        path: result.assets[0].uri,
      });
      console.log(editResult);
      console.log(result.assets[0].uri);
      setImage({
        name: result.assets[0].fileName,
        type: result.assets[0].type,
        uri: editResult,
      });
      setShowModal(true);
    } else {
      setImage('');
    }
  };
  return (
    <Background>
      <View style={styles.listContainer}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={chatMessages}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ref={yourRef}
          onContentSizeChange={() =>
            yourRef.current.scrollToEnd({animated: false})
          }
          onLayout={() => yourRef.current.scrollToEnd({animated: false})}
        />
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            label="Enter your message"
            icon="chat"
            value={inputText.value}
            onChangeText={text => setInputText({value: text, error: ''})}
            isAttachPress={pickImage}
            errorText={inputText.error}
            isAttach={true}
          />
        </View>
        <View style={styles.sendButtonContainer}>
          <TouchableOpacity
            disabled={isSendLoading}
            style={styles.sendButton}
            onPress={sendNewMessage}>
            {!isSendLoading ? (
              <Ionicons name="send" size={24} color="white" />
            ) : (
              <ActivityIndicator size={'large'} color={'white'} />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        animationType="fade"
        visible={showModal}
        onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalContainer}>
          <AntDesign
            onPress={() => {
              setShowModal(false);
              setImage({
                name: '',
                uri: '',
                type: '',
              });
            }}
            style={styles.icon}
            name="closecircle"
            size={24}
            color={BrandColor}
          />
          <Image source={{uri: image.uri}} style={styles.modalImage} />
          <View style={styles.buttonContainer}>
            <Button text="Send" onPress={sendFiles} isLoading={isSendLoading} />
          </View>
        </View>
      </Modal>
    </Background>
  );
};

export default IndividualScreen;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  bottomContainer: {
    bottom: 0,
    position: 'absolute',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 5,
    marginBottom: 10,
  },
  sendButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: BrandColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    width: '100%',
    height: '87%',
    marginBottom: '30%',
    marginTop: '10%',
  },
  sendButtonContainer: {
    width: '20%',
    marginLeft: '-17%',
  },
  inputContainer: {
    width: '100%',
  },
  sendMessage: {
    backgroundColor: LightGreenText,
    width: '75%',
    padding: 8,
    borderBottomRightRadius: 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginBottom: 4,
  },
  yourMessage: {
    backgroundColor: GreyFill,
    alignSelf: 'flex-end',
    width: '75%',
    padding: 8,
    borderBottomLeftRadius: 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginBottom: 4,
  },
  user: {
    fontSize: 15,
    color: 'black',
    fontFamily: 'ReemKufi-SemiBold',
    textTransform: 'capitalize',
  },
  message: {
    color: TextColor,
    fontSize: 13,
    fontFamily: 'ReemKufi-Regular',
  },
  time: {
    position: 'absolute',
    bottom: 0,
    right: '8%',
    fontSize: 10,
    fontWeight: 'bold',
    color: TextColor,
  },
  image: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
  },
  imageContainer: {},
  text: {
    color: TextColor,
    fontSize: 25,
    fontFamily: 'ReemKufi-Regular',
  },
  modalImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  modalContainer: {
    // bottom: 0,
    // position: "absolute",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    width: '100%',
    height: '100%',
  },
  icon: {
    position: 'absolute',
    top: 5,
    right: 10,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});
