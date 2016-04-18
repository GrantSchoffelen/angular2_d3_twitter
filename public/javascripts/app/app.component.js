System.register(['angular2/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent() {
                    this.tweet = "hi";
                    this.socket = null;
                    this.filterVal = 'swag';
                    this.oldTweet = "nothing";
                    this.data = {};
                    this.socket = io('http://localhost:8000');
                    this.socket.on('tweetStream', function (data) {
                        // if(data.place){
                        //     console.log(data.place.full_name)
                        // }
                        console.log(data.state, data.text);
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
                        };
                    }.bind(this));
                }
                AppComponent.prototype.filter = function () {
                    this.socket.emit('newFilter', this.filterVal);
                    this.filterVal = '';
                };
                AppComponent.prototype.ngAfterViewInit = function () {
                    this.rendered = true;
                    this.map = new Datamap({
                        element: document.getElementById('container'),
                        scope: 'usa',
                        fills: {
                            HIGH: '#afafaf',
                            LOW: '#123456',
                            MEDIUM: 'blue',
                            UNKNOWN: 'rgb(0,0,0)',
                            defaultFill: 'white'
                        },
                        data: this.data,
                        geographyConfig: {
                            popupTemplate: function (geo, data) {
                                return ['<div class="hoverinfo"><strong>',
                                    'Number of things in ' + geo.properties.name,
                                    ': ' + data.numberOfTweets + ' ' + data.lastTweet,
                                    '</strong></div>'].join('');
                            }
                        }
                    });
                };
                AppComponent.prototype.ngDoCheck = function () {
                    if (this.tweet !== this.oldTweet && this.rendered) {
                        this.map.updateChoropleth(this.data);
                    }
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'auction-app',
                        templateUrl: 'templates/product.html'
                    }), 
                    __metadata('design:paramtypes', [])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
// bootstrap(AppComponent); 
//# sourceMappingURL=app.component.js.map