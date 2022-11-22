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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DatePipe]
})
export class AppComponent implements OnInit {
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
  constructor(private http: HttpClient, private datePipe: DatePipe) {
    this.onConfigSuccess = this.onConfigSuccess.bind(this);
    this.onTrainsSuccess = this.onTrainsSuccess.bind(this);
    console.log('page loaded')
  }
  ngOnInit(): void {
    this.getData(this.onConfigSuccess, this.onConfigError);
    this.getData(this.onTrainsSuccess, this.onTrainError);
    setInterval(() => {
      this.serverDateTime.setSeconds(this.serverDateTime.getSeconds() + 1);
      const time: string | any = this.datePipe.transform(this.serverDateTime, 'HH:mm:ss')
      this.now = time;
    }, 1000);
  }

  getData(successEmit: (result: any) => void, FailEmit: (result: any) => void) {
    const httpOptions = {
      headers: new HttpHeaders({
        'USER_DEVICE_WIDTH': window.screen.availWidth.toString()
      })
    }
    let url = '/api/request/trains';
    if (location.port == '4200') {
      url = 'https://localhost:44328/request/trains'
    }
    const request = this.http.get(url, httpOptions)
      .pipe(take(1)).subscribe(
        {
          next: (v) => successEmit(v as any as TrainStatusModel),
          error: (e) => FailEmit(e),
          complete: () => { request.unsubscribe() }
        }
      );
  }

  onConfigSuccess(result: ResponseModel) {
    this.config = result;
    this.serverDateTime = new Date(this.config.Settings[0].ServerDateTime);
    debugger
    this.updateLanguageData();
  }
  onConfigError(result: any) {

  }
  onTrainsSuccess(result: any) {
    this.lastTrainIndex = -1;
    this.trainsDetail = {};
    this.trainsDetail.Trains = result.Trains;
    this.trainsDetail.Footer = result.Footer;
    this.config.Headers = result.Headers;
    this.config.Settings = result.Settings;
    this.config.Columns = result.Columns;
    if (+this.config.Settings[0].ReloadPageCount < this.intervalCount) {
      this.intervalCount = 0;
      location.reload();
    }




    this.updateLanguageData();
  }
  onTrainError(result: any) {

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

      this.columns = this.config.Columns.filter((row: Column) =>
        row.Lang == this.currentLang
      );
      if (this.columns.length <= 0) {
        this.columns = this.config.Columns.filter((row: Column) =>
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

      const noOfRecordPerPage = +this.settings.NoOfRecordPerPage;
      if (this.lastTrainIndex == -1) {
        this.lastTrainIndex = 0;
      } else {
        this.lastTrainIndex = this.lastTrainIndex + noOfRecordPerPage;
      }
      if (this.trainsDetail.Trains.length > this.lastTrainIndex) {
        this.trains = this.trainsDetail.Trains.filter((row: any, i: number) => i >= this.lastTrainIndex && i <= this.lastTrainIndex + (noOfRecordPerPage - 1));
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
        //this.timerInterval = undefined;
        this.getData(this.onTrainsSuccess, this.onTrainError);
      }
    }
  }

  changeLang(lang: string) {
    this.currentLang = lang;
    this.updateLanguageData()
  }
}
