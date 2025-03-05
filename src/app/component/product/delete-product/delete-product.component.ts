import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NotifyService } from 'src/app/service/notify.service';
import { ProductsService } from 'src/app/service/products.service';

@Component({
  selector: 'app-delete-product',
  templateUrl: './delete-product.component.html',
  styleUrls: ['./delete-product.component.css']
})
export class DeleteProductComponent {



  constructor(private productService:ProductsService,private notify:NotifyService){}
  deleteForm:FormGroup=new FormGroup({
    id:new FormControl()
  })
  handleDeleteProduct(form:FormGroup){
    let text=`Are you sure you want to Delete the product:${form.value['id']} `
    console.log(form.value['id']);
    if(confirm(text)==true)
    {
      this.productService.deleteProduct(form.value['id']).subscribe({
        next:(res)=>{
          this.notify.showSuccess("Product Deleted Successfully","Info😺")
          this.deleteForm.reset()
        },
        error:(err)=>{
          this.notify.showError("Can't Delete Product","Info😿")
          console.log(err.message);
          
        }
  
      })
    }
    
  }
}
