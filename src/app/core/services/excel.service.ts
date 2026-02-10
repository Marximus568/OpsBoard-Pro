import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
    providedIn: 'root'
})
export class ExcelService {

    public exportAsExcelFile(json: unknown[], excelFileName: string): void {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: unknown = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }

    private saveAsExcelFile(buffer: unknown, fileName: string): void {
        const data: Blob = new Blob([buffer as BlobPart], { type: EXCEL_TYPE });
        // Use window.URL.createObjectURL for modern browser download
        const url = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION;
        link.click();
        window.URL.revokeObjectURL(url);
    }
}
