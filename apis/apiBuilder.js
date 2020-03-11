let fs = require('fs');
const util = require('util');
let faker = require('faker');

const LIMIT = 1000;
const dbDir = 'db';

module.exports = {
    createDb: function () {
        init();

        let promises = [];

        promises.push(builders.validCardTickets());
        promises.push(builders.allowedTicketProviders());
        promises.push(builders.availableTickets());

        return Promise.all(promises);
    }
};

let builders = {
    availableTickets: function(){
        let availableTickets = [];

        for (let index = 0; index < LIMIT; index++) {
            let TicketProvider = faker.random.number({min: 1000000000, max: 9999999999}).toString();
            let timeValidity = faker.hacker.noun();
            let spaceValidity = faker.random.number({min: 1000000000, max: 9999999999}).toString();
            let tariff = faker.random.number({min: 5, max: 200});
            let tariffName = faker.random.word();

            availableTickets.push({TicketProvider, timeValidity, spaceValidity, tariff, tariffName});
        }

        const filename = dbDir + '/availableTicketsDb.json';
        return writeFile(filename, availableTickets);
    },

    allowedTicketProviders: function(){
        let allowedTicketProviders = [];

        for (let index = 0; index < LIMIT; index++) {
            let Provider = faker.random.number({min: 1000000000, max: 9999999999}).toString();
            let providerName = faker.company.companyName();
            let providerColor = faker.internet.color();
            let providerLogo = faker.company.companySuffix();
            let providerTimeZone = faker.address.city();

            allowedTicketProviders.push({Provider, providerName, providerColor, providerLogo, providerTimeZone});
        }

        const filename = dbDir + '/allowedTicketProvidersDb.json';
        return writeFile(filename, allowedTicketProviders);
    },

    validCardTickets: function () {
        let validCardTickets = [];

        for (let index = 0; index < LIMIT; index++) {
            let cardSRN = faker.random.number({min: 1000000000, max: 9999999999}).toString();  //cardSRN 10 number string
            let tariff = faker.random.number({min: 5, max: 200});
            let tariffName = faker.random.word();
            let ticketProvider = faker.random.number();
            let ticketType = faker.random.number({min: 10, max: 99});
            let validFrom = new Date(faker.date.past()).getTime() / 1000 | 0;
            let validTo = new Date(faker.date.future()).getTime() / 1000 | 0;
            let spaceValidity = faker.random.number();
            let zoneName = faker.address.streetName();
            let status = faker.random.number({min: 0, max: 9});

            validCardTickets.push({
                cardSRN,
                tariff,
                tariffName,
                ticketProvider,
                ticketType,
                validFrom,
                validTo,
                spaceValidity,
                zoneName,
                status
            });
        }
        const filename = dbDir + '/validCardTicketsDb.json';

        return writeFile(filename, validCardTickets);
    }
};

function init(){
    if (!fs.existsSync(dbDir)){
        fs.mkdirSync(dbDir);
    }
}

function writeFile(filename, data){
    try{
        fs.unlinkSync(filename);
    }catch (e) {
        console.log(e.message);
    }

    const writeFile = util.promisify(fs.writeFile);
    return writeFile(filename, JSON.stringify([...data]));
}