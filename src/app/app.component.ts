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

  constructor(private http: HttpClient, private datePipe: DatePipe) {
    this.onConfigSuccess = this.onConfigSuccess.bind(this);
    this.onTrainsSuccess = this.onTrainsSuccess.bind(this);
    console.log('page loaded')
  }
  ngOnInit(): void {
    this.getData(this.onConfigSuccess, this.onConfigError);
    this.getData(this.onTrainsSuccess, this.onTrainError);
    setInterval(() => {
      const time: string | any = this.datePipe.transform(new Date(), 'HH:mm:ss')
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
    if (location.hostname == 'localhost') {
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
        this.lastTrainIndex = this.lastTrainIndex + (noOfRecordPerPage + 1)
      }
      if (this.trainsDetail.Trains.length > this.lastTrainIndex) {
        this.trains = this.trainsDetail.Trains.filter((row: any, i: number) => i >= this.lastTrainIndex && i <= this.lastTrainIndex + (noOfRecordPerPage - 1));
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
