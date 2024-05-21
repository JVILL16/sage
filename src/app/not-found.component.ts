import { Component } from "@angular/core";

@Component({
  selector: 'app-not-found',
  template: `
<style>
    @media only screen and (min-width: 320px) {
        .nf-icon {
            width: 200px;
            height: 200px;
        }

        .nf-container {
            /* margin-left:10px;
      margin-right:10px */
            margin: 0 auto;
            max-width: 600px
        }
    }

    @media only screen and (min-width: 950px) and (max-width: 2000px) {
        .nf-icon {
            width: 400px;
            height: 400px;
        }

        .nf-container {
            /* margin-left:400px;
      margin-right:400px */
            margin: 0 auto;
            max-width: 1000px
        }
    }

    .card {
        background: none;
    }

    .nf-display {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .nf-display-card {
        justify-content: center;
        align-items: center;
    }
</style>
<div class="container-fluid">
    <div class="nf-container">
        <div class="card  shadow-lg border-secondary mt-3" style="">
            <h3 class="card-header gradient-admin">404 - Error</h3>
            <div class="card-body">
                <table>
                    <tr>
                        <td>
                            <img style="width:150px;height: 150px;" src="assets/404icon.png">
                        </td>
                        <td style="color:white">
                            <div class="container-fluid row">
                                <p>Sorry for the inconvenience! Either the page is not found or it does not exist.
                                    Please send a message or email about the issue. </p>

                            </div>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</div>
  `
})
export class NotFoundComponent { }