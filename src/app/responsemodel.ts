
export interface HeaderSetting {
    TitleLeft: string;
    TitleLeftFont: string;
    TitleMiddle: string;
    TitleMiddleFont: string;
    TitleRight: string;
    TitleRightFont: string;
    SubTitleLeft: string;
    SubTitleLeftFont: string;
    SubTitleMiddle: string;
    SubTitleMiddleFont: string;
    SubTitleRight: string;
    SubTitleRightFont: string;
    Lang: string;
    LastUpdateTime: Date;
}

export interface DesignSetting {
    TitleBGColor: string;
    SubBGColor: string;
    TitleVisible: number;
    SubVisible: number;
    BorderSize: number;
    BorderColor: string;
    TableBorderSizes: number;
    TableBorderColor: string;
    TableBorderRound: number;
    TableBgColor: string;
    FooterBgColor: string;
    FooterHeight: number;
    FooterDelimeter: string;
    FooterPadding: number;
}

export interface Column {
    ColumnName: string;
    ColumnCaption: string;
    ColumnWidth: number;
    ColumnFont: string;
    Lang: string;
}

export interface ResponseModel {
    HeaderSettings: HeaderSetting[];
    DesignSetting: DesignSetting;
    Columns: Column[];
}
