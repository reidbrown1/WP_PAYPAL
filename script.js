
// firebase.initializeApp(firebaseConfig);

// Helper / Utility functions
let url_to_head = (url) => {
    return new Promise(function(resolve, reject) {
        var script = document.createElement('script');
        script.src = url;
        script.onload = function() {
            resolve();
        };
        script.onerror = function() {
            reject('Error loading script.');
        };
        document.head.appendChild(script);
    });
}
let handle_close = (event) => {
    event.target.closest(".ms-alert").remove();
}
let handle_click = (event) => {
    if (event.target.classList.contains("ms-close")) {
        handle_close(event);
    }
}
document.addEventListener("click", handle_click);
const paypal_sdk_url = "https://www.paypal.com/sdk/js";
const client_id = "AdQ9bkeiWauaSO6YSvWqg1F2e79nK_1GUuemNgHpanxjzQzxFWA-HCr3Cf5kBM8pA7YceyTzXqZWDhl4";
const currency = "USD";
const intent = "capture";
let alerts = document.getElementById("alerts");

//PayPal Code
//https://developer.paypal.com/sdk/js/configuration/#link-queryparameters
url_to_head(paypal_sdk_url + "?client-id=" + client_id + "&enable-funding=venmo&currency=" + currency + "&intent=" + intent)
.then(() => {
    //Handle loading spinner
    document.getElementById("loading").classList.add("hide");
    //document.getElementById("content").classList.remove("hide");
    let alerts = document.getElementById("alerts");
    let paypal_buttons = paypal.Buttons({ // https://developer.paypal.com/sdk/js/reference
        onClick: (data) => { // https://developer.paypal.com/sdk/js/reference/#link-oninitonclick
            console.log("CLICKED")
        },
        style: { //https://developer.paypal.com/sdk/js/reference/#link-style
            shape: 'rect',
            color: 'gold',
            layout: 'vertical',
            label: 'paypal'
        },

        createOrder: function(data, actions) { //https://developer.paypal.com/docs/api/orders/v2/#orders_create
            console.log("GOT TO CREATE")
            return fetch("https://wppaypal-zuj4eapv2q-ue.a.run.app/create_order", {
                method: "post", headers: { "Content-Type": "application/json; charset=utf-8" },
                body: JSON.stringify({ "intent": intent })
            })
            .then((response) => response.json())
            .then((order) => { 
                console.log(order); // Add this line
                console.log("ORDER.ID is" + order.id)
                return order.id;
            });
        },

        onApprove: function(data, actions) {
            console.log("GOT TO APPROVE")
            let order_id = data.orderID;
            return fetch("https://wppaypal-zuj4eapv2q-ue.a.run.app/complete_order", {
                method: "post", headers: { "Content-Type": "application/json; charset=utf-8" },
                body: JSON.stringify({
                    "intent": intent,
                    "order_id": order_id
                })
            })
            .then((response) => response.json())
            .then((order_details) => {
                console.log(order_details); //https://developer.paypal.com/docs/api/orders/v2/#orders_capture!c=201&path=create_time&t=response
                let intent_object = intent === "authorize" ? "authorizations" : "captures";
                //Custom Successful Message
                alerts.innerHTML = `<div class=\'ms-alert ms-action\'>Thank you ` + order_details.payer.name.given_name + ` ` + order_details.payer.name.surname + ` for your payment of ` + order_details.purchase_units[0].payments[intent_object][0].amount.value + ` ` + order_details.purchase_units[0].payments[intent_object][0].amount.currency_code + `!</div>`;

                //Close out the PayPal buttons that were rendered
                paypal_buttons.close();


                const url = new URL(window.location.href);

                // Get the userID and amount from the URL's query parameters
                const userID = url.searchParams.get('userID');
                const amount = url.searchParams.get('amount');
                const purchaseCompleted = firebase.functions().httpsCallable('purchaseCompleted');

                purchaseCompleted({ userID: userID, amount: amount })
                    // .then((result) => {
                    //     console.log(result.data);
                    // })
                    // .catch((error) => {
                    //     console.log(error);
                    // });



             })
             .catch((error) => {
                console.log(error);
                alerts.innerHTML = `<div class="ms-alert ms-action2 ms-small"><span class="ms-close"></span><p>An Error Ocurred!</p>  </div>`;
             });

             
        },

        onCancel: function (data) {
            alerts.innerHTML = `<div class="ms-alert ms-action2 ms-small"><span class="ms-close"></span><p>Order cancelled!</p>  </div>`;
        },

        onError: function(err) {
            console.log(err);
        }
    });
    paypal_buttons.render('#payment_options');
})
.catch((error) => {
    console.error(error);
});