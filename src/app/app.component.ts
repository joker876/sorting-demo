import { Component, OnInit } from '@angular/core';
import TakeChance from 'take-chance';

type SortingObject = {
    value: number,
    selected: boolean,
    animation: null | 'good' | 'bad' | 'switch-to-left' | 'switch-to-right';
    height: number;
    finished?: boolean;
}

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
    gen = this.generator();

    readonly time: number = 440;
    readonly count: number = 100;
    readonly min: number = 1;
    readonly max: number = this.count;

    ngOnInit(): void {
        this.fillSortingValues();
    }
    fillSortingValues() {
        if (this.max - this.min + 1 < this.count)
            throw new Error("Not enough numbers in range!");

        this.gen = this.generator();
        this.hasStarted = false;
        this.allFinished = false;
        
        let arr: number[] = [];
        for (let i = 0; i < this.count; i++) {
            let num;
            do {
                num = TakeChance.int(this.min, this.max);
            } while (arr.includes(num));
            arr.push(num);
        }
        this.sortingValues = arr.map(value => ({ value, selected: false, animation: null, height: (1 + value - this.min) / (this.max - this.min) }));
    }
    startSorting() {
        this.hasStarted = true;
        if (this.isSorting) {
            this.isSorting = false;
            clearInterval(this.interval);
            return;
        }
        this.isSorting = true;

        this.interval = setInterval(() => {
            this.gen.next();
        }, 440);
    }
    * generator() {
        let arr = this.sortingValues;
        let limit = this.count - 1;
        while (limit >= 1) {
            for (let i = 0; i < limit; i++) {
                let a = arr[i];
                let b = arr[i + 1];
                a.selected = true;
                b.selected = true;
                yield;
                a.selected = false;
                b.selected = false;
                if (a.value > b.value) {
                    a.animation = 'bad';
                    b.animation = 'bad';
                    yield;
                    a.animation = 'switch-to-right';
                    b.animation = 'switch-to-left';
                    yield;
                    a.animation = null;
                    b.animation = null;
                    arr[i] = b;
                    arr[i + 1] = a;
                    if (i == limit - 1) {
                        a.finished = true;
                    }
                    yield;
                }
                else {
                    a.animation = 'good';
                    b.animation = 'good';
                    yield;
                    a.animation = null;
                    b.animation = null;
                    if (i == limit - 1) {
                        b.finished = true;
                    }
                    yield;
                }
            }
            limit--;
        }
        arr.forEach(item => {
            item.finished = true;
        });
        this.allFinished = true;
        this.isSorting = false;
        this.hasStarted = false;
    }
}
// function* generator {

// }