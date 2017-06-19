import {
  Component,
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
  ViewChild
} from '@angular/core';

import {
  NavController,
  ToastController,
  ModalController,
  LoadingController,
} from 'ionic-angular';

import { DragulaService } from 'ng2-dragula/ng2-dragula';

import { Questions } from '../../providers/questions';

@Component({
  selector: 'page-question',
  templateUrl: 'question.html',
  animations: [
    trigger('questionChange', [
      state('sim', style({
        // opacity: 1
      })),
      state('nao', style({
        // opacity: 0
      })),
      transition('* => sim', animate('1000ms ease-in-out', keyframes([
        style({ transform: 'rotate3d(0, 0, 1, -360deg)', opacity: '0.5', transformOrigin: 'center', offset: 0 }),
        style({ transform: 'none', opacity: '1', transformOrigin: 'center', offset: 1 })
      ]))),
    ])
  ]
})
export class QuestionPage {
  @ViewChild('resposta') resposta: any;
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

  // questions change
  questionChange: string = 'nao';

  q1 = [];
  q2 = [];

  answers = [];

  isAnswerWrong: boolean = false;

  constructor(
    public loadCtrl: LoadingController,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public q: Questions,
    public dnd: DragulaService,
  ) {
    const loading = this.presentLoading();

    this.q.getQuestion('easy').subscribe((data) => {
      this.questions = data;

      this.totalQuestions = this.countSteps();

      this.setQuestion();
      this.setOptions();

      loading.dismiss();
    });

    dnd.drop.subscribe((data) => {
      this.q1 = [this.q1.pop()];
      console.info(this.q1);
      this.choice = parseInt(this.q1 && this.q1[0] && this.q1[0].split('opt')[1][1], 10) - 1;
      console.info('choice', this.choice, this.q1);
      this.answer();
    });
  }

  countSteps() {
    let count = 0;
    this.questions.forEach(q => {
      count += q.steps.length;
    });
    return count;
  }

  answer(isToContinue?) {
    console.info('resposta', this.resposta);
    if (isToContinue || this.isAnswerCorrect(this.choice)) {
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
    this.playSound('level_up');
    this.modalCtrl.create('EndActivityPage', { level: 'easy', points: 200 }).present();
  }

  wrongAnswer() {
    this.presentToast('ERRADO! :(', 'error');

    setTimeout(() => this.q1 = [], 500);

    this.playSound('wrong_answer');
  }

  correctAnswer() {
    this.gameMode = 'continue';
    this.addPreviousQuestions(this.options.options[this.choice]);
    this.presentToast('CORRETO! :)', 'success');

    this.playSound('right_answer');


    setTimeout(() => {
      this.answers.push(this.q1[0]);
      this.q1 = [];
      this.continue();
    }, 500);
  }

  playSound(type) {
    const audio = new Audio();
    audio.src = `./assets/sounds/${type}.mp3`;
    audio.load();
    audio.play();
  }

  nextQuestion() {
    this.answers = [];

    this.isNextQuestion = false;
    this.questionChange = 'sim';
    setTimeout(() => this.questionChange = 'nao', 2000);

    this.setQuestion();
    this.setOptions();

    this.clearPreviousQuestions();
  }

  continue() {
    if (!this.isNextQuestion) {
      this.setOptions();
    } else {
      setTimeout(() => this.nextQuestion(), 500);
    }
  }

  isQuestionOver() {
    return this.QUESTION_OPTIONS_INDEX >= this.question.steps.length;
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
    if (this.options && this.options.options.length === 1) {
      this.gameMode = 'entendi';
    }
  }

  entendi() {
    this.question.image = this.options.options[0];
    this.answer(true);
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

  presentLoading() {
    const loader = this.loadCtrl.create({
      content: "Preparando as questões...",
      duration: 10000
    });
    loader.present();
    return loader;
  }
}
