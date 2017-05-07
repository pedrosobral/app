import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Questions } from '../../providers/questions';

import Timer from 'easytimer';

@IonicPage()
@Component({
  selector: 'page-bonus',
  templateUrl: 'bonus.html',
})
export class BonusPage {
  questions: any;
  question: any;
  timer: any;

  points: number = 0;

  questionIndex: number = 0;
  showAnswer: string;

  constructor(
    public provider: Questions,
    public navCtrl: NavController,
    public navParams: NavParams) { }

  ionViewDidLoad() {
    this.timer = new Timer();

    this.provider.bonus()
      .subscribe((data) => {
        this.questions = data;

        this.start();
      });
  }

  start() {
    this.nextQuestion();
  }

  starChronometer(question) {
    if (this.timer.isRunning()) {
      this.timer.stop();
      this.timer.removeEventListener('targetAchieved', () => console.info('removeEventListener'));
      this.timer = new Timer();
    }
    this.startTimer();
  }

  timeout() {
    // feedback wrong answer
    this.playSound('wrong_answer');

    // show correct answer
    this.showAnswer = this.question.answer;
  }

  startTimer() {
    this.timer.start({ countdown: true, startValues: { seconds: 10 } });

    this.timer.addEventListener('targetAchieved', (e) => {
      this.timeout();
    });
  }

  nextQuestion() {
    if (this.questions && !this.questions.length) {

      return;
    }

    this.question = this.questions.shift();
    this.showAnswer = '';
    this.starChronometer(this.question);
  }

  click(answer: string) {
    if (this.question.answer === answer) {
      this.showAnswer = answer;
      this.playSound('right_answer');

      this.points += 20;

      setTimeout(() => this.nextQuestion(), 500);
    } else {
      this.timeout();
    }
  }

  playSound(type) {
    const audio = new Audio();
    audio.src = `./assets/sounds/${type}.mp3`;
    audio.load();
    audio.play();
  }

  getQuestion(index) {
    return `/assets/bonus/b${index}/q.svg`;
  }

  getOption(index, option) {
    return `assets/bonus/b${index}/${option}.svg`;
  }
}
