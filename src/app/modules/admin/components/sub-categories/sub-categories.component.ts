import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UserService } from '../../../../core/services/user.service';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs';
import { Subcategory } from '../../../../shared/Models/subcategory';

@Component({
  selector: 'app-sub-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sub-categories.component.html',
  styleUrl: './sub-categories.component.scss'
})
export class SubCategoriesComponent implements OnInit  {

  titleName!:string;
  categoryId!:number;
  allSubcategory!:Subcategory[]

  constructor(private userService:UserService,private title:Title,private route:ActivatedRoute,private router:Router) {
  }


  ngOnInit(): void {

    this.route.queryParams.subscribe( param => 
      {        
        this.titleName = param['name']
        this.title.setTitle(this.titleName);
        this.categoryId = param['id'];
        this.getAllSubcategory()

      } );

  }


  getAllSubcategory()
  {
    
    this.userService.getSubCategories(this.categoryId).subscribe( (res:any) =>
    {
      this.allSubcategory = res;
    } )
  }



  onNavigate(subcategoryId:number,subcategoryName:string)
  {    
    this.router.navigate([`/productsView`] , {  queryParams: { id:subcategoryId,name:subcategoryName}});    
  }







  
}
