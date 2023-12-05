import React from 'react';
import './App.css';
import Vocab from './data/vocab.json';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import _shuffle from 'lodash/shuffle';

interface QuestionPanelProps {
  text: string;
  meaning: string;
}

const QuestionPanel: React.FC<QuestionPanelProps> = ({ text, meaning }) => {
  return (
    <>
      <div className="question_panel">{text}</div>
      <div className="question_panel_meaning">({meaning})</div>
    </>
  );
};

interface AnswersGroupProps {
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  input: string;
  answer: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
}

const AnswersGroup: React.FC<AnswersGroupProps> = ({
  option1,
  option2,
  option3,
  option4,
  input,
  answer,
  setInput
}) => {
  const AnswerButtonStyle = { fontSize: '16px' };

  const getButtonColor = (option: string) => {
    if (input === '') {
      return 'primary';
    }
    if (option === input) {
      if (input === answer) {
        return 'success';
      } else {
        return 'error';
      }
    }
    return 'primary';
  };

  return (
    <Grid container spacing={1}>
      <Grid item className="answer_button" xs={6}>
        <Button
          style={AnswerButtonStyle}
          variant="outlined"
          onClick={() => setInput(option1)}
          color={getButtonColor(option1)}
        >
          1: {option1}
        </Button>
      </Grid>
      <Grid item className="answer_button" xs={6}>
        <Button
          style={AnswerButtonStyle}
          variant="outlined"
          onClick={() => setInput(option2)}
          color={getButtonColor(option2)}
        >
          2: {option2}
        </Button>
      </Grid>
      <Grid item className="answer_button" xs={6}>
        <Button
          style={AnswerButtonStyle}
          variant="outlined"
          onClick={() => setInput(option3)}
          color={getButtonColor(option3)}
        >
          3: {option3}
        </Button>
      </Grid>
      <Grid item className="answer_button" xs={6}>
        <Button
          style={AnswerButtonStyle}
          variant="outlined"
          onClick={() => setInput(option4)}
          color={getButtonColor(option4)}
        >
          4: {option4}
        </Button>
      </Grid>
    </Grid>
  );
};

interface NextQuestionButtonProps {
  nextQuestion: () => void;
}

const NextQuestionButton: React.FC<NextQuestionButtonProps> = ({ nextQuestion }) => {
  const NextQuestionButtonStyle = { marginTop: '10px' };
  return (
    <Grid container style={NextQuestionButtonStyle} spacing={1}>
      <Grid item className="next_button" xs={12}>
        <Button className="next_button" variant="contained" onClick={nextQuestion}>
          Next
        </Button>
      </Grid>
    </Grid>
  );
};

interface VocabProps {
  kanji: string;
  meaning: string;
  hiragana: string;
}

const VocabPractice = () => {
  const [vocab, setVocab] = React.useState<VocabProps[]>(_shuffle(Vocab));
  const [qa, setQA] = React.useState<number[]>(_shuffle([0, 1, 2, 3]));
  const [input, setInput] = React.useState<string>('');

  const nextQuestion = () => {
    setInput('');
    setVocab(_shuffle(Vocab));
    setQA(_shuffle(qa));
  };

  const qnIdx = qa[0];
  const kanji = vocab[qnIdx].kanji;
  const meaning = vocab[qnIdx].meaning;
  const answer = vocab[qnIdx].hiragana;

  return (
    <>
      <QuestionPanel text={kanji} meaning={meaning} />
      <AnswersGroup
        option1={vocab[0].hiragana}
        option2={vocab[1].hiragana}
        option3={vocab[2].hiragana}
        option4={vocab[3].hiragana}
        input={input}
        answer={answer}
        setInput={setInput}
      />
      <NextQuestionButton nextQuestion={nextQuestion} />
    </>
  );
};

function App() {
  return (
    <div className="app">
      <header className="app-panel">
        <VocabPractice />
      </header>
    </div>
  );
}

export default App;
