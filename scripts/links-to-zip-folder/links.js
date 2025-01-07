const axios = require("axios");
const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");
const moment = require("moment");

async function downloadImages(imageUrls, toZip = false) {
  // Current date and time for output folder naming
  const currentTime = moment().format("YYYY-MM-DD_HH-mm-ss");
  const outputFolder = path.join(__dirname, "outputs", currentTime);
  fs.mkdirSync(outputFolder, { recursive: true });

  // Get Links
  const downloadedFiles = [];

  for (let i = 0; i < imageUrls.length; i++) {
    const url = imageUrls[i];
    try {
      console.log(`Downloading image ${i + 1}: ${url}`);
      const response = await axios.get(url, { responseType: "arraybuffer" });

      // Extracting image name from URL
      const imageName = path.basename(url.split("?")[0]); // Removes query parameters from URL
      const imagePath = path.join(outputFolder, imageName);

      // Add image in the output folder
      fs.writeFileSync(imagePath, response.data);
      downloadedFiles.push(imagePath);
      console.log(`Image saved: ${imagePath}`);
    } catch (error) {
      console.error(`Failed to download ${url}: ${error.message}`);
    }
  }

  // If toZip is true, zip the images
  if (toZip) {
    const zip = new AdmZip();
    downloadedFiles.forEach((filePath) => {
      // const fileName = path.basename(filePath);
      zip.addLocalFile(filePath); // Add image file to zip
    });

    // Create a zip file in the output folder
    const zipFilename = path.join(outputFolder, `${currentTime}.zip`);
    zip.writeZip(zipFilename);
    console.log(`Images have been zipped into ${zipFilename}`);

    // Remove individual files after zipping
    // downloadedFiles.forEach((filePath) => fs.unlinkSync(filePath));
  } else {
    console.log(`Images saved to folder: ${outputFolder}`);
  }
}

// Usage
const imageUrls = [
  "https://busichat2.remap.ai/wp-content/uploads/2024/12/Salesforce-Horizontal-e1733908618213.png",
  "https://busichat2.remap.ai/wp-content/uploads/2024/12/Trello-New.png",
  "https://busichat2.remap.ai/wp-content/uploads/2024/12/Make-Formerly-Integromat-e1733908647473.png",
  "https://busichat2.remap.ai/wp-content/uploads/2024/12/monday.com_-e1733908662955.png",
  "https://busichat2.remap.ai/wp-content/uploads/2024/12/Stripe-New-e1733908673339.png",
  "https://busichat2.remap.ai/wp-content/uploads/2024/12/Gmail-with-Text-e1733908686366.png",
  "https://busichat2.remap.ai/wp-content/uploads/2024/12/Gmail-with-Text-e1733908686366.png",
  "https://busichat2.remap.ai/wp-content/uploads/2024/12/Google-Meet-Icon.png",
  "https://busichat2.remap.ai/wp-content/uploads/2024/12/Google-Workspace-e1733908726900.png",
  "https://busichat2.remap.ai/wp-content/uploads/2024/12/Pipedrive.png",
  "https://busichat2.remap.ai/wp-content/uploads/2024/12/HubSpot.png",
  "https://busichat2.remap.ai/wp-content/uploads/2024/12/Zapier-New-2022.png",
  "https://busichat2.remap.ai/wp-content/uploads/2024/12/ZOHO-New-e1733908934280.png",
  "https://busichat2.remap.ai/wp-content/uploads/2024/12/custom-integrations-2.png",
  "https://busichat2.remap.ai/wp-content/uploads/2024/12/gohighlevel.png",
];

// Zip the images after downloading, false to just save them in a folder
const toZip = true;

downloadImages(imageUrls, toZip);
