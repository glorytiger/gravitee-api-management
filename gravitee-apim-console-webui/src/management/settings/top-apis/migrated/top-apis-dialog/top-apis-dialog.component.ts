import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { TopApi } from '../top-apis.model';
import { ApiService } from '../../../../../services-ngx/api.service';
import { Api } from '../../../../../entities/api';
import { Observable, of, Subject } from 'rxjs';
import { isEmpty, startsWith } from 'lodash';
import { catchError, debounceTime, map, startWith, takeUntil } from 'rxjs/operators';
import { AsyncValidatorFn, FormControl, UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-top-apis-dialog',
  templateUrl: './top-apis-dialog.component.html',
  styleUrls: ['./top-apis-dialog.component.scss']
})
export class TopApisDialogComponent implements OnInit {
  private unsubscribe$: Subject<void> = new Subject<void>();
  public myControl = new FormControl('');
  public apis: Api[] = [];
  public filteredOptions: Observable<Api[]>;


  constructor(
    public dialogRef: MatDialogRef<TopApisDialogComponent>,
    private apiService: ApiService
  ) {
  }

  ngOnInit(): void {
    this.apiService.getAll()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((apis: Api[]) => {
        this.apis = apis;
      });
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value || ''))
      );
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  validate(): AsyncValidatorFn {
    return (control: UntypedFormControl) => {
      if (isEmpty(control.value)) {
        return of(null);
      }
    };
  }

  private _filter(value: string): Api[] {
    const filterValue = value.toLowerCase();
    return this.apis.filter((api: Api) => JSON.stringify(api).toLowerCase().includes(filterValue));
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  isDisabled(): boolean {
    return true;
  }

  selectTopAPI(event: MatAutocompleteSelectedEvent): void {
    console.log('selectTopAPI event:', event);
  }

}
