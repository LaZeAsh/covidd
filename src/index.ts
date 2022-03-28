import axios from 'axios';
import { load } from 'cheerio';
import  dataType from './types';
class Covid {
  private url: string = `https://www.worldometers.info/coronavirus/country/`
  constructor() {

  }
  /**
   * @param statistic Cases, Deaths, Recovery, All
   * @param country Most of the countries listed on worldometers.info
   * @returns String | String[] [0] = Cases; [1] = Deaths; [2] = Recovery
   */
  private async getStatistic(statistic: string, country: string): Promise<string[] | string> {
    //Gets the right link for the website to scrape the data from
    this.url = this.parseCountryNames(country);
    let variable = await this.scrapeData(this.url, ".maincounter-number");
    //Cases = 0; Deaths = 1; Recovery = 2;
    let allData = this.cleanData(variable);
    if(statistic.toLowerCase() === "recovery" || statistic.toLowerCase() === "recoveries") {
      return allData[2];
    } else if(statistic.toLowerCase() === "death" || statistic.toLowerCase() === "deaths") {
      return allData[1];
    } else if(statistic.toLowerCase() === "case" || statistic.toLowerCase() === "cases") {
      return allData[0];
    } else if(statistic.toLowerCase() === "all") {
      return allData;
    } else {
      throw new Error("Valid type of data to return not inputted");
    }
    return "No Data found";
  }

  /**
   * @param statistic Cases, Deaths, Recovery, All
   * @param country Most of the countries listed on worldometers.info
   * @returns String | String[] [0] = Cases; [1] = Deaths; [2] = Recovery
   */
  public async getData(statistic: dataType["type"], country: dataType["country"]): Promise<string[] | string> {
    return this.getStatistic(statistic, country);
  }
  
  /**
   * @param url - Website URL for the information to be scrapped
   * @param scraper - HTML Element to get the data from
   * @returns Unfiltered Data
   */
  private async scrapeData(url: string, scraper: string): Promise<string> {
    let dataToReturn = "";
    try {
      const { data } = await axios.get(url);
      const $ = load(data);
      dataToReturn = $(scraper).text();
    } catch (error) {
      throw new Error(error as string);
    }
    return dataToReturn;
  }

  /**
   * @param input - Country 
   * @returns URL with ending cooresponding to the country
   */
  private parseCountryNames(input: string): string {
    let webEnding = undefined;
    //List of all the countries and the endings 
    const countries: string[] = ["usa", "india", "brazil", "france", "uk", "germany", "russia", "turkey", "italy", "spain", "south korea", "argentina", "vietnam", "netherlands", "iran", "colombia", "japan", "poland", "mexico", "ukraine", "malaysia", "australia", "israel", "czechia", "belgium", "south africa", "phillippines", "peru", "austria", "portugal", "canada", "chile", "thailand", "switzerland", "denmark", "romania", "greece", "sweden", "iraq", "serbia", "bangladesh", "hungary", "jordan", "georgia", "slovakia", "pakistan", "norway", "ireland", "kazakhstan", "morocco", "bulgaria", "lebanon", "croatia", "cuba", "hong kong", "tunisia", "singapore", "lithuania", "nepal", "belarus", "slovenia", "bolivia", "uae", "uruguay", "ecuador", "costa rica", "guatemala", "azerbaijan", "finland", "lativa", "panama", "saudi arabia", "sri lanka", "paraguay", "kuwait", "myanmar", "palestine", "dominican republic", "bahrain", "estonia", "venezuela", "moldova", "libya", "egypt", "new zealand", "ethiopia", "mongolia", "armenia", "honduras", "oman", "cyprus", "bosnia and herezgovina", "qatar", "kenya", "reunion", "zambia", "north macedonia", "albania", "algeria", "botswana", "nigeria", "zimbabwe", "uzbekistan", "montenegro", "mozambique", "kyrgyzstan", "luxembourg", "afghanistan", "maldives", "iceland", "uganda", "el salvador", "ghana", "laos", "martinique", "trinidad and tobago", "cambodia", "guadeloupe", "china", "rwanda", "jamaica", "brunei", "cameroon", "angola", "drc", "senegal", "malawi", "ivory coast", "suriname", "french guiana", "malta", "french polynesia", "eswatini", "fiji", "madagascar", "guyana", "sudan", "channel islands", "new caledonia", "mauritania", "barbados", "belize", "cabo verde", "syria", "gabon", "papua new guinea", "curacao", "seychelles", "andorra", "burundi", "togo", "mayotte", "guinea", "mauritius", "faeroe islands", "aruba", "tanzania", "bahamas", "lesotho", "haiti", "mali", "benin", "somalia", "isle of man", "congo", "saint lucia", "timor-leste", "bhutan", "taiwan", "burkina faso", "cayman islands", "nicaragua", "tajikistan", "south sudan", "gibraltar", "equatorial guinea", "djibouti", "liechtenstein", "san marino", "car", "gremada", "bermuda", "gambia", "greenland", "yemen", "dominica", "moncao", "saint martin", "solomon islands", "eritrea", "sint maarten", "niger", "guinea-bissau", "comoros", "carribean netherlands", "sierra leone", "antigua and barbuda", "liberia", "chad", "st. vincet grenadines", "british virgin islands", "sao tome and principle", "turks and caicos", "saint kitts and nevis", "palau", "st. barth", "tonga", "kiribati", "anguilla", "saint pierre miquelon", "vanuatu", "cook islands", "wallis and futuna", "montserrat", "falkland islands", "samoa", "macao", "vatican city", "western sahara", "marshall islands", "saint helena", "micronesia", "niue"];
    const countryCodes: string[] = ["us", "india", "brazil", "france", "uk", "germany", "russia", "turkey", "italy", "spain", "south-korea", "argentina", "vietnam", "netherlands", "iran", "colombia", "japan", "poland", "mexico", "ukraine", "malaysia", "australia", "israel", "czechia", "belgium", "south-africa", "phillippines", "peru", "austria", "portgual", "canada", "chile", "thailand", "switzerland", "denmark", "romania", "greece", "sweden", "iraq", "serbia", "bangladesh", "hungary", "jordan", "georgia", "slovakia", "pakistan", "norway", "ireland", "kazakhstan", "morocco", "bulgaria", "lebanon", "croatia", "cuba", "hong-kong-sar", "tunisia", "singapore", "lithuania", "nepal", "belarus", "slovenia", "bolivia", "united-arab-emirates", "uruguay", "ecuador", "costa-rica", "guatemala", "azerbaijan", "finland", "lativa", "panama", "saudi-arabia", "sri-lanka", "paraguay", "kuwait", "myanmar", "palestine", "dominican-republic", "bahrain", "estonia", "venezuela", "moldova", "libya", "egypt", "new-zealand", "ethiopia", "mongolia", "armenia", "honduras", "oman", "cyprus", "bosnia-and-herzegovina", "qatar", "reunion", "zambia", "macedonia", "albania", "algeria", "botswana", "nigeria", "zimbabwe", "uzbekistan", "montenegro", "mozambique", "kyrgyzstan", "luxembourg", "afghanistan", "maldives", "iceland", "uganda", "el-salvador", "ghana", "namibia", "laos", "martinique", "trinidad-and-tobago", "cambodia", "guadeloupe", "china", "rwanda", "jamaica", "brunei", "cameroon", "angola", "democratic-republic-of-the-congo", "senegal", "malawi", "cote-d-ivoire", "suriname", "french-guiana", "malta", "french-polynesia", "eswatini", "fiji", "madagascar", "guyana", "sudan", "channel-islands", "new-caledonia", "mauritania", "barbados", "belize", "cabo-verde", "syria", "gabon", "papua-new-guinea", "curaco", "seychelles", "andorra", "burundi", "togo", "mayotte", "guinea", "mauritius", "faeroe-islands", "aruba", "tanzania", "bahamas", "lesotho", "haiti", "mali", "benin", "somalia", "isle-of-man", "congo", "saint-lucia", "timor-leste", "bhutan", "taiwan", "burkina-faso", "cayman-islands", "nicaragua", "tajikistan", "south-sudan", "gibraltar", "equatorial-guinea", "djibouti", "liechtenstein", "san-marino", "central-african-republic", "grenada", "bermuda", "gambia", "greenland", "yemen", "dominica", "monaco", "saint-martin", "solomon-islands", "eritrea", "sint-maarten", "niger", "guinea-bissau", "comoros", "carribean-netherlands", "sierra-leone", "antigua-and-barbuda", "liberia", "chad", "saint-vincent-and-the-grenadines", "british-virgin-islands", "sao-tome-and-principe", "turks-and-caicos-islands", "saint-kitts-and-nevis", "palau", "saint-barthelemy", "tonga", "kiribati", "anguilla", "saint-pierre-and-miquelon", "vanuatu", "cook-islands", "wallis-and-futuna-islands", "montserrat", "falkland-islands-malvinas", "samoa", "macao", "holy-see", "western-sahara", "marshall-islands", "saint-helena", "micronesia", "niue"];
    let index: number = 0;
    for (const code of countries) {
      //For loop to find the country with it's cooresponding ending for the base URL (not efficient)
      if(code === input.toLowerCase()) {
        webEnding = countryCodes[index];
        break;
      }
      index++;
    }
    if(webEnding === undefined) {
      //Only happens if the country doesn't exist OR it is not supported by worldometers.info
      throw new Error("Data on country not available check https://www.worldometers.info/coronavirus/ for valid countries");
    } else {
      return `${this.url}${webEnding}/`;
    }
  }

  private cleanData(data: string): string[] {
    let dataArray: string[] = [];
    //Clears the data with things that are not needed
    data.split("\n").forEach((doc) => {
      if(!doc) return;
      let output = doc.replace(/\s/g, '')
      if(output.length === 0) return;
      if(doc.length === 0) return;
      doc = doc.replace(/\s/g, '')
      if(doc.endsWith("total")) {
        doc = doc.replace("total", "");
      }
      dataArray.push(doc);
    })
    return dataArray;
  }
}


export = Covid;



/*
Note to self for tomorrow:
- Make docs (small website maybe?)
- Credit worldometers
- Add comments to code so it's easy to understand
- Publish to npm
*/