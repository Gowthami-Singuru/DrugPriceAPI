// PRODUCTION IMPORTS
// const rp = require('/opt/node_modules/request-promise');
// const {Client} = require('/opt/node_modules/pg');

// DEV IMPORTS
const rp = require('request-promise');
const {
    Client
} = require('pg');
//let db_host = process.env.DB_HOST || "postgresql://postgres:galaxy123456@database-2.ch91gk9zmx2h.us-east-1.rds.amazonaws.com/postgres";
let db_host = "postgresql://postgres:secret@100.25.217.246:5432/rxwavedb_qa";
let reg = process.env.REGION || "virginia";
const client = new Client({
    connectionString: db_host
});
client.connect();

function comparePrices(a, b) {
    if (a.price === null) return 1;
    if (b.price === null) return -1;
    if (a.price > b.price) return 1;
    if (b.price >= a.price) return -1;
}

/**
 * @return {string}
 */
function DateFunction() {
    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return date + ' ' + time;
}
let DrugId = "";
let listDrugs = [];
let pricingData1 = {
    average_price: 0,
    createdat: DateFunction(),
    difference: 0,
    drug_details_id: 0,
    lowest_market_price: 0,
    pharmacy: "",
    price: 0,
    program_id: 7,
    recommended_price: 0,
    unc_price_flag: false
};

let url1 = "";
let len = 0;

async function handler(event, context) {

    // create rxsaver flag in db and update code here TODO
    //let res1 = await client.query("SELECT request_id FROM shuffle_drugs where blink_flag = 'pending' and region = '" + reg + "'");
    let res1 = await client.query("SELECT request_id FROM shuffle_drugs where blink_flag = 'pending' and region = '" + reg + "'");

    for (let i = 0; i < res1.rows.length; i++) {
        listDrugs.push(res1.rows[i]["request_id"]);
    }
    // listDrugs = ["283907","283908","283909","283910","283911"];
    len = listDrugs.length;
    for (let k = 0; k < len; k++) {
        let drugUrlList = await client.query("SELECT * FROM drug_request where program_id = 0 and quantity is not null and good_rx_id is not null and drug_id :: int =" + listDrugs[k]);
        if (drugUrlList.rows.length === 1) {
            url1 =    "https://rxsaver.retailmenot.com/api/v2/priceListItems?ndc="+drugUrlList.rows[0].ndc+"&quantity="+drugUrlList.rows[0].quantity+"&zipCode="+drugUrlList.rows[0].zipcode+"&distance=5"

            const options = {
                url: url1,
                method: 'GET',
                json: true,
                headers: {
                    "authority": "rxsaver.retailmenot.com",
                   // "path": "/api/v2/priceListItems?pda=ATORVASTATIN+TAB+40MG++++&ndc=68645056854&quantity=2&daysSupply=2&zipCode=07101&distance=20",
                    "cookie": "rx-saver-user-test-id=s%3A5389faa1-6223-4226-abbf-e7a522fe3d7a.f1aBZF1H4LRrohJZNnFfuOiqE49bNYVnseOGCllqXZs; ajs_group_id=null; ajs_user_id=%225389faa1-6223-4226-abbf-e7a522fe3d7a%22; ajs_anonymous_id=%226530dacf-7342-43a5-9c53-edc97c317194%22; _ga=GA1.2.1675254658.1583435643; __utmc=77924951; __utmz=77924951.1583512123.2.2.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); __cfduid=dec725bd1e198ba75a0f4ac245383ccef1583948084; _gid=GA1.2.589001340.1584471909; ak_bmsc=0D763BFFE9E4306D417BC5D5316DEEC3172B3A3EB14E00009257715E646F1418~plMBYi1u8SjN8V29vHvfY05I85n/VZ3ELsDOHeurRsFTX9ihjUK7J3KIa/eofnZ0yn7CiRxG5q/Ix6mIQxMhmDc3J/VpRRV6dNs2rxG3TzmOb54Fq25k/NhHTozfPqdJJDkEnjRy+3YD+J9YQNxH+0pcgAut80Q5BT3VA5BInXVYxsHa8bu0mJwqaRCUgJhMUr6+fMTTs2PkUloybPeIEWrX/pHhHOT2DrYT0iuTr0g3c=; _gat=1; __utma=77924951.1675254658.1583435643.1584471909.1584488174.4; __utmt_UA-11902172-4=1; __utmb=77924951.1.10.1584488174; bm_sv=8BEB31BC07FD78A7CE148835FF5F5CFD~PaKjgM79ael2jdFJxQ4sO1HhtR51B7pWCOuHhIix8VuTrWgRo6zYeRNOTOZrWJQjbpRvVQO03/urfM054bz7oRjgEyGZxudbm4ZX0g3Ur95BOoJ34vEByPjcGHBH2teMyyOl7wXuC0CEXtAa4WRxmZNji5pMtS6OTyrK57WZtAM=",
                    "referer": "https://rxsaver.retailmenot.com/drugs/atorvastatin-calcium/coupons",
                    "sec-fetch-site": "same-origin",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-dest": "empty"
                }
            };

            let CVSPrice = {};
            CVSPrice.price = null;
            CVSPrice.pharmacy = null;
            CVSPrice.rank = 0;
            let WalmartPrice = {};
            WalmartPrice.price = null;
            WalmartPrice.pharmacy = null;
            WalmartPrice.rank = 0;
            let WalgreenPrice = {};
            WalgreenPrice.price = null;
            WalgreenPrice.pharmacy = null;
            WalgreenPrice.rank = 0;
            let KrogerPrice = {};
            KrogerPrice.price = null;
            KrogerPrice.pharmacy = null;
            KrogerPrice.rank = 0;
            let OtherPrice = {};
            OtherPrice.price = null;
            OtherPrice.pharmacy = null;
            OtherPrice.rank = 0;

            try {
                console.log("url"+url1);
                await rp(options)
                    .then(async function (body) {
                        console.log("response="+body);
                        Object.keys(body["priceListItems"]).forEach(function (key) {
                            if(body["priceListItems"][key]['preferred'] === true) {
                                if (body["priceListItems"][key]['name'].toUpperCase().includes("CVS")) {
                                    CVSPrice.price = body["priceListItems"][key]['price']['discounted'];
                                    CVSPrice.pharmacy = body["priceListItems"][key]['name'];
                                } else if (body["priceListItems"][key]['name'].toUpperCase().includes("WALMART")) {

                                    WalmartPrice.price = body["priceListItems"][key]['price']['discounted'];
                                    WalmartPrice.pharmacy = body["priceListItems"][key]['name'];


                                } else if (body["priceListItems"][key]['name'].toUpperCase().includes("WALGREENS")) {

                                    WalgreenPrice.price = body["priceListItems"][key]['price']['discounted'];
                                    WalgreenPrice.pharmacy = body["priceListItems"][key]['name'];


                                } else if (body["priceListItems"][key]['name'].toUpperCase().includes("KROGER")) {

                                    KrogerPrice.price = body["priceListItems"][key]['price']['discounted'];
                                    KrogerPrice.pharmacy = body["priceListItems"][key]['name'];


                                } else {

                                    OtherPrice.price = body["priceListItems"][key]['price']['discounted'];
                                    OtherPrice.pharmacy = body["priceListItems"][key]['name'];


                                }
                            }

                        });
                            let pricesArr = [WalgreenPrice, WalmartPrice, CVSPrice, OtherPrice, KrogerPrice];
                            console.log("pricesArr");
                            console.log(pricesArr);

                            pricesArr.sort(comparePrices);

                            pricesArr[0].rank = 0;
                            pricesArr[1].rank = 1;
                            pricesArr[2].rank = 2;
                            pricesArr[3].rank = 3;
                            pricesArr[4].rank = 4;

                            console.log(pricesArr);
                            for (const price of pricesArr) {
                                pricingData1.price = price.price;
                                pricingData1.pharmacy = price.pharmacy;
                                pricingData1.rank = price.rank;

                                const query2 = 'INSERT INTO public_price(average_price, createdat, difference, drug_details_id, lowest_market_price, pharmacy, price, program_id, recommended_price,rank, unc_price) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *';
                                const values = [pricingData1.average_price, pricingData1.createdat, pricingData1.difference, drugUrlList.rows[0]["drug_id"], pricingData1.lowest_market_price, pricingData1.pharmacy, pricingData1.price, pricingData1.program_id, pricingData1.recommended_price, pricingData1.rank, null];
                                await client.query(query2, values)
                                    .catch(e => {
                                        console.log(e)
                                    })
                            }

                            DrugId = drugUrlList.rows[0]["drug_id"];
                            let query3 = 'UPDATE shuffle_drugs SET blink_flag = \'completed\' WHERE request_id = $1';
                            let values = [DrugId];
                            await client.query(query3, values)
                                .then(() => {
                                    console.log('Updated shuffle_drugs' + DrugId);
                                }).catch((error) => console.log(error));

                            // if (context.getRemainingTimeInMillis() < 30000) {
                            //     process.exit(0);
                            // }
                        }).catch(function (error) {
                            console.log("Error"+error);
                    })
            } catch (error) {
                console.log(error.error);
                DrugId = drugUrlList.rows[0]["drug_id"];
                let query3 = 'UPDATE shuffle_drugs SET blink_flag = \'failed\' WHERE request_id = $1';
                let values = [DrugId];
                await client.query(query3, values)
                    .then(() => {
                        console.log('Updated shuffle_drugs' + DrugId);
                    }).catch((error) => console.log(error));

                // if (context.getRemainingTimeInMillis() < 30000) {
                //     process.exit(0);
                // }
            }

        }
    }

    process.exit(0);
}

// exports.myhandler = handler;

handler();
// module.exports = handler;