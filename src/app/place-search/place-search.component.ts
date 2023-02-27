import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteActivatedEvent } from '@angular/material/autocomplete';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  Subscription,
} from 'rxjs';
import { PlacesService } from '../shared/service/places.service';

@Component({
  selector: 'app-place-search',
  templateUrl: './place-search.component.html',
  styleUrls: ['./place-search.component.scss'],
})
export class PlaceSearchComponent implements OnInit, OnDestroy {
  private _predictionsSubj = new BehaviorSubject<
    google.maps.places.AutocompletePrediction[]
  >([]);
  private _valueChangeSub: Subscription | undefined;

  public predictions$ = this._predictionsSubj.asObservable();
  public inputControl = new FormControl();

  constructor(private _placesService: PlacesService) {}

  ngOnInit(): void {
    this._valueChangeSub = this.inputControl.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(300))
      .subscribe((searchValue): void => {
        this.launchAutoCompleteSearch(searchValue);
      });
  }

  ngOnDestroy(): void {
    this._valueChangeSub?.unsubscribe();
  }

  public async launchAutoCompleteSearch(searchValue: string): Promise<void> {
    this._predictionsSubj.next([]);
    const predictions = await this._placesService.getPlacePredictions(
      searchValue
    );
    this._predictionsSubj.next(predictions);
  }

  public displayFn(
    prediction: google.maps.places.AutocompletePrediction
  ): string {
    return prediction?.description ?? '';
  }

  public locationSelected(event: MatAutocompleteActivatedEvent): void {
    if (!event.option) {
      return;
    }
    const prediction = event.option.value;
    const placeResults = this._placesService.nearbySearchFromPrediction(
      prediction,
      'restaurant'
    );
  }
}
