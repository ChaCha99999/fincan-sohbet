import type { Question } from '../types';
import { SOHBET_QUESTIONS } from './questions/sohbet';
import { IKILEM_QUESTIONS } from './questions/ikilem';
import { MUHTEMEL_QUESTIONS } from './questions/muhtemel';
import { TANIYORUZ_QUESTIONS } from './questions/taniyoruz';

export const INITIAL_QUESTIONS: Question[] = [
  ...SOHBET_QUESTIONS,
  ...IKILEM_QUESTIONS,
  ...MUHTEMEL_QUESTIONS,
  ...TANIYORUZ_QUESTIONS,
];

export { SOHBET_QUESTIONS, IKILEM_QUESTIONS, MUHTEMEL_QUESTIONS, TANIYORUZ_QUESTIONS };
