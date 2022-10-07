import { Injectable } from '@angular/core';

export type SortingObject = {
    value: number,
    selected: boolean,
    animation: null | 'good' | 'bad' | 'switch-to-left' | 'switch-to-right';
    height: number;
    finished?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SortingMethodsService {
    *bubble(arr: SortingObject[], anims: boolean): Generator<undefined, void, unknown> {
        let limit = arr.length - 1;
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
                    if (anims) {
                        a.animation = 'bad';
                        b.animation = 'bad';
                        yield;
                        a.animation = 'switch-to-right';
                        b.animation = 'switch-to-left';
                        yield;
                        a.animation = null;
                        b.animation = null;
                    }
                    arr[i] = b;
                    arr[i + 1] = a;
                    if (i == limit - 1) {
                        a.finished = true;
                    }
                    if (anims) yield;
                }
                else {
                    if (anims) {
                        a.animation = 'good';
                        b.animation = 'good';
                        yield;
                        a.animation = null;
                        b.animation = null;
                    }
                    if (i == limit - 1) {
                        b.finished = true;
                    }
                    if (anims) yield;
                }
            }
            limit--;
        }
        arr.forEach(item => {
            item.finished = true;
        });
    }
}
