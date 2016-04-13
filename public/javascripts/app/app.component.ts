import {Component, bootstrap, ElementRef} from 'angular2/core';


@Component({
    selector: 'auction-app',
    templateUrl: 'templates/product.html'
})

export class AppComponent {
    price: string = "hi";
    graphData: Array<number>;
    socket = null;
    filterVal = '';
    elementRef: ElementRef;

    constructor(elementRef: ElementRef) {
        this.elementRef = elementRef;
        this.socket = io('http://localhost:8000');
        this.socket.on('tweetStream', function(data) {
            this.tweet = data;
        }.bind(this));
        this.graphData = [10,20,30,40]
    }

    filter() {
        this.socket.emit('newFilter', this.filterVal);
        this.filterVal = '';
    }

    ngAfterViewInit() {
        new Datamap({ element: document.getElementById('container') })
    }
}

// bootstrap(AppComponent);