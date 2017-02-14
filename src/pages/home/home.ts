import { Component } from '@angular/core';

import { NavController, ToastController } from 'ionic-angular';

import { Questions } from '../../providers/questions';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
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
      this.saturation += Math.floor(100/this.totalQuestions);
      if (this.isQuestionOver()) {
        if (!this.isGameOver()) {
          this.setQuestion();
          this.setOptions();
        } else {
          this.saturation = 100;
          alert('PARABENS.');
        }
      } else {
        this.gameMode = 'continue';
        this.presentToast('CORRETO! :)', 'success');
      }
    } else {
      this.presentToast('ERRADO! :(', 'error');
    }
  }

  continue() {
    this.setOptions();
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
}
