import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'lodash';
import { Observable } from 'rxjs';

import { Constants } from '../entities/Constants';
import { TopApi } from '../management/settings/top-apis/migrated/top-apis.model';

@Injectable({
  providedIn: 'root'
})
export class TopApiService {
  private readonly topApisURL = `${this.constants.env.baseURL}/configuration/top-apis/`

  constructor(
    @Inject(Constants) private readonly constants: Constants,
    private httpClient: HttpClient
  ) {
  }

  getList(): Observable<TopApi[]> {
    return this.httpClient.get<TopApi[]>(this.topApisURL);
  }

  update(topApis: TopApi[]): Observable<TopApi[]> {
    if (topApis && topApis.length) {
      return this.httpClient.put<TopApi[]>(
        this.topApisURL,
        map(topApis, (topApi: TopApi) => {
          return { api: topApi.api };
        })
      );
    }
  }

  delete(topApi: TopApi): Observable<TopApi[]> {
    return this.httpClient.delete<TopApi[]>(this.topApisURL + topApi.api);
  }
}
