const express = require("express");
const app = express();
const puppeteer = require('puppeteer-core')
const fs = require('fs');
const path = require('path');
const { mkdirp } = require('mkdirp');

app.get("*", async (req, res) => {
    let url = req.path.substring(1) || 'www.comp.hkbu.edu.hk'
    let parts = url.split('/');
    let width = 1280;
    let height = 720;

    const prefix = '/tmp/url2png/';
    const dir = prefix + path.dirname(url);
    const filename = `${prefix}${url}.png`;
    if (dir) {
        mkdirp(dir);
    }

    if (fs.existsSync(filename)) {
        return res.sendFile(filename);
    }

    if (parts[0] && parseInt(parts[0])) {
        width = parseInt(parts[0]);
        parts.splice(0, 1);
        url = parts.join('/');
        if (parts[0] && parseInt(parts[0])) {
            height = parseInt(parts[0]);
            parts.splice(0, 1);
            url = parts.join('/');
        } else {
            height = Math.ceil(width / 16 * 9);
        }
    }

    try {
        const browser = await puppeteer.launch({
            executablePath:'/usr/bin/chromium', headless:'new', args:['--no-sandbox']
        });

        const page = await browser.newPage();
        await page.setViewport({
            width: width,
            height: height,
            deviceScale: 1
        });
        await page.goto(`https://${url}`, {waitUntil:'networkidle0'});
        await page.screenshot({path: filename});
        await browser.close();

        return res.sendFile(filename);
    } catch(ex) {
        return res.sendStatus(404);
    }
});

app.listen(3000, () => {
    console.log("Listen on the port 3000...");
});