import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import twilio from 'twilio';
const api = new twilio('TWILIO_SID','TWILIO_AUTH_TOKEN');

async function fetchHtml(url){
    try{
        const response = await fetch(url);
        const text = await response.text();
       
        const page = new JSDOM(text);
        return page;
    }catch(e){
        return false;
    }
}

function getPrice(page){
    const obj = page.window.document.querySelector('.PaOrf');
   
    
    if(obj){
        let price = obj.textContent;
        const number = Number(price.replace(/[^0-9.-]+/g,""));
        return number;
    }else{
        return false;
    }

}

function checkThreshold(price,threshold){
    if(price > threshold){
        return true;
    }else{
        return false;
    }
}

// const currencies = ['bitcoin','ethereum','cardano','ripple'];
const currencies = {
    'bitcoin':'10000','ethereum':'6000','cardano':'1.50','xrp':'1'
};

for(const currency in currencies){
    let url = `https://coinmarketcap.com/currencies/${currency}/`;

    fetchHtml(url).then((page)=>{
        const price = getPrice(page);
        if(price){
            console.log(`The current price of ${currency} is $${price}`);
            if(checkThreshold(price,currencies[currency])){
                sendMessage(currency,price);
            }
            
        }
        
    });
}

function sendMessage(currency,price){
    let msg = `The current price of ${currency} is $${price}`
    api.messages.create({
        body: msg,
        from: 'FROM_NUMBER',
        to: 'TO_NUMBER'
    });
}



 