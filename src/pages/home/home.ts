import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { Questions } from '../../providers/questions';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  // all questions
  questions: any;

  QUESTION_INDEX = 0;
  QUESTION_OPTIONS_INDEX = 0;

  // actual questions
  question: any;
  // and options
  options: any;

  constructor(public navCtrl: NavController, public q: Questions) {

    this.q.load().subscribe((data) => {
      this.questions = data.questions;

      this.setQuestion();
      this.setOptions();
    });
  }

  answer(option) {
    if (this.isAnswerCorrect(option)) {
      if (this.isQuestionOver()) {
        this.setQuestion();
        this.setOptions();
      } else {
        this.setOptions();
      }
    } else {
      alert("Resposta errada")
    }
  }

  isQuestionOver() {
    return this.options.options.length == this.QUESTION_OPTIONS_INDEX;
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
  }

  getImage(src) {
    return `/assets/questions/${src}`;
  }

}
