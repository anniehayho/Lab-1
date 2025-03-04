import React, { memo } from 'react';
import { 
  StyleSheet, 
  Image, 
  View, 
  Text, 
  ScrollView, 
  SafeAreaView, 
  Platform,
  Linking,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const InfoItem = memo(({ icon, text, onPress }) => (
  <TouchableOpacity 
    style={styles.infoRow} 
    onPress={onPress}
    disabled={!onPress}
  >
    <Ionicons name={icon} size={22} color="#555" style={styles.infoIcon} />
    <Text style={styles.infoText}>{text}</Text>
  </TouchableOpacity>
));

const SectionTitle = memo(({ title }) => (
  <>
    <View style={styles.line} />
    <Text style={styles.title}>{title}</Text>
  </>
));

const SkillItem = memo(({ skill }) => (
  <View style={styles.skillItem}>
    <Text style={styles.skillText}>{skill}</Text>
  </View>
));

const ExperienceItem = memo(({ text }) => (
  <View style={styles.experienceItem}>
    <View style={styles.bullet} />
    <Text style={styles.experience}>{text}</Text>
  </View>
));

function ProfileScreen() {
  const handleEmailPress = () => {
    Linking.openURL('mailto:thuytrangphamthi@gmail.com');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:0989999999');
  };

  const handleAddressPress = () => {
    Linking.openURL('https://maps.google.com/?q=UIT, Linh Trung, Thu Duc, HCM');
  };

  const experiences = [
    'Tôi đã làm việc tại công ty ABC từ tháng 1/2020 đến tháng 12/2020 với vai trò Frontend Developer.',
    'Tôi đã làm việc tại công ty XYZ từ tháng 1/2021 đến tháng 12/2021 với vai trò Full Stack Developer.'
  ];

  const skills = [
    'React Native', 
    'React', 
    'NodeJS', 
    'Express', 
    'MongoDB', 
    'MySQL', 
    'PostgreSQL', 
    'Docker'
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <Image 
            source={require('../assets/images/avatar.jpg')} 
            style={styles.profileImage} 
          />
          <Text style={styles.name}>Pham Thi Thuy Trang</Text>
          <View style={styles.birthdayContainer}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.birthday}>16/02/2003</Text>
          </View>
        </View>

        <SectionTitle title="Information" />
        
        <View style={styles.infoContainer}>
          <InfoItem 
            icon="location-outline" 
            text="UIT, Linh Trung, Thu Duc, HCM" 
            onPress={handleAddressPress}
          />
          <InfoItem 
            icon="call-outline" 
            text="0989999999" 
            onPress={handlePhonePress}
          />
          <InfoItem 
            icon="mail-outline" 
            text="thuytrangphamthi@gmail.com" 
            onPress={handleEmailPress}
          />
        </View>

        <SectionTitle title="Experience" />
        
        <View style={styles.experienceContainer}>
          {experiences.map((exp, index) => (
            <ExperienceItem key={index} text={exp} />
          ))}
        </View>

        <SectionTitle title="Skills" />
        
        <View style={styles.skillsContainer}>
          {skills.map((skill, index) => (
            <SkillItem key={index} skill={skill} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#f0f0f0',
    marginBottom: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  birthdayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  birthday: {
    fontSize: 16,
    color: '#666',
    marginLeft: 6,
  },
  line: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoContainer: {
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 10,
    width: 22,
  },
  infoText: {
    fontSize: 16,
    color: '#444',
    flex: 1,
  },
  experienceContainer: {
    marginBottom: 10,
  },
  experienceItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#555',
    marginTop: 8,
    marginRight: 10,
  },
  experience: {
    fontSize: 16,
    color: '#444',
    flex: 1,
    lineHeight: 22,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillItem: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  skillText: {
    fontSize: 14,
    color: '#444',
    fontWeight: '500',
  },
});

export default memo(ProfileScreen);