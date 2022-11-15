export interface Train {
    DISPLAY_ORDER: number;
    TRAIN_NO: string;
    TRAIN_NAME: string;
    TRAIN_TIME: string;
    TRAIN_STATUS: string;
    TRAIN_PLATEFORM: string;
    LANG: string;
    STATUS_COLSPAN: number;
    TRAIN_NO_FONT: string;
    TRAIN_NAME_FONT: string;
    TRAIN_TIME_FONT: string;
    TRAIN_STATUS_FONT: string;
    TRAIN_PLATEFORM_FONT: string;
    TRAIN_NO_COLOR: string;
    TRAIN_NAME_COLOR: string;
    TRAIN_TIME_COLOR: string;
    TRAIN_STATUS_COLOR: string;
    TRAIN_PLATEFORM_COLOR: string;
}

export interface Footer {
    FooterText: string;
    FooterTextFont: string;
    FooterTextColor: string;
    LANG:string;
}

export interface TrainStatusModel {
    Trains: Train[];
    Footer: Footer[];
}

