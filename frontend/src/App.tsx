import React from 'react';
import './App.css';
import Vocab from './data/vocab.json';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import _shuffle from 'lodash/shuffle';

interface QuestionPanelProps {
  text: string;
  meaning: string;
  showMeaning: boolean;
  setShowMeaning: React.Dispatch<React.SetStateAction<boolean>>;
}

const QuestionPanel: React.FC<QuestionPanelProps> = ({
  text,
  meaning,
  showMeaning,
  setShowMeaning
}) => {
  const MeaningTextStyle = { color: '#fff' };
  const InputLabelStyle = { color: '#fff' };
  const VisibilityToggleStyle = { color: '#fff' };

  const handleClickShowMeaning = () => {
    setShowMeaning((show) => !show);
  };

  const handleMouseDownMeaning = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <div>
      <div className="question_panel">{text}</div>
      <div className="question_panel_meaning">
        <FormControl fullWidth>
          <Input
            id="component-simple"
            type={showMeaning ? 'text' : 'password'}
            style={MeaningTextStyle}
            value={meaning}
            readOnly={true}
            inputProps={{
              min: 0,
              'aria-label': 'description',
              style: { textAlign: 'center', borderColor: '#fff' }
            }}
            startAdornment={
              <InputAdornment position="start">
                <p style={InputLabelStyle}>意味: </p>
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle meaning visibility"
                  onClick={handleClickShowMeaning}
                  onMouseDown={handleMouseDownMeaning}
                  edge="end"
                >
                  {showMeaning ? (
                    <VisibilityOff style={VisibilityToggleStyle} />
                  ) : (
                    <Visibility style={VisibilityToggleStyle} />
                  )}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </div>
    </div>
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
  const AnswerButtonStyle = { fontSize: '14px' };

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
          fullWidth
          style={AnswerButtonStyle}
          variant="contained"
          onClick={() => setInput(option1)}
          color={getButtonColor(option1)}
        >
          1: {option1}
        </Button>
      </Grid>
      <Grid item className="answer_button" xs={6}>
        <Button
          fullWidth
          style={AnswerButtonStyle}
          variant="contained"
          onClick={() => setInput(option2)}
          color={getButtonColor(option2)}
        >
          2: {option2}
        </Button>
      </Grid>
      <Grid item className="answer_button" xs={6}>
        <Button
          fullWidth
          style={AnswerButtonStyle}
          variant="contained"
          onClick={() => setInput(option3)}
          color={getButtonColor(option3)}
        >
          3: {option3}
        </Button>
      </Grid>
      <Grid item className="answer_button" xs={6}>
        <Button
          fullWidth
          style={AnswerButtonStyle}
          variant="contained"
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
  isAnswered: boolean;
  nextQuestion: () => void;
}

const NextQuestionButton: React.FC<NextQuestionButtonProps> = ({ isAnswered, nextQuestion }) => {
  return (
    <Grid container padding={4}>
      <Grid item className="next_button" xs={12}>
        <Button
          className="next_button"
          variant="contained"
          disabled={!isAnswered}
          onClick={nextQuestion}
        >
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
  const [showMeaning, setShowMeaning] = React.useState<boolean>(false);

  const nextQuestion = () => {
    setInput('');
    setVocab(_shuffle(Vocab));
    setQA(_shuffle(qa));
  };

  const qnIdx = qa[0];
  const kanji = vocab[qnIdx].kanji;
  const meaning = vocab[qnIdx].meaning;
  const answer = vocab[qnIdx].hiragana;
  const isAnswered = input !== '';

  return (
    <Grid container justifyContent="center">
      <Grid item xs={11} md={5}>
        <QuestionPanel
          text={kanji}
          meaning={meaning}
          showMeaning={showMeaning}
          setShowMeaning={setShowMeaning}
        />
        <AnswersGroup
          option1={vocab[0].hiragana}
          option2={vocab[1].hiragana}
          option3={vocab[2].hiragana}
          option4={vocab[3].hiragana}
          input={input}
          answer={answer}
          setInput={setInput}
        />
        <NextQuestionButton isAnswered={isAnswered} nextQuestion={nextQuestion} />
      </Grid>
    </Grid>
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
