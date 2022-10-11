import { Component, OnInit } from '@angular/core';
import TakeChance from 'take-chance';
import { SortingMethodsService, SortingObject } from './services/sorting-methods/sorting-methods.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    sortingValues!: SortingObject[];

    isSorting: boolean = false;
    hasStarted: boolean = false;
    allFinished: boolean = false;

    interval: any = null;
    gen!: Generator<undefined, void, unknown >;

    readonly time: number = 400;
    readonly count: number = 100;
    readonly min: number = 1;
    readonly max: number = this.count;

    constructor(
        private sortingMethodsService: SortingMethodsService
    ) {}

    get shouldHaveAnimations() {
        return this.time >= 100;
    }

    ngOnInit(): void {
        this.resetSortingValues();
    }
    private _reset() {
        this.gen = this.sortingMethodsService.bubble(this.sortingValues, this.shouldHaveAnimations);
        this.hasStarted = false;
        this.allFinished = false;
        this.stopSorting();
    }
    resetSortingValues() {
        if (this.max - this.min + 1 < this.count)
            throw new Error("Not enough numbers in range!");

        let arr: number[] = [];
        for (let i = 0; i < this.count; i++) {
            let num;
            do {
                num = TakeChance.int(this.min, this.max);
            } while (arr.includes(num));
            arr.push(num);
        }
        this.sortingValues = arr.map(value => {
            return {
                value,
                selected: false,
                animation: null,
                height: (1 + value - this.min) / (this.max - this.min)
            };
        });

        this._reset();
    }
    toggleSorting() {
        this.hasStarted = true;
        if (this.isSorting) {
            this.stopSorting();
            return;
        }
        this.startSorting();
    }
    stopSorting() {
        this.isSorting = false;
        clearInterval(this.interval);
    }
    startSorting() {
        this.isSorting = true;

        this.interval = setInterval(() => {
            if (this.gen.next().done) {
                this.onFinish();
            }
        }, this.time);
    }
    onFinish() {
        this.allFinished = true;
        this.stopSorting();
    }
}