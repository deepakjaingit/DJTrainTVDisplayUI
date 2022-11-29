import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { Column, HeaderSetting, ResponseModel } from './responsemodel';
import { Footer, Train, TrainStatusModel } from './trainsmodel';
import { CommonModule, DatePipe } from '@angular/common';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
  state,
  keyframes
} from "@angular/animations";
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DatePipe]
})
export class AppComponent {
  // title = 'DJTrainTVDisplay';
  // tableBodyColor = '#fff'
  // config: any;
  // trainsDetail: any;
  // currentLang = 'en';


  // header: any;
  // columns: any;
  // trains: any;
  // footers: any;
  // settings: any;
  // public now: string = '';
  // timerInterval: any;
  // syncInterval: any;
  // lastTrainIndex: any;
  // intervalCount = 0;
  // showFixedRowsPerPage: boolean = false;
  // noOfCyclePerFetch: number = 1;
  // fixedRowCountPerPage: number = 5;
  // serverDateTime: Date = new Date();
  // trainGroupingData: any;
  // timer: NodeJS.Timer | undefined;
  // languageList: any;
  // currentLanguageIndex: any;
  constructor(private router: Router) {
    this.router.events
      .subscribe((event: any) => {
        if (event instanceof NavigationEnd) {
          if (event.url === '/') {
            this.router.navigateByUrl('/tv');
          }
        }
      });
  }

  // ngOnInit(): void {
  //   this.getData(this.onConfigSuccess, this.onConfigError);
  //   this.getData(this.onTrainsSuccess, this.onTrainError);
  //   this.timer = setInterval(() => {
  //     this.serverDateTime.setSeconds(this.serverDateTime.getSeconds() + 1);
  //     const time: string | any = this.datePipe.transform(this.serverDateTime, 'HH:mm:ss')
  //     this.now = time;
  //   }, 1000);
  // }
  // ngOnDestroy() {
  //   clearInterval(this.timer);
  //   clearInterval(this.timerInterval);
  // }

  // getData(successEmit: (result: any) => void, FailEmit: (result: any) => void) {
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'USER_DEVICE_WIDTH': window.screen.availWidth.toString()
  //     })
  //   }
  //   let url = '/api/request/trains';
  //   if (location.port == '4200') {
  //     url = 'https://localhost:44328/request/trains'
  //   }
  //   const request = this.http.get(url, httpOptions)
  //     .pipe(take(1)).subscribe(
  //       {
  //         next: (v) => successEmit(v as any as TrainStatusModel),
  //         error: (e) => FailEmit(e),
  //         complete: () => { request.unsubscribe() }
  //       }
  //     );
  // }

  // onConfigSuccess(result: ResponseModel) {
  //   this.config = result;
  //   this.serverDateTime = new Date(this.config.Settings[0].ServerDateTime);
  //   this.updateLanguageData();
  // }
  // onConfigError(result: any) {

  // }
  // onTrainsSuccess(result: any) {
  //   this.lastTrainIndex = -1;

  //   this.setTrainsData(result);

  //   this.trainsDetail.Footer = result.Footer;
  //   this.config.Headers = result.Headers;
  //   this.config.Settings = result.Settings;
  //   this.config.Columns = result.Columns;

  //   this.setReloadPageCount();

  //   this.updateLanguageData();
  // }
  // onTrainError(result: any) {

  // }

  // groupBy(xs: any, key: string) {
  //   return xs.reduce(function (rv: any, x: any) {
  //     (rv[x[key]] = rv[x[key]] || []).push(x);
  //     return rv;
  //   }, {});
  // }


  // setTrainsData(result: any) {
  //   this.trainsDetail = {};
  //   this.trainsDetail.Trains = result.Trains;
  //   this.trainGroupingData = this.groupBy(this.trainsDetail.Trains, 'LANG');
  //   this.languageList = [];
  //   this.currentLanguageIndex = -1;
  //   debugger
  //   for (const groupName in this.trainGroupingData) {
  //     this.languageList.push(groupName);
  //   }
  // }

  // setReloadPageCount() {
  //   if (+this.config.Settings[0].ReloadPageCount < this.intervalCount) {
  //     this.intervalCount = 0;
  //     location.reload();
  //   }
  // }

  // updateLanguageData() {
  //   if (this.config) {
  //     this.header = this.config.Headers.find((row: any) =>
  //       row.Lang == this.currentLang
  //     );
  //     if (!this.header) {
  //       this.header = this.config.Headers.find((row: any) =>
  //         row.Lang == ''
  //       );
  //     }

  //     this.settings = this.config.Settings[0];

  //     this.fixedRowCountPerPage = +this.settings.FixedRowCountPerPage;
  //     this.showFixedRowsPerPage = +this.settings.ShowFixedRowsPerPage == 1;
  //     this.noOfCyclePerFetch = +this.settings.NoOfCyclePerFetch;

  //     this.columns = this.config.Columns.filter((row: Column) =>
  //       row.Lang == this.currentLang
  //     );
  //     if (this.columns.length <= 0) {
  //       this.columns = this.config.Columns.filter((row: Column) =>
  //         row.Lang == ''
  //       );
  //     }
  //   }

  //   if (this.trainsDetail) {

  //     this.footers = this.trainsDetail.Footer;

  //     if (!this.timerInterval) {
  //       const inervalTime = (+this.settings.NextRecordIntervalInSeconds) * 1000;
  //       this.timerInterval = setInterval(() => {
  //         this.intervalCount++;
  //         this.updateLanguageData();
  //       }, inervalTime);
  //     }

  //     debugger


  //     if (this.currentLanguageIndex == -1 || this.currentLanguageIndex == this.languageList.length - 1) {
  //       this.currentLanguageIndex = 0
  //     } else {
  //       this.currentLanguageIndex++;
  //     }

  //     const noOfRecordPerPage = +this.settings.NoOfRecordPerPage;
  //     if (this.currentLanguageIndex == 0) {//Change Only First Language
  //       if (this.lastTrainIndex == -1) {
  //         this.lastTrainIndex = 0;
  //       } else {
  //         this.lastTrainIndex = this.lastTrainIndex + noOfRecordPerPage;
  //       }
  //     }

  //     const currentLanguageTrainData = this.trainGroupingData[this.languageList[this.currentLanguageIndex]]
  //     if (currentLanguageTrainData.length > this.lastTrainIndex) {
  //       this.trains = currentLanguageTrainData.filter((row: any, i: number) => i >= this.lastTrainIndex && i <= this.lastTrainIndex + (noOfRecordPerPage - 1));
  //       if (this.showFixedRowsPerPage) {
  //         if (this.trains.length < this.fixedRowCountPerPage) {
  //           const lessRecords = this.fixedRowCountPerPage - this.trains.length;
  //           for (let index = 0; index < lessRecords; index++) {
  //             this.trains.push(
  //               {
  //                 TRAIN_NO: '1'
  //               });
  //           }
  //         }
  //       }
  //     } else {
  //       //clearInterval(this.timerInterval);
  //       //Fetch next when Last Language Record//
  //       if (this.currentLanguageIndex == this.languageList.length - 1) {
  //         this.getData(this.onTrainsSuccess, this.onTrainError);
  //       } else {
  //         //calling next language
  //         this.updateLanguageData();
  //       }
  //     }
  //   }
  // }

  // changeLang(lang: string) {
  //   this.currentLang = lang;
  //   this.updateLanguageData()
  // }
}
