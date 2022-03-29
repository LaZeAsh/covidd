# **Covidd**

Covidd is a JavaScript/TypeScript library for getting covid information about different countries. The information provided is covid case count, covid death count, and covid recovery count.

**Note:** All of the data is provided by [worldometers.info](https://www.worldometers.info/coronavirus/) | Requires node

## **Use Cases:** 

Methods:
```js
getData(statistic, country)
```
statistic - deaths | cases | recovery | all\
all - array with deaths, cases, and recovery || array[0] = Cases; array[1] = Deaths; array[2] = Recovery
### JavaScript
```js
const Covid = require('covidd');
const covid = new Covid();
await covid.getData("cases", "USA");
```
### Typescript
```ts
import Covid from 'covid';
const covid = new Covid();
await covid.getData("cases", "USA")
```

NPM Package Link: https://www.npmjs.com/package/covidd