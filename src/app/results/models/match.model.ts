/**
 * Match result model
 * Types for TheSportsDB API responses
 */

export interface Match {
  idEvent: string;
  strEvent: string;
  strEventAlternative: string | null;
  idHomeTeam: string;
  idAwayTeam: string;
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore: number | null;
  intAwayScore: number | null;
  intRound: string | null;
  strDate: string;
  strTime: string | null;
  strLeague: string;
  idLeague: string;
  strSeason: string | null;
  strDescriptionEN: string | null;
  strHomeTeamBadge: string | null;
  strAwayTeamBadge: string | null;
  strVenue: string | null;
  strHomeFormation: string | null;
  strAwayFormation: string | null;
  strStatus: string | null;
  strPostponed: string | null;
  strResult: string | null;
}

export interface League {
  id: string;
  name: string;
}

/**
 * TheSportsDB API response wrapper
 */
export interface EventsResponse {
  results: Match[] | null;
}

export interface EventResponse {
  results: Match[] | null;
}
