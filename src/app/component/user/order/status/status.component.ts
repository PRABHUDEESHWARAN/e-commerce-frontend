import { Component, Input } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ActivatedRoute } from '@angular/router';
import { Order } from 'src/app/model/order/Order';
import { OrderResponse } from 'src/app/model/order/OrderResponse';
import { OrderItemDetails } from 'src/app/model/order/orderItemDetails';


@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css'],
})
export class StatusComponent {
  @Input() orderItemDetails!: OrderItemDetails[];
  
  constructor(private route: ActivatedRoute) {
    
  }

  generateOrderPdf() {
    
    html2canvas(document.getElementById("store")!).then(canvas=>{
      const contentDataURL=canvas.toDataURL('image/png')
      let pdf=new jsPDF('p','mm','a4');
      var width=pdf.internal.pageSize.getWidth();
      var height=canvas.height*width/canvas.width;
      pdf.addImage(contentDataURL,'PNG',0,0,width,height);
      pdf.save('invoice.pdf');
    })
    
  }
}
