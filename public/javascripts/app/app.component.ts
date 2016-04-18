import {Component, bootstrap, ElementRef} from 'angular2/core';


@Component({
    selector: 'auction-app',
    templateUrl: 'templates/product.html'
})

export class AppComponent {
    tweet: string = "hi";
    graphData: Array<number>;
    socket = null;
    filterVal = 'swag';
    oldTweet = "nothing";

    constructor() {
        this.data = {}
        this.socket = io('http://localhost:8000');
        this.socket.on('tweetStream', function(data) {
            // if(data.place){
            //     console.log(data.place.full_name)
            // }
            console.log(data.state, data.text)
            // console.log(data.geo)
            // console.log(data.user.location)
            // console.log(data)
            this.oldTweet = this.tweet;
            this.tweet = data;
            console.log(this.tweet.stateCount);

            this.data[data.state] = {
                fillKey: this.tweet.fillKey,
                numberOfTweets: this.tweet.stateCount,
                lastTweet: data.text
            }
        }.bind(this));
    }

    filter() {
        this.socket.emit('newFilter', this.filterVal);
        this.filterVal = '';
    }

    ngAfterViewInit(){
        this.rendered = true;
        this.map = new Datamap({
            element: document.getElementById('container'),
            scope: 'usa',
            fills: {
                HIGH: '#afafaf',
                LOW: '#123456',
                MEDIUM: 'blue',
                UNKNOWN: 'rgb(0,0,0)',
                defaultFill: 'black'
            },
            data: this.data,
            geographyConfig: {
                popupTemplate: function(geo, data) {
                    return ['<div class="hoverinfo"><strong>',
                        'Number of things in ' + geo.properties.name,
                        ': ' + data.numberOfTweets + ' ' + data.lastTweet,
                        '</strong></div>'].join('');
                }
            }
        });

    }

    ngDoCheck() {
        if (this.tweet !== this.oldTweet && this.rendered) {
            this.map.updateChoropleth(this.data);

        }
    }

}

// bootstrap(AppComponent);