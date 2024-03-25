import { Component } from '@angular/core';
import jsPDF from 'jspdf';
@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent {


  generateOrderPdf(){
    const doc=new jsPDF();
    doc.text('Hello world!',10,10);
    doc.save('orderDetails.pdf');
  }

}
