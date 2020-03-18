const fs = require('fs');
const zipcodes = require('zipcodes');
const { Client } = require('pg');
const client = new Client({
    connectionString: 'postgresql://postgres:galaxy123456@database-2.ch91gk9zmx2h.us-east-1.rds.amazonaws.com/postgres'
});
client.connect(function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected to postgres");
        const promise = insertDailyDrugs();
        // client.end();
    }
});



async function insertDailyDrugs() {
    const drugMasterList = fs.readFileSync('tuesdayArray.json');
    let drugArr = JSON.parse(drugMasterList.toString());
    let queries = [];
    console.log("drugArr length: ",drugArr.length);
    for (let k = 0; k < drugArr.length; k++) {
                // console.log(quantities[k]);
                const query = `INSERT INTO public.report_dm(
                        id, drug_id, schedule)
                        VALUES ('${drugArr[k]}','${drugArr[k]}', 'tuesday');`;
        //queries.push(query);
                client.query(query, (err, res) => {
                    if (err) {
                        console.log(err);
                        console.log(query);
                    }
                    console.log(res);
                });

    }
    // fs.writeFile('wednesday_request.json', JSON.stringify(queries), function(err) {
    //     if (err) throw err;
    //     console.log("Done");
    // });
}

