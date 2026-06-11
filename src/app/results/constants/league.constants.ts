/**
 * League constants
 * Contains league configurations for TheSportsDB API
 */

import { League } from '../models/match.model';

export const LEAGUES: League[] = [
  {
    "id": "4328",
    "name": "English Premier League",
  },
  {
    "id": "4329",
    "name": "English League Championship",
  },
  {
    "id": "4330",
    "name": "Scottish Premier League",
  },
  {
    "id": "4331",
    "name": "German Bundesliga",
  },
  {
    "id": "4332",
    "name": "Italian Serie A",
  },
  {
    "id": "4334",
    "name": "French Ligue 1",
  },
  {
    "id": "4335",
    "name": "Spanish La Liga",
  },
  {
    "id": "4336",
    "name": "Greek Superleague Greece",
  },
  {
    "id": "4337",
    "name": "Dutch Eredivisie",
  },
  {
    "id": "4338",
    "name": "Belgian Pro League",
  }
];

export const DEFAULT_LEAGUE = LEAGUES[0];
