import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { APIHttpService } from '../common/api.service';

@Component({
    selector: 'app-tv',
    templateUrl: './tv.component.html',
    providers: [DatePipe]
})
export class TvComponent implements OnInit, AfterViewInit {
    title = 'DJTrainTVDisplay';
    tableBodyColor = '#fff'
    config: any;
    trainsDetail: any;
    currentLang = 'en';


    header: any;
    columns: any;
    trains: any;
    footers: any;
    settings: any;
    public now: string = '';
    timerInterval: any;
    syncInterval: any;
    lastTrainIndex: any;
    intervalCount = 0;
    showFixedRowsPerPage: boolean = false;
    noOfCyclePerFetch: number = 1;
    fixedRowCountPerPage: number = 5;
    serverDateTime: Date = new Date();
    trainGroupingData: any;
    timer: NodeJS.Timer | undefined;
    languageList: any;
    currentLanguageIndex: any;

    @ViewChild('videoPlayer', { static: false })
    videoPlayer: ElementRef | undefined;
    @ViewChild('videodiv', { static: false })
    videodiv: ElementRef | undefined;
    @ViewChild('traindiv', { static: false })
    traindiv: ElementRef | undefined;
    showTrainDiv: boolean | undefined;
    showVideoDiv: boolean | undefined;


    constructor(
        private http: APIHttpService
        , private datePipe: DatePipe) {
        this.onConfigSuccess = this.onConfigSuccess.bind(this);
        this.onTrainsSuccess = this.onTrainsSuccess.bind(this);
        console.log('page loaded')
    }
    ngAfterViewInit(): void {
        // this.videodiv?.nativeElement.style.display = 'none';
    }
    videoPlaying() {

    }
    ngOnInit(): void {
        this.http.getData('trains', this.onConfigSuccess, this.onConfigError);
        this.http.getData('trains', this.onTrainsSuccess, this.onTrainError);
        this.timer = setInterval(() => {
            this.serverDateTime.setSeconds(this.serverDateTime.getSeconds() + 1);
            const time: string | any = this.datePipe.transform(this.serverDateTime, 'HH:mm:ss')
            this.now = time;
        }, 1000);
    }
    ngOnDestroy() {
        clearInterval(this.timer);
        clearInterval(this.timerInterval);
    }
    onConfigSuccess(result: any) {
        this.config = result;
        this.serverDateTime = new Date(this.config.Settings[0].ServerDateTime);
        this.updateLanguageData();
        this.showTrainDiv = false;
        this.showVideoDiv = true; debugger
    }
    onConfigError(result: any) {

    }
    onTrainsSuccess(result: any) {
        this.lastTrainIndex = -1;

        this.setTrainsData(result);

        this.trainsDetail.Footer = result.Footer;
        this.config.Headers = result.Headers;
        this.config.Settings = result.Settings;
        this.config.Columns = result.Columns;

        this.setReloadPageCount();

        this.updateLanguageData();
    }
    onTrainError(result: any) {

    }

    groupBy(xs: any, key: string) {
        return xs.reduce(function (rv: any, x: any) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    }


    setTrainsData(result: any) {
        this.trainsDetail = {};
        this.trainsDetail.Trains = result.Trains;
        this.trainGroupingData = this.groupBy(this.trainsDetail.Trains, 'LANG');
        this.languageList = [];
        this.currentLanguageIndex = -1;
        for (const groupName in this.trainGroupingData) {
            this.languageList.push(groupName);
        }
    }

    setReloadPageCount() {
        if (+this.config.Settings[0].ReloadPageCount < this.intervalCount) {
            this.intervalCount = 0;
            location.reload();
        }
    }

    updateLanguageData() {
        if (this.config) {
            this.header = this.config.Headers.find((row: any) =>
                row.Lang == this.currentLang
            );
            if (!this.header) {
                this.header = this.config.Headers.find((row: any) =>
                    row.Lang == ''
                );
            }

            this.settings = this.config.Settings[0];

            this.fixedRowCountPerPage = +this.settings.FixedRowCountPerPage;
            this.showFixedRowsPerPage = +this.settings.ShowFixedRowsPerPage == 1;
            this.noOfCyclePerFetch = +this.settings.NoOfCyclePerFetch;

            this.columns = this.config.Columns.filter((row: any) =>
                row.Lang == this.currentLang
            );
            if (this.columns.length <= 0) {
                this.columns = this.config.Columns.filter((row: any) =>
                    row.Lang == ''
                );
            }
        }

        if (this.trainsDetail) {

            this.footers = this.trainsDetail.Footer;

            if (!this.timerInterval) {
                const inervalTime = (+this.settings.NextRecordIntervalInSeconds) * 1000;
                this.timerInterval = setInterval(() => {
                    this.intervalCount++;
                    this.updateLanguageData();
                }, inervalTime);
            }

            if (this.currentLanguageIndex == -1 || this.currentLanguageIndex == this.languageList.length - 1) {
                this.currentLanguageIndex = 0
            } else {
                this.currentLanguageIndex++;
            }

            const noOfRecordPerPage = +this.settings.NoOfRecordPerPage;
            if (this.currentLanguageIndex == 0) {//Change Only First Language
                if (this.lastTrainIndex == -1) {
                    this.lastTrainIndex = 0;
                } else {
                    this.lastTrainIndex = this.lastTrainIndex + noOfRecordPerPage;
                }
            }

            const currentLanguageTrainData = this.trainGroupingData[this.languageList[this.currentLanguageIndex]]
            if (currentLanguageTrainData.length > this.lastTrainIndex) {
                this.trains = currentLanguageTrainData.filter((row: any, i: number) => i >= this.lastTrainIndex && i <= this.lastTrainIndex + (noOfRecordPerPage - 1));
                if (this.showFixedRowsPerPage) {
                    if (this.trains.length < this.fixedRowCountPerPage) {
                        const lessRecords = this.fixedRowCountPerPage - this.trains.length;
                        for (let index = 0; index < lessRecords; index++) {
                            this.trains.push(
                                {
                                    TRAIN_NO: '1'
                                });
                        }
                    }
                }
            } else {
                //clearInterval(this.timerInterval);
                //Fetch next when Last Language Record//
                if (this.currentLanguageIndex == this.languageList.length - 1) {
                    this.http.getData('trains', this.onTrainsSuccess, this.onTrainError);
                } else {
                    //calling next language
                    this.updateLanguageData();
                }
            }
        }
    }

    changeLang(lang: string) {
        this.currentLang = lang;
        this.updateLanguageData()
    }

    onPause(args: any) {
        this.showTrainDiv = true;
        this.showVideoDiv = false;
    }
    onPlaying(args: any) {
        const div = document.getElementById('myVideo')
        if (div) {
            // if (div.requestFullscreen)
            //   div.requestFullscreen();
            // else if (div.webkitRequestFullscreen)
            //   div.webkitRequestFullscreen();
            // else if (div.msRequestFullScreen)
            //   div.msRequestFullScreen();
        }
    }
}
