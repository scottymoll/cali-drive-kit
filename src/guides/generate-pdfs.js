const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generatePDF(htmlFile, outputFile) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Read the HTML file
    const htmlContent = fs.readFileSync(htmlFile, 'utf8');
    
    // Set the content
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    // Generate PDF
    await page.pdf({
        path: outputFile,
        format: 'A4',
        margin: {
            top: '0.75in',
            right: '0.75in',
            bottom: '0.75in',
            left: '0.75in'
        },
        printBackground: true,
        displayHeaderFooter: false
    });
    
    await browser.close();
    console.log(`PDF generated: ${outputFile}`);
}

async function main() {
    try {
        // Generate Basic Kit PDF
        await generatePDF(
            path.join(__dirname, 'basic-kit-guide.html'),
            path.join(__dirname, 'CA-Car-Seller-Kit-Basic-Edition.pdf')
        );
        
        // Generate Premium Kit PDF
        await generatePDF(
            path.join(__dirname, 'premium-kit-guide.html'),
            path.join(__dirname, 'CA-Car-Seller-Kit-Premium-Edition.pdf')
        );
        
        console.log('All PDFs generated successfully!');
    } catch (error) {
        console.error('Error generating PDFs:', error);
    }
}

main();
