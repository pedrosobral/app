import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

const PLAYER_DATA = 'BR.EDU.UNIVASF.PEMD.APP';

@Injectable()
export class Player {

  constructor(public storage: Storage, public http: Http) { }

  set save(data) {
    this.storage.set(PLAYER_DATA, JSON.stringify(data));
  }

  get data() {
    return this.storage.get(PLAYER_DATA).then(data => {
      return JSON.parse(data);
    });
  }

}
