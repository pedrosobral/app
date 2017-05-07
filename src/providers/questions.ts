import { Injectable } from '@angular/core';

import { Http } from '@angular/http';

import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

import Random from 'random-js';

const API_KEY = "?key=AIzaSyBEue-mVBiUOUSa66ftHKcSu0EPPtXGrnA";
const SPREADSHEET_URL = "https://sheets.googleapis.com/v4/spreadsheets/1h0Bj17ToKSIalKw4q8lITq64L9i_9mB5cVSfPVnSbu8/values/data";

const CARDS = 'BR.EDU.UNIVASF.PEMD.CARDS';

@Injectable()
export class Questions {
  data: any;

  // random engine
  _random: any;

  constructor(public storage: Storage, public http: Http) {
    this._random = new Random(Random.engines.mt19937().autoSeed());
  }

  bonus() {
    return this.http.get('./assets/bonus/bonus.json')
      .map(res => res.json().questions);
  }

  load(): Observable<any> {
    return this.http.get(SPREADSHEET_URL + API_KEY)
      .map(res => res.json())
      .map(res => this.parse(res))
      .map(res => this.save(CARDS, res))
      .catch(error => this.game(CARDS));
  }

  getQuestion(level, number = 10) {
    return this.load()
      .map(q => this.fiterByLevel(level, q))
      .map(q => this.random(q))
      .map(q => this.limit(number, q))
  }

  fiterByLevel(level: string, data) {
    return data.filter(x => x.level == level);
  }

  limit(number, data) {
    if (data instanceof Array)
      return data.slice(0, number);
    return [];
  }

  random(data) {
    this._random.shuffle(data);
    return data;
  }

  parse(data) {
    // get rid of labels
    data.values.shift();

    const result = data.values.map((q, index) => {
      const path = `${q[0]}/q${index + 1}`;
      return {
        type: q[0],
        level: q[1],
        text: q[4],
        image: `${path}/q.svg`,
        steps: this.getQuestions(q[2], q[3], path),
        // result: this.getResult(q[5], path),
      }
    });

    // return result.slice(28,30);
    return result;
  }

  getQuestions(questions, answers, path) {
    const q = questions.split('|');
    const a = answers.split(',');

    return q.map((question, index) => {
      return {
        text: question,
        options: a[index] === 's' ? [`${path}/opt${index + 1}1.svg`] : this.getOptions(path, index + 1),
        answer: a[index],
      }
    });
  }

  getResult(result, path) {
    if (!result) return;

    const res = result.split('|');
    res[1] = `${path}/${res[1]}`;
    return res;
  }

  getOptions(path, index) {
    let options = [];
    for (let i = 1; i < 3 + 1; i++) {
      options.push(`${path}/opt${index}${i}.svg`);
    }
    return options;
  }

  game(key) {
    return this.storage.get(key).then(data => {
      return JSON.parse(data);
    });
  }

  save(key, data) {
    this.storage.set(key, JSON.stringify(data));
    return data;
  }

  // load(): Observable<any> {
  //   if (this.data) {
  //     return Observable.of(this.data);
  //   } else {
  //     return this.http.get('assets/data/questions.json')
  //       .map(data => data.json());
  //   }
  // }

}
