// server.js
const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/api/export-chart', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send('URL parameter is required');
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Wait for chart to render
    await page.waitForTimeout(5000); // Adjust timeout as needed

    const screenshot = await page.screenshot({ type: 'png' });

    await browser.close();

    res.setHeader('Content-Disposition', 'attachment; filename=chart.png');
    res.setHeader('Content-Type', 'image/png');
    res.send(screenshot);
  } catch (error) {
    res.status(500).send('Failed to capture screenshot');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
