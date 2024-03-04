import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EMPTY, Observable, Subject } from 'rxjs';
import { catchError, filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { sortBy } from 'lodash';
import { GIO_DIALOG_WIDTH, GioConfirmDialogComponent, GioConfirmDialogData } from '@gravitee/ui-particles-angular';


import { TopApi } from './top-apis.model';
import { TopApisDialogComponent } from './top-apis-dialog/top-apis-dialog.component';

import { SnackBarService } from '../../../../services-ngx/snack-bar.service';
import { TopApiService } from '../../../../services-ngx/top-api.service';

@Component({
  selector: 'app-top-apis',
  templateUrl: './top-apis.component.html',
  styleUrls: ['./top-apis.component.scss']
})
export class TopApisComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<boolean> = new Subject<boolean>();
  public topApisList: TopApi[] = [];
  public displayedColumns: string[] = ['name', 'version', 'description', 'actions'];

  constructor(
    public topApiService: TopApiService,
    private snackBarService: SnackBarService,
    private matDialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.topApiService.getList()
      .subscribe((topApisList: TopApi[]): void => {
        this.topApisList = topApisList;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.unsubscribe();
  }

  public isFirst(order: number): boolean {
    return order === 0;
  }

  public isLast(order: number): boolean {
    return order === this.topApisList.length - 1;
  }

  public moveUp(topApi: TopApi): void {
    if (topApi.order > 0) {
      this.changeOrder(topApi.order, topApi.order - 1);
    }
  }

  public moveDown(topApi: TopApi): void {
    if (topApi.order < this.topApisList.length - 1) {
      this.changeOrder(topApi.order, topApi.order + 1);
    }
  }

  private changeOrder(oldOrder: number, newOrder: number): void {
    this.topApisList[oldOrder].order = newOrder;
    this.topApisList[newOrder].order = oldOrder;
    this.topApisList = sortBy(this.topApisList, 'order');

    this.updateTopApisList()
      .subscribe((list: TopApi[]): void => {
        this.topApisList = list;
      });
  }

  private updateTopApisList(): Observable<TopApi[]> {
    return this.topApiService
      .update(this.topApisList)
      .pipe(
        tap((): void => {
          this.snackBarService.success('List updated successfully');
        }),
        catchError(({ error }) => {
          this.snackBarService.error(error.message);
          return EMPTY;
        }),
        takeUntil(this.unsubscribe$)
      );
  }

  public deleteTopApi(element: TopApi): void {
    this.matDialog
      .open<GioConfirmDialogComponent, GioConfirmDialogData, boolean>(GioConfirmDialogComponent, {
        data: {
          title: 'Delete form Top API',
          content: 'Are you sure you want to delete this Top API form list?',
          confirmButton: 'Remove'
        },
        role: 'alertdialog',
        id: 'deleteTopApiDialog'
      })
      .afterClosed()
      .pipe(
        filter((confirm: boolean): boolean => confirm),
        switchMap(() => this.topApiService.delete(element)),
        tap(() => {
          this.snackBarService.success(`${element.name} removed from the list successfully`);
        }),
        catchError(({ error }) => {
          this.snackBarService.error(error);
          return EMPTY;
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((newList: TopApi[]): void => {
        this.topApisList = newList;
      });
  }

  public addTopApi(): void {
    this.matDialog
      .open<TopApisDialogComponent, any, any>(
        TopApisDialogComponent,
        {
          width: GIO_DIALOG_WIDTH.MEDIUM,
          data: { topApis: this.topApisList },
          role: 'alertdialog',
          id: 'addTopApiDialog'
        }
      )
      .afterClosed()
      .pipe(
        filter((data): boolean => !!data),
        tap(() => {
          this.snackBarService.success('Top API added successfully');
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

}
