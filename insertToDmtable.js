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
        //const promise = generateDrugRequestQueries();
        // client.end();
    }
});

function generateDrugMasterQueries() {
    const drugMasterList = fs.readFileSync('drug_request_skelton.json');
    let index = 287492;
    let zips = ['07083', '30062', '60657', '75034', '92648'];
    let drugArr = JSON.parse(drugMasterList.toString());
    for (let drug of drugArr) {
        // console.log(drug);
        for (const zip of zips) {
            // fs.appendFile('drug_master_script.txt',
            var regexp = /^\d+\.\d{0,2}$/;
            if(regexp.test(drug.Quantity)){
                quantity = drug.Quantity;
            }else{
                quantity = drug.Quantity+".0";
            }
            fs.appendFile('drug_query.txt',
                `INSERT INTO drug_master(
                    id, dosage_strength, dosageuom, drug_type, gsn, name, ndc, quantity, report_flag, zip_code)
                    VALUES (${index}, '${drug.DosageStrength}', null, '${drug.DrugForm}', '${drug.GSN}', '${drug.DrugName}',
                        '${drug.NDC}', ${quantity}, true, '${zip}');\n`
                , function(err) {
                    if (err) console.log(err);
                });
            drug.DrugIDs.push(index);
            index += 1;
        }
    }

    fs.writeFile('drugRequest.json', JSON.stringify(drugArr), function(err) {
        if (err) console.log(err);
        console.log("Done");
    });
}

generateDrugMasterQueries();