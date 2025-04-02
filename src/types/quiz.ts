export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

export interface QuestionCardProps {
  question: Question;
  selectedAnswer: string;
  onAnswerChange: (answer: string) => void;
}