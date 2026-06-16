import { ResizeMode, Video } from 'expo-av';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const questions = [
  {
    title: '第1題',
    question: '(24-18)/24 = ?',
    answer: '25%',
    options: ['20%', '25%', '30%'],
    hint: ['先算剩下時間', '再除以24', '轉百分比'],
    media: [
      { type: 'image', source: require('../../assets/game2/q1-1.jpg') },
      { type: 'video', source: require('../../assets/game2/q1-2.mp4') },
    ],
  },
  {
    title: '第2題',
    question: 'N與C集合是？',
    answer: '聯集',
    options: ['交集', '聯集'],
    hint: ['不是重疊', '是合併'],
    media: [{ type: 'image', source: require('../../assets/game2/q2-1.jpg') }],
  },
  {
    title: '第3題',
    question: '機率接近？',
    answer: '0.3',
    options: ['0.1', '0.3', '0.6'],
    hint: ['用加權平均'],
    media: [
      { type: 'video', source: require('../../assets/game2/q3-1.mp4') },
      { type: 'image', source: require('../../assets/game2/q3-2.jpg') },
    ],
  },
  {
    title: '第4題',
    question: '數列下一項？',
    answer: '10',
    options: ['10', '20', '30'],
    hint: ['每次減30'],
    media: [{ type: 'image', source: require('../../assets/game2/q4.jpg') }],
  },
  {
    title: '第5題',
    question: '何時失去保護？',
    answer: 'B與C',
    options: ['A', 'B', 'C', 'B與C'],
    hint: ['不是AND'],
    media: [{ type: 'image', source: require('../../assets/game2/q5.jpg') }],
  },
  {
    title: '第6題',
    question: '是否成立？',
    answer: '否',
    options: ['是', '否'],
    hint: ['AND條件'],
    media: [{ type: 'video', source: require('../../assets/game2/q6.mp4') }],
  },
  {
    title: '第7題',
    question: '是否達標？',
    answer: '是',
    options: ['是', '否'],
    hint: ['計算總分'],
    media: [{ type: 'image', source: require('../../assets/game2/q7.jpg') }],
  },
];

export default function G2() {
  const router = useRouter();

  const [q, setQ] = useState(0);
  const [score, setScore] = useState(0);
  const [hintUsed, setHintUsed] = useState(0);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [answered, setAnswered] = useState(false);

  const data = questions[q];
  const media = data.media[mediaIndex];

  function check(ans: string) {
    if (answered) return;

    if (ans === data.answer) {
      setScore((s) => s + 2);
      Alert.alert('答對了！', '+2 分');
    } else {
      Alert.alert('答錯了', `正確答案是：${data.answer}`);
    }

    setAnswered(true);
  }

  function showHint() {
    if (hintUsed < data.hint.length) {
      setHintUsed((h) => h + 1);
      setScore((s) => s - 1);
    }
  }

  function nextQuestion() {
    if (q + 1 >= questions.length) {
      Alert.alert('完成！', `分數：${score}`, [
        {
          text: '返回選關',
          onPress: () => router.push('/levels'),
        },
        {
          text: '返回首頁',
          onPress: () => router.push('/'),
        },
      ]);
      return;
    }

    setQ((n) => n + 1);
    setHintUsed(0);
    setMediaIndex(0);
    setAnswered(false);
  }

  function nextMedia() {
    setMediaIndex((mediaIndex + 1) % data.media.length);
  }

  function prevMedia() {
    setMediaIndex((mediaIndex - 1 + data.media.length) % data.media.length);
  }

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {media.type === 'video' ? (
          <Video
            source={media.source}
            style={styles.media}
            shouldPlay
            isLooping
            isMuted
            resizeMode={ResizeMode.COVER}
          />
        ) : (
          <Image source={media.source} style={styles.media} />
        )}

        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={prevMedia}>
            <Text style={styles.buttonText}>上一張</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={nextMedia}>
            <Text style={styles.buttonText}>下一張</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.right}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.question}>{data.question}</Text>

        {data.options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              answered && option === data.answer && styles.correctButton,
            ]}
            onPress={() => check(option)}
          >
            <Text style={styles.buttonText}>{option}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.hintButton} onPress={showHint}>
          <Text style={styles.buttonText}>提示 (-1)</Text>
        </TouchableOpacity>

        <Text style={styles.hint}>
          {data.hint.slice(0, hintUsed).join('\n')}
        </Text>

        <TouchableOpacity style={styles.nextButton} onPress={nextQuestion}>
          <Text style={styles.buttonText}>下一題</Text>
        </TouchableOpacity>

        <Text style={styles.score}>分數：{score}</Text>

        <View style={styles.bottomRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push('/levels')}
          >
            <Text style={styles.buttonText}>返回選關</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push('/')}
          >
            <Text style={styles.buttonText}>返回首頁</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1020',
  },
  left: {
    flex: 1,
    backgroundColor: 'black',
    position: 'relative',
  },
  right: {
    flex: 1,
    padding: 20,
  },
  media: {
    width: '100%',
    height: '100%',
  },
  controls: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
  },
  controlButton: {
    backgroundColor: '#3498db',
    marginRight: 8,
    padding: 10,
    borderRadius: 8,
  },
  optionButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  correctButton: {
    backgroundColor: '#2ecc71',
  },
  hintButton: {
    backgroundColor: '#f39c12',
    padding: 12,
    borderRadius: 8,
    marginTop: 5,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#9b59b6',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#34495e',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  question: {
    color: 'white',
    fontSize: 22,
    marginBottom: 20,
  },
  hint: {
    marginTop: 10,
    color: '#ffd37a',
    fontSize: 16,
    lineHeight: 24,
  },
  score: {
    color: 'white',
    fontSize: 20,
    marginTop: 20,
    fontWeight: 'bold',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  bottomRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 30,
    marginBottom: 40,
  },
});
