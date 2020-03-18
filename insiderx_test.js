//var request = require("/opt/node_modules/request");
var rp = require('request-promise');
const {Pool, Client} = require('pg');
var db_host = process.env.DB_HOST;
var reg = process.env.REGION;
const fs = require('fs');

// const connectionString = 'postgresql://postgres:secret@10.80.1.121:5432/apid'
const connectionString = 'postgresql://postgres:galaxy123456@database-2.ch91gk9zmx2h.us-east-1.rds.amazonaws.com/postgres';
function DateFunction(){
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    return dateTime;
}
function comparePrices(a,b){
    if(a.price === null) return 1;
    if(b.price === null) return -1;
    if (a.price > b.price) return 1;
    if (b.price >= a.price) return -1;
}

var DrugId="";
const client = new Client({
    connectionString: 'postgresql://postgres:galaxy123456@database-2.ch91gk9zmx2h.us-east-1.rds.amazonaws.com/postgres'
});
client.connect(function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected to postgres");
        //const promise = generateDrugRequestQueries();
        // client.end();
    }
});
var listDrugs = [];
let pricingData1 = {
    //id : "",
    average_price : 0,
    createdat : DateFunction(),
    difference : 0,
    drug_details_id : 0,
    lowest_market_price : 0,
    pharmacy : "",
    price : 0,
    program_id : 1,
    recommended_price : 0,
    rank:0,
}

//let results =""
let url = ""
let data = []
var len=0;
exports.myhandler = async function (event, context){
    console.log(typeof reg)
    var res1 = await client.query("SELECT request_id FROM shuffle_drugs");
    for(var i=0; i< res1.rows.length ; i++){
        listDrugs.push(res1.rows[i].request_id);
    }
    len = listDrugs.length;
    console.log(listDrugs)
    // const a = len;
    let priceCount = 0;
    for(let k=0; k < len; k++){
        //console.log("listdrugs2:"+k)
        //if(k<=len){
        var drugUrlList = await client.query("SELECT * FROM drug_request where program_id = 0 and drug_name is not null and latitude is not null and longitude is not null and quantity is not null and zipcode = '92648' and drug_id :: int = "+listDrugs[k]);
        if(drugUrlList.rows != 0){
            DrugId = parseInt(drugUrlList.rows[0].drug_id);
            var dname=drugUrlList.rows[0].drug_name
            var dquantity = drugUrlList.rows[0].quantity
            var dndc = drugUrlList.rows[0].ndc
            var lat = drugUrlList.rows[0].latitude
            var lng = drugUrlList.rows[0].longitude
            var brand = drugUrlList.rows[0].brand_indicator

            wrxbody ={
                "ndc": dndc,
                "latitude": lat,
                "longitude": lng,
                "quantity": dquantity,
                "referrer":"null",
                "site_identity" : "irx"
            }

            var options = {
                method: "post",
                body: wrxbody,
                json: true,
                url: "https://insiderx.com/request/pharmacies",
                headers: {
                    // "Referer":"https://www.wellrx.com/prescriptions/"+encodeURI(wrxbody.drugname)+"/08823",
                    "Cookie":"_gcl_au=1.1.923916117.1571676777; _fbp=fb.1.1571676776869.2055137922; _ga=GA1.2.930772864.1571676778; _gid=GA1.2.1882699394.1571676778; _gat_UA-113293481-1=1; _hjid=d6e7565b-1525-4271-8198-042e450e45ac; _hjIncludedInSample=1; geocoords=40.7350747%2C-74.17390569999998; AWSALB=mSNItEQ6fXmxXUsxt5mlUriIXhzEHmbChrsjCmQCdVdp42tXWv07gpOMfIQjeOlkAmbeYVCzgbur0wS6jc3a92h9ZKJJb9cNCF7qpmn5FKV9PH3VfDW/CsYPWDt2",
                    "X-Requested-With":"XMLHttpRequest",
                    "Accept":"application/json",
                    "csrf-token":"Hi6yGXfg-vppErZsd2KXvKmH9LxjPBNJeK48",

                }
            }

            await rp(options)
                .then(async function (response) {
                    console.log("response"+JSON.stringify(response));
                    fs.appendFile('insiderx_url_wednesday.txt', `{'${options.url}', '200', '${listDrugs[k]}};\n`
                        , function(err) {
                            if (err) console.log(err);
                        });
                    //console.log(url)
                })
                .catch(function (err) {
                    console.log(err)
                    fs.appendFile('insiderx_url_wednesday.txt', `{'${options.url}', '${wrxbody}', '${err}', '${listDrugs[k]}};\n`
                        , function(err) {
                            if (err) console.log(err);
                        });
                })

        }else{continue}
    }
}
exports.myhandler();