import { Component, OnInit } from '@angular/core';

import { TopApi } from './top-apis.model';

import { TopApiService } from '../../../../services-ngx/top-api.service';
import { SnackBarService } from '../../../../services-ngx/snack-bar.service';

@Component({
  selector: 'app-top-apis',
  templateUrl: './top-apis.component.html',
  styleUrls: ['./top-apis.component.scss']
})
export class TopApisComponent implements OnInit {
  topApisList: TopApi[] = [];
  displayedColumns: string[] = ['name', 'version', 'description', 'actions'];

  constructor(
    public topApiService: TopApiService,
    private snackBarService: SnackBarService
  ) {
  }

  ngOnInit(): void {
    this.topApiService.getList()
      .subscribe((topApisList: TopApi[]) => {
        this.topApisList = topApisList;
      });
  }

  public isFirst(order: number): boolean {
    return order === 0;
  }

  public isLast(order: number): boolean {
    return order === this.topApisList.length - 1;
  }

  public moveUp(topApi: TopApi): void {
    const updatedTopApi = { ...topApi, order: topApi.order - 1 };
    console.log('updatedTopApi: ', updatedTopApi);
    // this.changeOrder(updatedTopApi)
    //   .subscribe();
  }

  public moveDown(topApi: TopApi): void {
    const updatedTopApi = { ...topApi, order: topApi.order + 1 };
    console.log('moveDown', updatedTopApi);

    // this.changeOrder(updatedTopApi)
    //   .subscribe();
  }

  public deleteTopApi (element: TopApi) {
    console.log('DELETE', element);
  }

  addTopApi () {
    console.log('ADD API');
  }

}
