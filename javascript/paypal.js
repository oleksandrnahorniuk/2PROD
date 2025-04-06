import { getAudioURL } from "./download.js";
import { db, update, dbRef, get, child } from "./firebase.js";
// import {currentTrackId} from "./checkout.js";

const currentTrackId = localStorage.getItem("currentTrackId");
console.log(currentTrackId);

function getCurrentDate() {
    const now = new Date();
    return now.toISOString(); 
}

// Inicjalizacja przycisku PayPal z podaną ceną
export function initializePayPalButton(price) {
    paypal.Buttons({
        style: {
            color: 'blue',
            shape: 'rect',
            label: 'pay',
        },

        // Tworzenie zamówienia
        createOrder: function (data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: price, 
                    }
  
                }]
            });
        },

        // Przetwarzanie udanej realizacji płatności
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                alert(`Transaction completed by ${details.payer.name.given_name}`);
                console.log('Transaction Details:', details);

                // Dodawanie informacji o zakupie do bazy danych
                const updates = {};
                updates[`purchases/${currentTrackId}`] = {
                    buyerName: details.payer.name.given_name,
                    buyerEmail: details.payer.email_address,
                    amountPaid: price,
                    date: getCurrentDate(),
                    licenseType: licenseType
                };

                getAudioURL(currentTrackId);
    
                update(dbRef(db), updates)
                    .then(() => {
                        console.log('Purchase recorded in the database.');
                    })
                    .catch((error) => {
                        console.error('Error updating Firebase:', error);
                    });
            });
        },

        // Обработка ошибок
        onError: function (err) {
            console.error('PayPal error:', err);
            alert('An error occurred with your payment. Please try again.');
        }

    }).render('#paypal-button-container'); // ID элемента для отображения кнопки
}
