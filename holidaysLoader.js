import axios from 'axios';
import fs from 'fs';

const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027];
const getCountryCodes = async () => {
  const countries = await axios.get(
    `https://date.nager.at/api/v3/AvailableCountries`
  );

  return countries.data.map((c) => c.countryCode);
};

const getUniqueHolidays = (holidays) => {
  const uniqueHolidays = new Set();

  return holidays.filter((holiday) => {
    const holidayString = JSON.stringify(holiday);

    if (uniqueHolidays.has(holidayString)) {
      return false;
    }

    uniqueHolidays.add(holidayString);
    return true;
  });
};

async function getWorldwideHolidays(year) {
  const countryCodes = await getCountryCodes();
  const holidayPromises = countryCodes.map((countryCode) =>
    axios.get(
      `https://date.nager.at/api/v2/PublicHolidays/${year}/${countryCode}`
    )
  );

  const responses = await Promise.all(holidayPromises);

  return getUniqueHolidays(
    responses.flatMap((response) => {
      return response.data
        .filter((h) => h.global)
        .map(({ date, name }) => ({ name, date }));
    })
  );
}

function writeJsonFile(key, content) {
  const fileName = `./public/assets/holidays/${key}.json`;
  fs.writeFileSync(fileName, JSON.stringify(content, null, 2));
}

const createHolidayFiles = async () => {
  const holidays = await Promise.all(
    years.map((year) => getWorldwideHolidays(year))
  );

  holidays.forEach((yearHolidays, index) => {
    writeJsonFile(years[index], yearHolidays);
  });
};

createHolidayFiles();
