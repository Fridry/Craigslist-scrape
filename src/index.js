require("dotenv").config();
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const mongoose = require("mongoose");
const ListingModel = require("./model/Listing");
const connectToMongoose = require("./database/connect");

const url = process.env.CRAIGSLIST_URL;

async function scrapeListings(page) {
  await page.goto(url);

  const html = await page.content();

  const $ = cheerio.load(html);

  const listings = $(".result-info")
    .map((index, element) => {
      const titleElement = $(element).find(".result-title");
      const timeElement = $(element).find(".result-date");
      const hoodElement = $(element).find(".result-hood");

      const title = $(titleElement).text();
      const url = $(titleElement).attr("href");
      const date = new Date($(timeElement).attr("datetime"));
      const hood = $(hoodElement)
        .text()
        .trim()
        .replace("(", "")
        .replace(")", "");

      return {
        title,
        url,
        date,
        hood,
      };
    })
    .get();

  return listings;
}

async function scrapeJobsDescriptions(listings, page) {
  for (let i = 0; i < listings.length - 40; i++) {
    await page.goto(listings[i].url);
    const html = await page.content();
    const $ = cheerio.load(html);

    const jobDescription = $("#postingbody").text().trim();
    const jobCompensation = $("p.attrgroup > span:nth-child(1) > b")
      .text()
      .trim();

    listings[i].jobDescription = jobDescription;
    listings[i].jobCompensation = jobCompensation;

    const listingModel = new ListingModel(listings[i]);
    await listingModel.save();

    await sleep(1000);
  }
}

async function sleep(miliseconds) {
  return new Promise((resolve) => setTimeout(resolve, miliseconds));
}

async function main() {
  await connectToMongoose();

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const listings = await scrapeListings(page);

  const listingsWithJobsDescriptions = await scrapeJobsDescriptions(
    listings,
    page
  );
}

main();
