import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {getData, logoutFunction} from '../../../components/AsyncStorageHelpers';
import {userData} from '../../../constants/StorageHelpers';
import {
  BrandColor,
  DangerText,
  GreyText,
  hitLink,
  GreyFill,
  TextColor,
  GreyStroke,
} from '../../../constants/colors';
import FullScreenLoading from '../../../components/FullScreenLoading';
import {useFocusEffect} from '@react-navigation/native';
import Background from '../../../components/Background';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import ZocialIcon from 'react-native-vector-icons/Zocial';
import ProgressiveImage from '../../../components/ProgressiveImage';

const UserDetailsScreen = ({navigation}) => {
  const [isLoadign, setIsLoadign] = useState(true);
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [image, setImage] = useState('');

  const getUserData = async () => {
    setIsLoadign(true);
    await getData(userData).then(async resp => {
      if (resp != null) {
        const {id, type} = resp;
        const emailGet = resp.email;
        setEmail(emailGet);
        let url = `${hitLink}/user/employee?id=${id}`;

        fetch(url, {
          method: 'GET',
        })
          .then(resp => {
            resp
              .json()
              .then(response => {
                const {result, message} = response;
                if (result) {
                  const mobilef = message.mobile;
                  const imageGet = message.image;
                  setMobile(mobilef);
                  setImage(imageGet);
                  setIsLoadign(false);
                }
              })
              .catch(e => {
                console.log(e);
                setIsLoadign(false);
              });
          })
          .catch(e => {
            console.log(e);
            setIsLoadign(false);
          });
      }
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      getUserData();
      return () => {
        setIsLoadign(true);
      };
    }, []),
  );

  if (isLoadign) {
    return <FullScreenLoading />;
  }

  return (
    <Background barStyle="dark-content" bgColor="white">
      <ScrollView
        style={{width: '100%', marginTop: 20}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.circleContainer}>
            {image === 'http://brickit.in/media/' ? (
              <EntypoIcon name="user" size={85} color={BrandColor} />
            ) : (
              <ProgressiveImage
                containerStyle={{
                  width: styles.image.width,
                  height: styles.image.height,

                  marginRight: styles.image.marginRight,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                source={{uri: image}}
                style={styles.image}
              />
            )}
          </View>
        </View>
        <View style={styles.card}>
          <View>
            <Text style={styles.heading}>Contact</Text>
          </View>
          <View style={styles.innerContainer}>
            <View style={styles.iconContainer}>
              <FA5Icon name="phone-alt" size={20} color={GreyText} />
            </View>
            <View>
              <Text style={styles.text}>{mobile}</Text>
            </View>
          </View>
          <View style={styles.line}></View>
          <View style={styles.innerContainer}>
            <View style={styles.iconContainer}>
              <ZocialIcon name="email" size={20} color={GreyText} />
            </View>
            <View>
              <Text style={styles.text}>{email}</Text>
            </View>
          </View>
          <View style={styles.line}></View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ChangePassword');
            }}
            style={styles.innerContainer}>
            <View style={styles.iconContainer}>
              <AntDesignIcon name="lock" size={24} color={GreyText} />
            </View>
            <View>
              <Text style={styles.text}>Change Password</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View>
            <Text style={styles.heading}>Settings</Text>
          </View>
          <View style={styles.innerContainer}>
            <View style={styles.iconContainer}>
              <EntypoIcon name="help" size={20} color={GreyText} />
            </View>
            <View>
              <Text style={styles.text}>Reach Us</Text>
            </View>
          </View>
          <View style={styles.line}></View>
          <View style={styles.innerContainer}>
            <View style={styles.iconContainer}>
              <EntypoIcon name="info" size={20} color={GreyText} />
            </View>
            <View>
              <Text style={styles.text}>About Us</Text>
            </View>
          </View>
          <View style={styles.line}></View>
          <View style={styles.innerContainer}>
            <View style={styles.iconContainer}>
              <AntDesignIcon name="sharealt" size={20} color={GreyText} />
            </View>
            <View>
              <Text style={styles.text}>Refer n Earn</Text>
            </View>
          </View>
          <View style={styles.line}></View>
          <TouchableOpacity
            onPress={() => {
              logoutFunction(navigation);
            }}
            style={styles.innerContainer}>
            <View style={styles.dangerContainer}>
              <FAIcon name="sign-out" size={30} color={DangerText} />
            </View>
            <View>
              <Text style={styles.dangerText}>Sign Out</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Background>
  );
};

export default UserDetailsScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 2,
    width: '100%',
    alignItems: 'center',
    elevation: 5,
    borderRadius: 15,
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    padding: 8,
    width: '100%',
    elevation: 5,
    borderRadius: 15,
    marginBottom: 20,
  },
  circleContainer: {
    width: 200,
    height: 200,
    borderRadius: 99,
    backgroundColor: GreyFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 99,
  },
  heading: {
    fontFamily: 'ReemKufi-SemiBold',
    fontSize: 18,
    color: TextColor,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  iconContainer: {
    backgroundColor: GreyFill,
    padding: 8,
    width: 40,
    height: 40,
    borderRadius: 19,
    marginRight: 10,
    borderWidth: 1,
    borderColor: GreyStroke,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerContainer: {
    padding: 4,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'ReemKufi-SemiBold',
    fontSize: 15,
    color: TextColor,
  },
  dangerText: {
    fontFamily: 'ReemKufi-SemiBold',
    fontSize: 15,
    color: DangerText,
  },
  line: {
    backgroundColor: GreyFill,
    width: '100%',
    height: 2,
  },
});
