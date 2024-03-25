import { Component, Input } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ActivatedRoute } from '@angular/router';
import { Order } from 'src/app/model/order/Order';
import { OrderResponse } from 'src/app/model/order/OrderResponse';
import { OrderItemDetails } from 'src/app/model/order/orderItemDetails';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css'],
})
export class StatusComponent {
  @Input() orderItemDetails!: OrderItemDetails[];
  @Input() orderResponse!:OrderResponse
  currentDate: any;
  constructor(private route: ActivatedRoute, private datePipe: DatePipe) {
    this.currentDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy');
  }

  generateOrderPdf() {
    html2canvas(document.getElementById('invoice')!).then((canvas) => {
      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jsPDF('p', 'mm', 'a4');
      // var width = pdf.internal.pageSize.getWidth();
      // var height = (canvas.height * width) / canvas.width;

      // pdf.addImage(contentDataURL, 'PNG', 0, 0, width*2, height*2);
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Calculate the scaling ratio to fit the image within the A4 page margins (optional)
      const margin = 10; // Adjust margin as needed (in millimeters)
      const maxWidth = pageWidth - margin * 2;
      const maxHeight = pageHeight - margin * 2;

      let scaleX = maxWidth / imgWidth;
      let scaleY = maxHeight / imgHeight;

      // Choose the smaller scaling factor to ensure the image fits within margins
      const scalingFactor = Math.min(scaleX, scaleY) * 1.5;
      const scaledWidth = imgWidth * scalingFactor;
      const scaledHeight = imgHeight * scalingFactor;
      const imageX = (pageWidth - scaledWidth) / 2;
      const imageY = margin;

      // Add the image to the PDF, centered on the page
      pdf.addImage(
        contentDataURL,
        'PNG',
        imageX,
        imageY,
        scaledWidth,
        scaledHeight
      );
      pdf.save('invoice.pdf');
    });
  }
}
