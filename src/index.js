const parseQuery = require('./queryParser');
const readCSV = require('./csvReader');

function evaluateCondition(row, clause) {
    const { field, operator, value } = clause;
    switch (operator) {
        case '=': return row[field] === value;
        case '!=': return row[field] !== value;
        case '>': return parseFloat(row[field]) > parseFloat(value);
        case '<': return parseFloat(row[field]) < parseFloat(value);
        case '>=': return parseFloat(row[field]) >= parseFloat(value);
        case '<=': return parseFloat(row[field]) <= parseFloat(value);
        default: throw new Error(`Unsupported operator: ${operator}`);
    }
}

async function executeSELECTQuery(query) {
    const { fields, table, whereClauses } = parseQuery(query);
    const data = await readCSV(`${table}.csv`);
    

    const filteredData = whereClauses.length > 0
        ? data.filter(row => whereClauses.every(clause => evaluateCondition(row, clause)))
        : data;

    return filteredData.map(row => {
        const selectedRow = {};
        fields.forEach(field => {
            selectedRow[field] = row[field];
        });
        return selectedRow;
    });
}

module.exports = executeSELECTQuery;
