import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { Questions } from '../../providers/questions';

import Timer from 'easytimer';

@IonicPage()
@Component({
  selector: 'page-bonus',
  templateUrl: 'bonus.html',
})
export class BonusPage {
  TIME_TO_ANSWER: number = 5;
  questions: any;
  question: any;
  timer: any;

  points: number = 0;

  questionIndex: number = 0;
  showAnswer: string;

  isTimeout: boolean = false;

  constructor(
    public provider: Questions,
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
  ) { }

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
    this.isTimeout = true;
  }

  startTimer() {
    this.timer.start({ countdown: true, startValues: { seconds: this.TIME_TO_ANSWER } });

    this.timer.addEventListener('targetAchieved', (e) => {
      this.timeout();
    });
  }

  nextQuestion() {
    if (this.questions && !this.questions.length) {
      this.ionViewWillLeave();
      this.playSound('level_up');
      this.modalCtrl.create('EndActivityPage', { level: 'easy', points: this.points }).present();
      return;
    }

    this.question = this.questions.shift();
    this.showAnswer = '';
    this.starChronometer(this.question);
  }

  click(answer: string) {
    if (this.question.answer === answer) {

      // user did not answer
      if (this.isTimeout) {
        this.isTimeout = false;
        this.nextQuestion();
        return;
      }

      this.showAnswer = answer;
      this.playSound('right_answer');

      this.points += 20;

      setTimeout(() => this.nextQuestion(), 500);
    } else {
      this.timeout();
    }
  }

  ionViewWillLeave() {
    console.info('ionViewWillLeave::BonusPage');

    this.timer.stop();
    this.timer.removeEventListener('targetAchieved', null);
  }

  playSound(type) {
    const audio = new Audio();
    audio.src = `./assets/sounds/${type}.mp3`;
    audio.load();
    audio.play();
  }

  getQuestion(index) {
    return `./assets/bonus/b${index}/q.svg`;
  }

  getOption(index, option) {
    return `./assets/bonus/b${index}/${option}.svg`;
  }
}
