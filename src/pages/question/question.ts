import { Component } from '@angular/core';

import { NavController, ToastController } from 'ionic-angular';

import { Questions } from '../../providers/questions';

@Component({
  selector: 'page-question',
  templateUrl: 'question.html'
})
export class QuestionPage {
  // user choice
  choice: number;

  // total
  saturation: number = 0;

  gameMode: string = 'answer';

  // all questions
  questions: any;

  QUESTION_INDEX = 0;
  QUESTION_OPTIONS_INDEX = 0;

  // actual questions
  question: any;

  // and options
  options: any;

  // total questions
  totalQuestions: number = 0;

  // previous questions
  previousQuestions = [];

  // nextQuestion
  isNextQuestion: boolean;

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public q: Questions) {

    this.q.load().subscribe((data) => {
      this.questions = data.questions;
      this.totalQuestions = this.countSteps();

      this.setQuestion();
      this.setOptions();
    });
  }

  countSteps() {
    let count = 0;
    this.questions.forEach(q => {
      count += q.steps.length;
    });
    return count;
  }

  answer() {
    if (this.isAnswerCorrect(this.choice)) {
      this.saturation += Math.floor(100 / this.totalQuestions);

      if (this.isQuestionOver()) {
        if (!this.isGameOver()) {
          this.isNextQuestion = true;
          this.correctAnswer();
        } else {
          this.activityIsOver();
        }
      } else {
        this.correctAnswer();
      }
    } else {
      this.wrongAnswer();
    }
  }

  activityIsOver() {
    this.saturation = 100;
    this.presentToast('PARABÉNS! :(', 'success');

    this.playSound('level_up');
  }

  wrongAnswer() {
    this.presentToast('ERRADO! :(', 'error');

    this.playSound('wrong_answer');
  }

  correctAnswer() {
    this.gameMode = 'continue';
    this.addPreviousQuestions(this.options.options[this.choice]);
    this.presentToast('CORRETO! :)', 'success');

    this.playSound('right_answer')
  }

  playSound(type) {
    const audio = new Audio();
    audio.src = './assets/sounds/type.mp3'.replace(/type/g, type);
    audio.load();
    audio.play();
  }

  nextQuestion() {
    this.isNextQuestion = false;

    this.setQuestion();
    this.setOptions();

    this.clearPreviousQuestions();
  }

  continue() {
    if (!this.isNextQuestion) {
      this.setOptions();
    } else {
      this.nextQuestion();
    }
  }

  isQuestionOver() {
    return this.options.options.length == this.QUESTION_OPTIONS_INDEX;
  }

  isGameOver() {
    return this.questions.length === this.QUESTION_INDEX;
  }

  isAnswerCorrect(option) {
    return this.options.answer == option;
  }

  setQuestion() {
    this.question = this.questions[this.QUESTION_INDEX++];
    this.QUESTION_OPTIONS_INDEX = 0;
  }

  setOptions() {
    this.options = this.question.steps[this.QUESTION_OPTIONS_INDEX++];

    this.gameMode = 'answer';
  }

  getImage(src) {
    return `assets/questions/${src}`;
  }

  presentToast(msg, type) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'middle',
      cssClass: type,
    });
    toast.present();
  }

  addPreviousQuestions(question) {
    this.previousQuestions.push(question);
  }

  clearPreviousQuestions() {
    this.previousQuestions = [];
  }

  dismiss() {
    this.navCtrl.pop();
  }
}
