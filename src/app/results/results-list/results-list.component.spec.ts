import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { Match } from '../models/match.model';
import { MatchApiService } from '../services/match-api.service';
import { ResultsListPage } from './results-list.component';

function createMatch(idEvent: string, homeScore: string | null, awayScore: string | null): Match {
  return {
    idEvent,
    strEvent: `Match ${idEvent}`,
    strEventAlternate: null,
    idHomeTeam: `home-${idEvent}`,
    idAwayTeam: `away-${idEvent}`,
    strHomeTeam: `Home ${idEvent}`,
    strAwayTeam: `Away ${idEvent}`,
    intHomeScore: homeScore,
    intAwayScore: awayScore,
    intRound: null,
    dateEvent: '2026-06-01',
    dateEventLocal: null,
    strTimestamp: null,
    strTime: null,
    strTimeLocal: null,
    strLeague: 'English Premier League',
    idLeague: '4328',
    strLeagueBadge: null,
    strSeason: '2025-2026',
    strDescriptionEN: null,
    strHomeTeamBadge: null,
    strAwayTeamBadge: null,
    strVenue: null,
    strCountry: null,
    strCity: null,
    strPoster: null,
    strSquare: null,
    strThumb: null,
    strBanner: null,
    strStatus: null,
    strPostponed: null,
    strResult: null,
  };
}

describe('ResultsListPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultsListPage],
      providers: [
        provideRouter([]),
        {
          provide: MatchApiService,
          useValue: {
            getRecentMatches$: () => of([]),
          },
        },
      ],
    }).compileComponents();
  });

  it('computes KPIs from the currently filtered matches', () => {
    const fixture = TestBed.createComponent(ResultsListPage);
    const component = fixture.componentInstance;

    component.matches.set([
      createMatch('1', '2', '1'),
      createMatch('2', '0', '3'),
      createMatch('3', '1', '1'),
    ]);

    expect(component.totalMatches()).toBe(3);
    expect(component.totalGoals()).toBe(8);
    expect(component.averageGoals()).toBe('2.7');
  });

  it('sorts visible matches by goals when the sort toggle is enabled', () => {
    const fixture = TestBed.createComponent(ResultsListPage);
    const component = fixture.componentInstance;

    component.matches.set([
      createMatch('low', '1', '0'),
      createMatch('high', '4', '2'),
      createMatch('mid', '2', '1'),
    ]);
    component.isSortedByGoals.set(true);

    expect(component.visibleMatches().map((match) => match.idEvent)).toEqual(['high', 'mid', 'low']);
  });
});
