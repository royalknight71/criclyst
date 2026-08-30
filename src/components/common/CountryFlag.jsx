const COUNTRY_TO_ISO = {
  india: "in",
  england: "gb-eng",
  australia: "au",
  pakistan: "pk",
  "new zealand": "nz",
  "south africa": "za",
  "sri lanka": "lk",
  bangladesh: "bd",
  afghanistan: "af",
  ireland: "ie",
  zimbabwe: "zw",
  "west indies": "wi",
  windies: "wi",
  wi: "wi",
  "west-indies": "wi",
  nepal: "np",
  "united states": "us",
  "united arab emirates": "ae",
  canada: "ca",
  namibia: "na",
  scotland: "gb",
  netherlands: "nl",
  "papua new guinea": "pg",
  oman: "om",
  zambia: "zm",
  uganda: "ug",
  kenya: "ke",
  "hong kong": "hk",
  japan: "jp",
  china: "cn",
  germany: "de",
  france: "fr",
  "united kingdom": "gb",
  usa: "us",
  uk: "gb",
};

export default function CountryFlag({ country, className = "" }) {
  if (!country) return null;
  const code = COUNTRY_TO_ISO[country.toLowerCase()];
  if (!code) return null;
  return (
    <span
      className={`fi fi-${code} ${className}`}
      title={country}
    />
  );
}
