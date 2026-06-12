/**
 * Match result model
 * Types for TheSportsDB API responses.
 */

export interface Match {
  idEvent: string;
  idAPIfootball: string | null;
  strSport: string | null;
  strEvent: string;
  strEventAlternate: string | null;
  strFilename: string | null;
  idHomeTeam: string;
  idAwayTeam: string;
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore: string | null;
  intAwayScore: string | null;
  intRound: string | null;
  intSpectators: string | null;
  strOfficial: string | null;
  strWeather: string | null;
  dateEvent: string;
  dateEventLocal: string | null;
  strTimestamp: string | null;
  strTime: string | null;
  strTimeLocal: string | null;
  strLeague: string;
  idLeague: string;
  strLeagueBadge: string | null;
  strSeason: string | null;
  strDescriptionEN: string | null;
  strHomeTeamBadge: string | null;
  strAwayTeamBadge: string | null;
  intScore: string | null;
  intScoreVotes: string | null;
  idVenue: string | null;
  strVenue: string | null;
  strCountry: string | null;
  strCity: string | null;
  strPoster: string | null;
  strSquare: string | null;
  strFanart: string | null;
  strThumb: string | null;
  strBanner: string | null;
  strMap: string | null;
  strTweet1: string | null;
  strVideo: string | null;
  strStatus: string | null;
  strPostponed: string | null;
  strResult: string | null;
  strLocked: string | null;
}

export interface League {
  id: string;
  name: string;
}

/**
 * TheSportsDB API response wrapper.
 * Both eventspastleague.php and lookupevent.php return the same top-level key.
 */
export interface EventsResponse {
  events: Match[] | null;
}
