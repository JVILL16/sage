import { Component } from "@angular/core";

@Component({
  selector: 'app-not-found',
  template: `
  <style>
    

@media only screen and (min-width: 320px) {
  .nf-icon {
    width:300px;
    height: 300px;
}
.nf-container{
  margin-left:10px;
  margin-right:10px
}
}

@media only screen and (min-width: 950px) and (max-width: 2000px) {
  .nf-icon {
    width:400px;
    height: 400px;
}
.nf-container{
  margin-left:400px;
  margin-right:400px
}
}
.card {
    background: none;
}
.nf-display {
    display:flex;
    justify-content: center;
    align-items: center;
}
  </style>
  <div class="container-fluid">
    <div class="row nf-container">
        <div class="col-xl-6 nf-display">
            <img class="nf-icon" src="assets/404icon.png">
        </div>
        <div class="col-xl-6 nf-display ">
          <div class="card  shadow-lg border-secondary mt-3" style="margin: 0 auto;max-width:600px">
            <h3 class="card-header gradient-admin">404 - Error</h3>
            <div class="card-body" style="color:white">
              <p>Sorry for the inconvenience! Either the page is not found or it does not exist. Please send a message or email about the issue. </p>
            </div>
          </div>
        </div>
    </div>
  </div>
    
   

  `
})
export class NotFoundComponent { }