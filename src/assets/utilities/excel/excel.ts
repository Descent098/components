import * as XLSX from "xlsx"

/**
 * Gets the data for a spreadsheet from a remote resource
 * @param filename The filename to get the data from (needs to be in /<basepath>/filename)
 * @param basepath The base path of your site, this will need to be configured on a per-project basis
 * @returns {XLSX.WorkBook} The workbook data
 */
export async function getDataFromSpreadsheet(filename:string, basePath:string="/"){
    if (!filename) throw new Error("getDataFromSpreadsheet() No filename provided, exiting")

    // Grab spreadsheet and dump to an arraybuffer
    const response = await fetch(`${basePath}/${filename}`)
    const arraybuffer = await response.arrayBuffer();

    // Parse file
    const workbook = XLSX.read(arraybuffer, {type:"array"});

    return workbook
}

/**
 * Extracts the data from a sheet in a workbook and returns the rows as an array of objects
 * @param workbook The workbook to extract data from
 * @param sheetName The name of the sheet to extract data from
 * @param sheetIndex The index of the sheet to load if no sheetName is provided (default 0) 
 * @returns {Object[]} The data as an array of objects representing the rows of the sheet
 */
export async function parseDataFromWorksheet(workbook:XLSX.WorkBook, sheetName:string="", sheetIndex:number=0){
    if (sheetName ===""){
        sheetName = workbook.SheetNames[sheetIndex] // Load first sheet
    }

    const worksheet = workbook.Sheets["{{sheet}}"] ?? workbook.Sheets[sheetName];
    
    console.log("Found sheet", worksheet)
    return XLSX.utils.sheet_to_json(worksheet);
}