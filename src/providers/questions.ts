import { Injectable } from '@angular/core';

import { Http } from '@angular/http';

import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

const API_KEY = "?key=AIzaSyBEue-mVBiUOUSa66ftHKcSu0EPPtXGrnA";
const SPREADSHEET_URL = "https://sheets.googleapis.com/v4/spreadsheets/1h0Bj17ToKSIalKw4q8lITq64L9i_9mB5cVSfPVnSbu8/values/data";

const CARDS = 'BR.EDU.UNIVASF.PEMD.CARDS';

@Injectable()
export class Questions {
  data: any;

  constructor(public storage: Storage, public http: Http) { }

  load(): Observable<any> {
    return this.http.get(SPREADSHEET_URL + API_KEY)
      .map(res => res.json())
      .map(res => this.parse(res))
      .map(res => this.save(CARDS, res))
      .catch(error => this.game(CARDS));
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
        result: this.getResult(q[5], path),
      }
    });

    console.info('result', result);

    return result.slice(28,30);
  }

  getQuestions(questions, answers, path) {
    const q = questions.split('|');
    const a = answers.split(',');

    return q.map((question, index) => {
      return {
        text: question,
        options: this.getOptions(path, index + 1),
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
