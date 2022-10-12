function bubble(arr: any[]) {
    let limit = arr.length - 1;
    let zmiany = false;
    for (let i = 0; i < arr.length - 1 && zmiany; i++) {
        zmiany = false;
        for (let j = 0; j < limit; j++) {
            let a = arr[j];
            let b = arr[j + 1];
            if (a.value > b.value) {
                arr[j] = b;
                arr[j + 1] = a;
                zmiany = true;
            }
        }
        limit--;
    }
}
